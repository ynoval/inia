import { Injectable } from '@nestjs/common';
import * as ee from '@google/earthengine';
import * as dayjs from 'dayjs';
import { CommunityService } from '../community/community.service';
import { Maps, MapType, MapModel } from './gee.models';
import { GoogleEarthEngineProvider } from '../core/gee.provider';
import { FILTER_PARAMS, MAP_PATH } from './gee.constants';

@Injectable()
export class GEEService {
  constructor(
    private communityService: CommunityService,
    private gee: GoogleEarthEngineProvider
  ) {}

  async getMap(mapType: MapType): Promise<MapModel> {
    return this.getMapInfo(mapType);
  }

  /**
   * Return all information layers
   * PPNA, PPT, T, CPUr, ROU
   */
  async getInformationMaps(): Promise<MapModel[]> {
    try {
      const promises = [
        this.getMapInfo('ROU'),
        this.getMapInfo('CPUr'),
        this.getMapInfo('PPNA'),
        this.getMapInfo('PPT'),
        this.getMapInfo('T'),
        // this.getMapInfo('BH'),
        // this.getMapInfo('ET'),
        // this.getMapInfo('BHr'),
      ];
      return await Promise.all(promises);
    } catch (e) {
      console.log(`ERROR GEEService-getCommunitiesMaps:  ${e} `);
      throw e;
    }
  }

  /**
   * Return all communities layers
   */
  async getCommunitiesMaps(): Promise<MapModel[]> {
    try {
      const promises = [
        this.getMapInfo('PrB'),
        this.getMapInfo('Pr'),
        this.getMapInfo('PdB'),
        this.getMapInfo('Pd'),
        this.getMapInfo('PE'),
      ];
      return await Promise.all(promises);
    } catch (e) {
      console.log(`ERROR GEEService-getCommunitiesMaps:  ${e} `);
      throw e;
    }
  }

  /**
   *  Param: ZoneInfo (coordinates and geometry type (marker, polygon or rectangle))
   *  Return Zone Information
   *   Coordinates (if zone is a point)
   *   Area and Perimeter (if zone is a polygon)
   *   Comunities ( list of communities with the % of zone iincluded in every community)
   *   Productivity Info
   *    - historical means
   *    - monthly means (for current year and previous)
   */
  async getZoneInformation(zoneInfo) {
    try {
      const zone = this.createZone(zoneInfo.type, zoneInfo.coordinates);
      return {
        latitude: zoneInfo.type === 'marker' ? zoneInfo.coordinates[1] : null,
        longitude: zoneInfo.type === 'marker' ? zoneInfo.coordinates[0] : null,
        area:
          zoneInfo.type !== 'marker'
            ? await this.computeZoneArea(zone).toFixed(2)
            : null,
        perimeter:
          zoneInfo.type !== 'marker'
            ? await this.computeZonePerimeter(zone).toFixed(2)
            : null,
        communitiesAreas: await this.computeZoneAreaByCommunity(zone),
      };
    } catch (e) {
      console.log('EEE', e);
    }
  }

  async getCommunityPPNAInformation(communityOrder) {
    try {
      const community = await this.createCommunityImage(communityOrder);
      const currentYear = dayjs().year();
      return {
        historicalAveragePPNA: {
          values: await this.getAnnualPPNAMean(community),
        },
        ppna: [
          {
            year: currentYear,
            values: await this.getZonePPNAByYear(community, currentYear),
          },
        ],
      };
    } catch (e) {
      console.log('EEE', e);
    }
  }

  async getZoneAnnualPPNA(zoneInfo, year) {
    const zone = this.createZone(zoneInfo.type, zoneInfo.coordinates);
    return {
      year: year,
      values: await this.getZonePPNAByYear(zone, year),
    };
  }

  async getZoneAnnualPPNAMean(zoneInfo) {
    const zone = this.createZone(zoneInfo.type, zoneInfo.coordinates);
    return {
      values: await this.getAnnualPPNAMean(zone),
    };
  }

  async getZoneHistoricalPPNA(zoneInfo) {
    const zone = this.createZone(zoneInfo.type, zoneInfo.coordinates);
    return this.getHistoricalPPNA(zone);
  }

  async getCommunityAnnualPPNA(communityOrder, year) {
    const community = await this.createCommunityImage(communityOrder);
    return {
      year: year,
      values: await this.getZonePPNAByYear(community, year, true),
    };
  }

  async getCommunityAnnualPPNAMean(communityOrder) {
    const community = await this.createCommunityImage(communityOrder);
    return {
      values: await this.getAnnualPPNAMean(community, true),
    };
  }

  async getCommunityHistoricalPPNA(communityOrder) {
    const community = await this.createCommunityImage(communityOrder);
    return this.getHistoricalPPNA(community, true);
  }

  //#region Private Methods
  private async getMapInfo(mapType: MapType): Promise<MapModel> {
    const mapInfo = new Maps().getMapInfo(mapType);
    const communityInfo = await this.getCommunityInfo(mapInfo.communityOrder);
    return new Promise((resolve, reject) => {
      try {
        mapInfo.getResource().getMap(mapInfo.visualiationParams, (result) => {
          return resolve({
            mapType: mapType,
            mapId: result.mapid,
            urlTemplate: result.urlFormat,
            layerLabel: mapInfo.layerLabel,
            layerDescription: mapInfo.layerDescription,
            communityInfo: communityInfo ? communityInfo : undefined,
          });
        });
      } catch (e) {
        reject(e);
      }
    });
  }

  private getCommunityInfo(communityOrder: string) {
    return this.communityService
      .getOneByOrder(communityOrder)
      .then((community) => {
        return {
          order: community.order,
          id: community.id,
          name: community.name,
        };
      })
      .catch((e) => {
        return undefined;
      });
  }

  private createZone(type, coordinates) {
    switch (type) {
      case 'marker': {
        return new ee.Geometry.Point(coordinates);
      }
      case 'polygon': {
        return ee.Geometry.Polygon(coordinates);
      }
      case 'rectangle': {
        return ee.Geometry.Rectangle([
          [coordinates[3], coordinates[2]],
          [coordinates[5], coordinates[0]],
        ]);
      }
    }
  }

  private computeZoneArea(zone) {
    const data = zone.area().multiply(0.0001); //ha //divide(1000 * 1000); // KMˆ2
    return data.getInfo();
  }

  private async computeZoneAreaByCommunity(zone) {
    const CPUr = ee.Image(
      'users/bagnato/PronosticoForrajero/ComunidadesDePastizal/ComunidadesPastizal'
    );
    const areasInfo = ee.Image.pixelArea()
      .multiply(0.0001)
      .addBands(CPUr)
      .reduceRegion({
        reducer: ee.Reducer.sum().group(1),
        geometry: zone,
        scale: 30,
        maxPixels: 1e12,
      });
    const areas = await areasInfo.getInfo();
    const promises = [];

    areas.groups.forEach(async (info) => {
      console.log({ info });
      const communityOrder = this.getCommunityOrder(info.group);
      promises.push(this.getCommunityInfo(communityOrder));
    });
    return Promise.all(promises).then((communities) => {
      return communities.map((community, index) => {
        return { ...community, area: areas.groups[index].sum.toFixed(2) };
      });
    });
  }

  private computeZonePerimeter(zone) {
    const data = zone.perimeter().divide(1000); // KM
    return data.getInfo();
  }

  private async getZonePPNAByYear(zone, year, applyMask = false) {
    if (year <= 2000) {
      return [];
    }
    if (year > dayjs().year()) {
      return [];
    }
    if (year === dayjs().year()) {
      return this.getCurrentYearPPNA(zone, applyMask);
    }

    const yearData = await this.getZonePPNAData(zone, year, applyMask);
    const yearValues = await yearData.getInfo();
    console.log({ yearValues });
    const yearResult = this.getPPNAMonthly(yearValues);

    let nextYearResult = [];
    if (
      year !== dayjs().year() - 1 ||
      dayjs().month() !== 0 ||
      dayjs().date() > 20
    ) {
      const nextYearData = await this.getZonePPNAData(
        zone,
        year + 1,
        applyMask
      );
      const nextYearValues = await nextYearData.getInfo();
      console.log({ nextYearValues });
      nextYearResult = this.getPPNAMonthly(nextYearValues);
    }

    //add Predictions
    // if (year === dayjs().year() - 1) {
    //   const predictionValues = this.getZonePrediction(zone);
    //   const currentMonth = dayjs().month();
    //   for (let i = 0; i <= 2; i++) {
    //     nextYearResult.push(predictionValues[currentMonth + i]);
    //   }
    // }
    return this.getPPNAProductiveValues(yearResult, nextYearResult);
  }

  private getZonePPNAData(zone, year, applyMask = false) {
    const geometry = !applyMask ? zone : zone.geometry(500);
    // const mapPath =
    //   year === dayjs().year() ? MAP_PATH.PPNA_CURRENT_YEAR : MAP_PATH.PPNA;
    const mapPath = MAP_PATH.PPNA;

    let ppna = ee.Image(mapPath).select([`b${year}.*`]);
    if (applyMask) {
      ppna.unmask();
      ppna = ppna.updateMask(zone);
    }
    return ppna.reduceRegion({
      reducer: ee.Reducer.mean(),
      geometry: geometry,
      scale: FILTER_PARAMS.SCALE,
      maxPixels: FILTER_PARAMS.MAX_PIXELS,
    });
  }

  getPPNAMonthly(data) {
    console.log({ data });
    const results = [];
    const sortData = Object.entries(data).sort((a, b) => {
      const aKey = a[0].split('-')[1];
      const bKey = b[0].split('-')[1];
      return +aKey < +bKey ? -1 : 1;
    });
    for (const [key, value] of sortData) {
      const [, day] = key.split('-');
      results.push({
        // day: dayjs('2021-01-01')
        //   .add(+day - 1, 'day')
        //   .format('MMM DD'),
        day: +day,
        ppna: (+value).toFixed(2),
      });
    }
    console.log({ results });
    return results;
  }

  // private getPPNAMonthly(data) {
  //   const result = [];
  //   let lastMonth = 0;
  //   let sumValue = 0;
  //   let amountValue = 0;
  //   const sortData = Object.entries(data).sort((a, b) => {
  //     const aKey = a[0].split('-')[1];
  //     const bKey = b[0].split('-')[1];
  //     return +aKey < +bKey ? -1 : 1;
  //   });
  //   for (const [key, value] of sortData) {
  //     const [, day] = key.split('-');
  //     const month = dayjs('2021-01-01')
  //       .add(+day - 1, 'day')
  //       .month();
  //     if (month === lastMonth) {
  //       amountValue++;
  //       sumValue += +value;
  //     } else {
  //       result.push({
  //         month: lastMonth,
  //         ppna: +(sumValue / amountValue).toFixed(2),
  //       });
  //       amountValue = 1;
  //       sumValue = +value;
  //     }
  //     lastMonth = month;
  //   }
  //   result.push({
  //     month: lastMonth,
  //     ppna: +(sumValue / amountValue).toFixed(2),
  //   });
  //   return result.sort((a, b) => {
  //     return +a.month < +b.month ? -1 : 1;
  //   });
  // }

  private getPPNAProductiveValues(yearResult, nextYearResult) {
    console.log({ yearResult }, { nextYearResult });
    const result = [...yearResult.slice(12), ...nextYearResult.slice(0, 12)];
    return result;
  }

  private async getCurrentYearPPNA(zone, applyMask = false) {
    const currentMonth = dayjs().month();
    const currentDay = dayjs().date();
    const nextYearResult = [];
    let currentYearResult = [];

    if (currentMonth > 0 || currentDay > 20) {
      const currentYearData = await this.getZonePPNAData(
        zone,
        dayjs().year(),
        applyMask
      );
      console;
      const currentYearValues = await currentYearData.getInfo();
      currentYearResult = this.getPPNAMonthly(currentYearValues);
    }

    // Add prediction  values (3 months)
    // const predictionValues = this.getZonePrediction(zone);

    // for (let i = 0; i <= 2; i++) {
    //   if (currentMonth + i <= 11) {
    //     currentYearResult.push(predictionValues[currentMonth + i]);
    //   } else {
    //     nextYearResult.push(predictionValues[currentMonth + i - 12]);
    //   }
    // }
    return this.getPPNAProductiveValues(currentYearResult, nextYearResult);
  }

  // TODO: IMPLEMENT!!
  // private getZonePrediction(zone) {
  //   return [
  //     { month: 0, ppna: 403.11 },
  //     { month: 1, ppna: 349.5 },
  //     { month: 2, ppna: 301.5 },
  //     { month: 3, ppna: 265.5 },
  //     { month: 4, ppna: 233.5 },
  //     { month: 5, ppna: 205.5 },
  //     { month: 6, ppna: 163.76 },
  //     { month: 7, ppna: 232.65 },
  //     { month: 8, ppna: 345.86 },
  //     { month: 9, ppna: 354.68 },
  //     { month: 10, ppna: 318.39 },
  //     { month: 11, ppna: 356.5 },
  //   ];
  // }

  private async getAnnualPPNAMean(zone, applyMask = false) {
    const geometry = !applyMask ? zone : zone.geometry(500);
    let ppna = ee
      .Image('users/bagnato/PronosticoForrajero/PPNA-16_PromedioHistorico') // TODO: RENAME and MOVE TO GCP APP FOLDER
      .select(['b.*']);

    if (applyMask) {
      ppna.unmask();
      ppna = ppna.updateMask(zone);
    }
    const data = ppna.reduceRegion({
      reducer: ee.Reducer.mean(),
      geometry: geometry,
      scale: 231.65635826395828,
      maxPixels: 1e12,
    });
    const values = await data.getInfo();
    //Rename Bands (eg: b1 --> b-1)
    const renamedValues: any = {};
    for (const [key, value] of Object.entries(values)) {
      const [, day] = key.split('b');
      const newKey = `b-${day}`;
      renamedValues[newKey] = value;
    }
    const result = this.getPPNAMonthly(renamedValues);
    return [...result.slice(12), ...result.slice(0, 12)];
    //Sort Mean in productive order (July - June)
    // return result.sort((a, b) =>
    //   (+a.day + 6) % 12 < (+b.month + 6) % 12 ? -1 : 1
    // );
  }

  private async getHistoricalPPNA(zone, applyMask = false) {
    const geometry = !applyMask ? zone : zone.geometry(500);
    let ppna = ee.Image(
      'projects/gee-inia/assets/PPNA-16_PromedioHistoricoPorAnno_new'
    );
    if (applyMask) {
      ppna.unmask();
      ppna = ppna.updateMask(zone);
    }

    const data = ppna.reduceRegion({
      reducer: ee.Reducer.mean(),
      geometry: geometry,
      scale: 231.65635826395828,
      maxPixels: 1e12,
    });
    const values = await data.getInfo();
    const result = [];
    for (const [key, value] of Object.entries(values)) {
      const [, year] = key.split('b');
      result.push({
        year: year,
        ppna: (value as number).toFixed(2),
      });
    }
    return result.sort((a, b) => {
      return +a.year < +b.year ? -1 : 1;
    });
  }

  private async createCommunityImage(communityOrder: string) {
    let path = '';

    switch (communityOrder) {
      case 'I': {
        path = MAP_PATH['PrB'];
        break;
      }
      case 'II': {
        path = MAP_PATH['Pr'];
        break;
      }
      case 'III': {
        path = MAP_PATH['PdB'];
        break;
      }
      case 'IV': {
        path = MAP_PATH['Pd'];
        break;
      }
      case 'VI': {
        path = MAP_PATH['PdE'];
        break;
      }
    }
    return new ee.Image(path);
  }

  private getCommunityOrder(id: number) {
    switch (id) {
      case 1:
        return 'VI';
      case 2:
        return 'III';
      case 3:
        return 'IV';
      case 4:
        return 'I';
      case 5:
        return 'II';
    }
  }
  //#endregion
}
