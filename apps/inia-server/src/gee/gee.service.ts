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

  async getPoliceSectionals() {
    const mapInfo = new Maps().getMapInfo('SP');
    const fc = await mapInfo.getResource().getInfo();
    return fc.features;
  }

  async getBasins(grade: 'I' | 'II' | 'III' | 'IV' | 'V') {
    const mapInfo = new Maps().getMapInfo(`C_${grade}`);
    const fc = await mapInfo.getResource().getInfo();
    return fc.features;
  }

  async getPadron(padronId: string, department: string) {
    const mapInfo = new Maps().getMapInfo('PADRONES');
    const fc = await mapInfo.getResource();
    // Filter the features based on a PADRON AND DEPARTMENT
    const filter = ee.Filter.and(
      ee.Filter.eq('CODDEPTO', department),
      ee.Filter.eq('PADRON', parseInt(padronId))
    )
    const filteredFc = fc.filter(filter);

    // Get the first feature in the filtered FeatureCollection
    const feature = filteredFc.first();
    return feature.getInfo();
  }

  async validatePadron(padronId: string, department: string) {
    const mapInfo = new Maps().getMapInfo('PADRONES');
    const fc = await mapInfo.getResource();
    // Filter the features based on a PADRON AND DEPARTMENT
    const filter = ee.Filter.and(
      ee.Filter.eq('CODDEPTO', department),
      ee.Filter.eq('PADRON', Number.parseInt(padronId))
    )
    const filteredFc = fc.filter(filter);
    const isValid = filteredFc.size().gt(0);
    const result = isValid.getInfo();
    console.log("valid padron: ", result)
    return result;
  }

  async getDepartments() {
    const mapInfo = new Maps().getMapInfo('PADRONES');
    const fc = await mapInfo.getResource();
    const departaments = fc.aggregate_array('NOMDPTO').distinct();
    departaments.sort();
    return departaments.getInfo();
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
        this.getMapInfo('PPT'),
        this.getMapInfo('T'),
        this.getMapInfo('PPNA'),
        // this.getMapInfo('SP'),
        // this.getMapInfo('C_I'),
        // this.getMapInfo('C_II'),
        // this.getMapInfo('C_III'),
        // this.getMapInfo('C_IV'),
        // this.getMapInfo('C_V'),
        // this.getMapInfo('BH'),
        this.getMapInfo('ET'),
        this.getMapInfo('RH'),
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
   *   Communities ( list of communities with the % of zone included in every community)
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

  // #region PPNA - Community
  async getCommunityAnnualPPNA(communityOrder, year) {
    const community = await this.createCommunityImage(communityOrder);
    return {
      year: year,
      values: await this.getPPNAByYear(community, year, true),
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

  // #endregion PPNA - Community

  // #region APAR - Community
  async getCommunityAnnualAPAR(communityOrder, year) {
    const community = await this.createCommunityImage(communityOrder);
    return {
      year: year,
      values: await this.getAPARByYear(community, year, true),
    };
  }

  async getCommunityAnnualAPARMean(communityOrder) {
    const community = await this.createCommunityImage(communityOrder);
    return {
      values: await this.getAnnualAPARMean(community, true),
    };
  }

  async getCommunityHistoricalAPAR(communityOrder) {
    const community = await this.createCommunityImage(communityOrder);
    return this.getHistoricalAPAR(community, true);
  }

  // #endregion APAR - Community

  // #region ET - Community
  async getCommunityAnnualET(communityOrder, year) {
    const community = await this.createCommunityImage(communityOrder);
    return {
      year: year,
      values: await this.getETByYear(community, year, true),
    };
  }

  async getCommunityAnnualETMean(communityOrder) {
    const community = await this.createCommunityImage(communityOrder);
    return {
      values: await this.getAnnualETMean(community, true),
    };
  }

  async getCommunityHistoricalET(communityOrder) {
    const community = await this.createCommunityImage(communityOrder);
    return this.getHistoricalET(community, true);
  }
  // #endregion ET - Community

  // #region RH- Community
  async getCommunityAnnualRH(communityOrder, year) {
    const community = await this.createCommunityImage(communityOrder);
    return {
      year: year,
      values: await this.getRHByYear(community, year, true),
    };
  }

  async getCommunityAnnualRHMean(communityOrder) {
    const community = await this.createCommunityImage(communityOrder);
    return {
      values: await this.getAnnualRHMean(community, true),
    };
  }

  async getCommunityHistoricalRH(communityOrder) {
    const community = await this.createCommunityImage(communityOrder);
    return this.getHistoricalRH(community, true);
  }
  // #endregion RH- Community

  // #region RHProp - Community
  async getCommunityAnnualRHProp(communityOrder, year) {
    const community = await this.createCommunityImage(communityOrder);
    return {
      year: year,
      values: await this.getRHPropByYear(community, year, true),
    };
  }

  async getCommunityAnnualRHPropMean(communityOrder) {
    const community = await this.createCommunityImage(communityOrder);
    return {
      values: await this.getAnnualRHPropMean(community, true),
    };
  }

  async getCommunityHistoricalRHProp(communityOrder) {
    const community = await this.createCommunityImage(communityOrder);
    return this.getHistoricalRHProp(community, true);
  }
  // #endregion RHProp

  // #region IOSE - Community
  async getCommunityHistoricalIOSE(communityOrder) {
    const community = await this.createCommunityImage(communityOrder);
    return this.getHistoricalIOSE(community, true);
  }
  // #endregion IOSE -Community

  // #region SOIL - Community
  async getCommunitySOIL(communityOrder) {
    const community = await this.createCommunityImage(communityOrder);
    return this.getSOIL(community, true);
  }
  // #endregion SOIL - Community

  // #region EFT - Community
  async getCommunityEFT(communityOrder) {
    const community = await this.createCommunityImage(communityOrder);
    return this.getEFT(community, true);
  }
  // #endregion EFT - Community

  // #region AHPPN - Community
  async getCommunityAHPPN(communityOrder) {
    const community = await this.createCommunityImage(communityOrder);
    return this.getAHPPN(community, true);
  }
  // #endregion SOIL - Community


  // #region PPNA
  async getZoneAnnualPPNA(zoneInfo, year) {
    const zone = this.createZone(zoneInfo.type, zoneInfo.coordinates);
    return {
      year: year,
      values: await this.getPPNAByYear(zone, year),
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

  // #endregion PPNA

  // #region APAR
  async getZoneAnnualAPAR(zoneInfo, year) {
    console.log("getZoneAnnualAPAR --> ", year)
    const zone = this.createZone(zoneInfo.type, zoneInfo.coordinates);
    return {
      year: year,
      values: await this.getAPARByYear(zone, year),
    };
  }

  async getZoneAnnualAPARMean(zoneInfo) {
    const zone = this.createZone(zoneInfo.type, zoneInfo.coordinates);
    return {
      values: await this.getAnnualAPARMean(zone),
    };
  }

  async getZoneHistoricalAPAR(zoneInfo) {
    const zone = this.createZone(zoneInfo.type, zoneInfo.coordinates);
    return this.getHistoricalAPAR(zone);
  }

  // #endregion APAR

  // #region ET
  async getZoneAnnualET(zoneInfo, year) {
    const zone = this.createZone(zoneInfo.type, zoneInfo.coordinates);
    return {
      year: year,
      values: await this.getETByYear(zone, year),
    };
  }

  async getZoneAnnualETMean(zoneInfo) {
    const zone = this.createZone(zoneInfo.type, zoneInfo.coordinates);
    return {
      values: await this.getAnnualETMean(zone),
    };
  }

  async getZoneHistoricalET(zoneInfo) {
    const zone = this.createZone(zoneInfo.type, zoneInfo.coordinates);
    return this.getHistoricalET(zone);
  }
  // #endregion ET

  // #region RH
  async getZoneAnnualRH(zoneInfo, year) {
    const zone = this.createZone(zoneInfo.type, zoneInfo.coordinates);
    return {
      year: year,
      values: await this.getRHByYear(zone, year),
    };
  }

  async getZoneAnnualRHMean(zoneInfo) {
    const zone = this.createZone(zoneInfo.type, zoneInfo.coordinates);
    return {
      values: await this.getAnnualRHMean(zone),
    };
  }

  async getZoneHistoricalRH(zoneInfo) {
    const zone = this.createZone(zoneInfo.type, zoneInfo.coordinates);
    return this.getHistoricalRH(zone);
  }
  // #endregion RH

  // #region RHProp
  async getZoneAnnualRHProp(zoneInfo, year) {
    const zone = this.createZone(zoneInfo.type, zoneInfo.coordinates);
    return {
      year: year,
      values: await this.getRHPropByYear(zone, year),
    };
  }

  async getZoneAnnualRHPropMean(zoneInfo) {
    const zone = this.createZone(zoneInfo.type, zoneInfo.coordinates);
    return {
      values: await this.getAnnualRHPropMean(zone),
    };
  }

  async getZoneHistoricalRHProp(zoneInfo) {
    const zone = this.createZone(zoneInfo.type, zoneInfo.coordinates);
    return this.getHistoricalRHProp(zone);
  }
  // #endregion RHProp

  // #region IOSE
  async getZoneHistoricalIOSE(zoneInfo) {
    const zone = this.createZone(zoneInfo.type, zoneInfo.coordinates);
    return this.getHistoricalIOSE(zone);
  }
  // #endregion IOSE

  // #region Mapbiomas
  async getZoneHistoricalMapbiomas(zoneInfo) {
    const zone = this.createZone(zoneInfo.type, zoneInfo.coordinates);
    return this.getHistoricalMapbiomas(zone);
  }

  async getZoneAnnualMapbiomas(zoneInfo, year) {
    const zone = this.createZone(zoneInfo.type, zoneInfo.coordinates);
    return this.getAnnualMapbiomas(zone, year);
  }
  // #endregion Mapbiomas

  // #region SOIL
  async getZoneSOIL(zoneInfo) {
    const zone = this.createZone(zoneInfo.type, zoneInfo.coordinates);
    return this.getSOIL(zone);
  }
  // endregion SOIL

  // #region EFT
  async getZoneEFT(zoneInfo) {
    const zone = this.createZone(zoneInfo.type, zoneInfo.coordinates);
    return this.getEFT(zone);
  }
  // endregion EFT

    // #region AHPPN
  async getZoneAHPPN(zoneInfo) {
    const zone = this.createZone(zoneInfo.type, zoneInfo.coordinates);
    return this.getAHPPN(zone);
  }
  // endregion AHPPN

  // #region UPDATE

  /* Check if there are some updates available
   * Read mark file to get last update and last historical year processed
   * for every indicator check appropriate data to check updates
   *   - ppna: Get MODIS data and check last feature date
   * Return an object with all indicator
   *   ppna: {
   *     isUpdateAvailable: true // or false
   *     year: 2022 // year to be processed
   *   }
   */
  isUpdateAvailable() {
    // Read update mark file
    // Get MODIS Data
    // Check if last feature is the same of the last update
  }

  /*
   * Update PPNA
   * Create a new asset with historical ppna and the ppna for the year that receive as a parameter
   * 1- Define the region (ROU)
   * 2- Get MODIS Data for the year that receive as a parameter
   * 3- Define fPar
   * 4- Define Par
   * 5- Get Historical Data and append calculated ppna bands
   * 6- Export new Asset and return the new asset id and the taskId
   * */
  updatePPNA(year: number) {
    // Define the region
    // TODO: Move to config
    const ROU = ee.FeatureCollection(
      'projects/pastizalesrou/assets/general/limite_oficial_rou_km2'
    );

    // #region NDVI - fPAR
    const EVI = ee
      .ImageCollection('MODIS/061/MOD13Q1')
      .filterDate(`${year}-01-01`, `${year}-12-31`)
      .select(['EVI', 'DetailedQA']);

    const eviSize = EVI.size().getInfo();

    // #region Filtro de Calidad

    //Funcion del filtro de calidad
    const MaskCalidad = function (x) {
      const Q = x.select(['DetailedQA']);
      const sombra = Q.bitwiseAnd(ee.Image.constant(32768)); // genera una mascara con 0 y 32768
      const nube = Q.bitwiseAnd(ee.Image.constant(1024)); //genera una mascara con 0 y 1024
      const aerosol = Q.bitwiseAnd(ee.Image.constant(192)).eq(192); // Filtra solo HIGH, genera una mascara con 0, 64, 128 y 192. Y enmascara con valor 1 a todos los que no son 192 (aerosol:High)
      const filtro = sombra.add(nube).add(aerosol); // suma todas las mascaras
      return filtro.lt(1); //genera la mascara final con los pixeles que pasaron el filtro
    };

    //Aplica filtro de calidad a la serie de EVI
    const EVIfilt = EVI.map(function (img) {
      const mask = MaskCalidad(img);
      const EVI = img.select(['EVI']);
      const masked = EVI.updateMask(mask);
      return masked.copyProperties(img, [
        'system:index',
        'system:time_start',
        'system:time_end',
      ]);
    });

    //#endregion

    const fPAR16 = ee.ImageCollection(
      EVIfilt.map(function (img) {
        let fPAR = img.multiply(0.000115).subtract(0.0174); //0.00115 por pendiente 1.15 y SF 0.0001
        fPAR = fPAR.where(fPAR.lt(0), 0);
        fPAR = fPAR.where(fPAR.gt(0.95), 0.95);
        return fPAR.copyProperties(img, [
          'system:index',
          'system:time_end',
          'system:time_start',
        ]);
      })
    );

    // #endregion

    // #region PAR

    // HAY QUE GENERAR UN MECANISMO DE FILTRO TEMPORAL PARA QUE LA SERIE DE PAR SEA DE IGUAL TAMAÑO
    // QUE LA SERIE DE fPAR, YO LO ESTABA HACIENDO DEFINIENDO EL DIA JULIANO EN LA LISTA f16 A MANO
    // PODRIA SER CON EVI.size() y multiplicar ese valor por 16 o algo así...

    const GLDAS = ee
      .ImageCollection('NASA/GLDAS/V021/NOAH/G025/T3H')
      .select(['SWdown_f_tavg'])
      .filterDate('2020-01-01', '2020-12-31'); //W/m2
    //.filterDate(startYear+'-01-01', endYear+'-12-31');//W/m2

    const years = ee.List.sequence(2020, 2020, 1);

    const f16 = ee.List.sequence(1, eviSize * 16, 16);

    const PAR16 = ee.ImageCollection.fromImages(
      years
        .map(function (y) {
          return f16.map(function (j) {
            const w = GLDAS.filter(ee.Filter.calendarRange(y, y, 'year'))
              .filter(
                ee.Filter.calendarRange(j, ee.Number(j).add(15), 'day_of_year')
              )
              .mean()
              .multiply(0.6912); //scale factor
            return w.set('anio', y).set('dia', j);
            //.set('system:time_start', ee.Date.fromYMD(y, m, 1).millis());
          });
        })
        .flatten()
    );

    // #endregion PAR

    // ---- PPNA
    const f16sbt = ee.List.sequence(1, eviSize * 16, 16);

    const PPNA = ee.ImageCollection.fromImages(
      years
        .map(function (y) {
          return f16sbt.map(function (j) {
            const PAR = ee.Image(
              PAR16.filterMetadata('anio', 'equals', y)
                .filterMetadata('dia', 'equals', j)
                .first()
            );
            const fPAR = ee.Image(
              fPAR16
                .filter(ee.Filter.calendarRange(year, year, 'year'))
                .filter(
                  ee.Filter.calendarRange(j, ee.Number(j).add(1), 'day_of_year')
                )
                .first()
            );
            const PPNAgMS = ee.Image(
              fPAR
                .multiply(PAR)
                .multiply(0.4227)
                .subtract(0.1978)
                .rename('PPNA')
            );
            return PPNAgMS.multiply(10).copyProperties(PAR); //multiply(10) para pasar de gMS/m2.16d a KgMS/Ha.16d
          });
        })
        .flatten()
    );

    //------------Extraccion

    //Transformar la imageCollection en Image (imagen multibanda)
    const empty = ee.Image().select();
    let multiband = PPNA.iterate(function (image, result) {
      return ee.Image(result).addBands(
        image.rename([
          ee
            .String('b')
            .cat(ee.String(year.toString()))
            .cat('-')
            .cat(ee.String(ee.Number(image.get('dia')).int())),
        ])
      );
    }, empty);

    multiband = ee.Image(multiband);

    // ESTO ES PARA AGREGAR LAS BANDAS DE LAT Y LONG, SE PODRÍA SACAR
    const PPNA_Multiband = multiband; //.addBands(ee.Image.pixelLonLat())

    //IMPORT SERIE HISTORICA y compilación con imagen actual
    // ver el tema de las bandas de LAT y LONG

    const PPNAh = ee.Image(MAP_PATH['PPNA_HISTORIC']).select(['b.*']);

    const PPNAh_act = PPNAh.addBands(PPNA_Multiband);

    //EXPORT serie Historica + ultima imagen de PPNA
    // programar el nombre del asset que se exporta con por ejemplo _1, _2 ... _23
    // ver el tema de sobreescribir la serie Historica

    ROU.geometry().evaluate((geometry) => {
      const g = ee.Geometry(geometry);
      const region = JSON.stringify(g.toGeoJSON());
      const task = ee.batch.Export.image.toAsset({
        image: PPNAh_act.clip(ROU),
        description: 'PPNA-16_TEMP',
        assetId: 'projects/gee-inia/assets/PPNA-16_TEMP',
        region: region,
        scale: 231.65635826395828,
        maxPixels: 1e12,
      });

      task.start(
        function () {
          console.log(`Started task #${task.id}`);
          const info = ee.data.listOperations();
          console.log(JSON.stringify(info));
        },
        function (error) {
          console.log(`Error: ${error}`);
        }
      );
    });
  }

  /*
   * Replace PPNA asset for the asset specified in the parameters
   * Replace PPNA History if it is necessary
   * Update Mark storage file
   * Parameters: {
   *   newPPNAAssetId
   *   requireUpdateHistoryPPNA
   *   year
   *   lastUpdate
   * }
   */
  afterUpdatePPNA() {
    // Move Asset
  }

  updateET() {
    try {
      const EVI = ee
        .ImageCollection('MODIS/061/MOD13Q1')
        .filterDate('2022-01-01', '2022-12-31')
        .select(['EVI', 'DetailedQA']);

      EVI.evaluate((result: any) => {
        const lastFeature = result.features[result.features.length - 1];
        console.log('lastFeature', lastFeature.id);
      });

      console.log('FIN');
    } catch (e) {
      console.log(e);
    }
  }

  checkTasks() {
    const info = ee.data.listOperations();
    console.log(JSON.stringify(info));
  }
  // #endregion

  //#region Private Methods
  private async getMapInfo(mapType: MapType): Promise<MapModel> {
    const mapInfo = new Maps().getMapInfo(mapType);
    console.log({ mapInfo });
    const communityInfo = mapInfo.communityOrder
      ? await this.getCommunityInfo(mapInfo.communityOrder)
      : undefined;
    return new Promise((resolve, reject) => {
      try {
        mapInfo.getResource().getMap(mapInfo.visualizationParams, (result) => {
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
        console.log(`GEEService  - getCommunityInfo error ${e}`);
        return undefined;
      });
  }

  private createZone(type, coordinates) {
    // fs.writeFileSync('coordinates.json', JSON.stringify(coordinates));
    // console.log({ coordinates });
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
    console.log({ areas });
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

  // #region PPNA
  private async getPPNAByYear(zone, year, applyMask = false) {
    if (year <= 2000) {
      return [];
    }
    const currentYear = dayjs().year();
    if (year > currentYear) {
      return [];
    }
    if (year === currentYear) {
      return this.getCurrentYear(
        zone,
        MAP_PATH.PPNA,
        `b${year}.*`,
        'ppna',
        16,
        applyMask
      );
    }

    const yearData = await this.getZoneData(
      zone,
      MAP_PATH.PPNA,
      `b${year}.*`,
      applyMask
    );
    const yearValues = await yearData.getInfo();
    const yearResult = this.getMonthly(yearValues, 'ppna');

    let nextYearResult = [];
    if (
      year !== currentYear - 1 ||
      dayjs().month() !== 0 ||
      dayjs().date() > 20
    ) {
      const nextYearData = await this.getZoneData(
        zone,
        MAP_PATH.PPNA,
        `b${year + 1}.*`,
        applyMask
      );
      try {
        const nextYearValues = await nextYearData.getInfo();
        nextYearResult = this.getMonthly(nextYearValues, 'ppna');
      } catch (e) {
        console.log('getPPNAByYear error', e);
        nextYearResult = [];
      }
    }

    //add Predictions
    // if (year === dayjs().year() - 1) {
    //   const predictionValues = this.getZonePrediction(zone);
    //   const currentMonth = dayjs().month();
    //   for (let i = 0; i <= 2; i++) {
    //     nextYearResult.push(predictionValues[currentMonth + i]);
    //   }
    // }
    return this.getProductiveValues(yearResult, nextYearResult);
  }

  private async getAnnualPPNAMean(zone, applyMask = false) {
    const geometry = !applyMask ? zone : zone.geometry(500);
    let ppna = ee.Image(MAP_PATH['PPNA_HISTORIC_AVERAGE']).select(['b.*']);

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
    const result = this.getMonthly(renamedValues, 'ppna');
    return [...result.slice(12), ...result.slice(0, 12)];
  }

  private async getHistoricalPPNA(zone, applyMask = false) {
    const geometry = !applyMask ? zone : zone.geometry(500);
    let ppna = ee.Image(MAP_PATH['PPNA_HISTORIC_AVERAGE_BY_YEAR']);
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
  //#endregion PPNA

  // #region APAR
  private async getAPARByYear(zone, year, applyMask = false) {
    if (year <= 2000) {
      return [];
    }
    const currentYear = dayjs().year();
    if (year > currentYear) {
      return [];
    }
    if (year === currentYear) {
      return this.getCurrentYear(
        zone,
        MAP_PATH.APAR,
        `b${year}.*`,
        'apar',
        16,
        applyMask
      );
    }

    const yearData = await this.getZoneData(
      zone,
      MAP_PATH.APAR,
      `b${year}.*`,
      applyMask
    );
    const yearValues = await yearData.getInfo();
    const yearResult = this.getMonthly(yearValues, 'apar');

    let nextYearResult = [];
    if (
      year !== currentYear - 1 ||
      dayjs().month() !== 0 ||
      dayjs().date() > 20
    ) {
      const nextYearData = await this.getZoneData(
        zone,
        MAP_PATH.APAR,
        `b${year + 1}.*`,
        applyMask
      );
      try {
        const nextYearValues = await nextYearData.getInfo();
        nextYearResult = this.getMonthly(nextYearValues, 'apar');
      } catch (e) {
        console.log('getAPARByYear error', e);
        nextYearResult = [];
      }
    }
    return this.getProductiveValues(yearResult, nextYearResult);
  }

  private async getAnnualAPARMean(zone, applyMask = false) {
    const geometry = !applyMask ? zone : zone.geometry(500);
    let apar = ee.Image(MAP_PATH['APAR_HISTORIC_AVERAGE']).select(['b.*']);

    if (applyMask) {
      apar.unmask();
      apar = apar.updateMask(zone);
    }
    const data = apar.reduceRegion({
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
    const result = this.getMonthly(renamedValues, 'apar');
    return [...result.slice(12), ...result.slice(0, 12)];
  }

  private async getHistoricalAPAR(zone, applyMask = false) {
    const geometry = !applyMask ? zone : zone.geometry(500);
    let apar = ee.Image(MAP_PATH['APAR_HISTORIC_AVERAGE_BY_YEAR']);
    if (applyMask) {
      apar.unmask();
      apar = apar.updateMask(zone);
    }

    const data = apar.reduceRegion({
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
        apar: (value as number).toFixed(2),
      });
    }
    return result.sort((a, b) => {
      return +a.year < +b.year ? -1 : 1;
    });
  }
  //#endregion APAR

  //#region ET
  private async getETByYear(zone, year, applyMask = false) {
    // TODO: Move to config (First year ET data --> 2001)
    if (year <= 2000) {
      return [];
    }
    const currentYear = dayjs().year();

    if (year > currentYear) {
      return [];
    }

    const bandsName = `b${year}.*`;

    if (year === currentYear) {
      return this.getCurrentYear(
        zone,
        MAP_PATH.ET,
        bandsName,
        'et',
        8,
        applyMask
      );
    }

    const yearData = await this.getZoneData(
      zone,
      MAP_PATH.ET,
      bandsName,
      applyMask
    );
    const yearValues = await yearData.getInfo();
    const yearResult = this.getMonthly(yearValues, 'et');

    let nextYearResult = [];
    // if (
    //   year !== currentYear - 1 ||
    //   dayjs().month() !== 0 ||
    //   dayjs().date() > 20
    // ) {
    try {
      const nextYearData = await this.getZoneData(
        zone,
        MAP_PATH.ET,
        `b${year + 1}.*`,
        applyMask
      );
      const nextYearValues = await nextYearData.getInfo();
      nextYearResult = this.getMonthly(nextYearValues, 'et');
    } catch (e) {
      console.log('getETByYear error', e);
      nextYearResult = [];
    }

    //add Predictions
    // if (year === dayjs().year() - 1) {
    //   const predictionValues = this.getZonePrediction(zone);
    //   const currentMonth = dayjs().month();
    //   for (let i = 0; i <= 2; i++) {
    //     nextYearResult.push(predictionValues[currentMonth + i]);
    //   }
    // }
    return this.getProductiveValues(yearResult, nextYearResult, 8);
  }

  private async getAnnualETMean(zone, applyMask = false) {
    const geometry = !applyMask ? zone : zone.geometry(500);
    let image = ee.Image(MAP_PATH['ET_HISTORIC_AVERAGE']).select(['b.*']);

    if (applyMask) {
      image.unmask();
      image = image.updateMask(zone);
    }
    const data = image.reduceRegion({
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
    const result = this.getMonthly(renamedValues, 'et');
    return [...result.slice(23), ...result.slice(0, 23)];
  }

  private async getHistoricalET(zone, applyMask = false) {
    const geometry = !applyMask ? zone : zone.geometry(500);
    let image = ee.Image(MAP_PATH['ET_HISTORIC_AVERAGE_BY_YEAR']);
    if (applyMask) {
      image.unmask();
      image = image.updateMask(zone);
    }

    const data = image.reduceRegion({
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
        et: (value as number).toFixed(2),
      });
    }
    return result.sort((a, b) => {
      return +a.year < +b.year ? -1 : 1;
    });
  }

  // #endregion ET

  // #region RH
  private async getRHByYear(zone, year, applyMask = false) {
    if (year < 2003) {
      return [];
    }
    const currentYear = dayjs().year();
    if (year > currentYear) {
      return [];
    }
    if (year === currentYear) {
      return this.getCurrentYear(
        zone,
        MAP_PATH.RH,
        `b${year}.*`,
        'rh',
        16,
        applyMask
      );
    }

    const yearData = await this.getZoneData(
      zone,
      MAP_PATH.RH,
      `b${year}.*`,
      applyMask
    );
    const yearValues = await yearData.getInfo();
    const yearResult = this.getMonthly(yearValues, 'rh');

    let nextYearResult = [];
    if (
      year !== currentYear - 1 ||
      dayjs().month() !== 0 ||
      dayjs().date() > 20
    ) {
      try {
        const nextYearData = await this.getZoneData(
          zone,
          MAP_PATH.RH,
          `b${year + 1}.*`,
          applyMask
        );
        const nextYearValues = await nextYearData.getInfo();
        nextYearResult = this.getMonthly(nextYearValues, 'rh');
      } catch {
        console.log(`Error getRHByYear -> getZoneData ${year + 1}`);
        nextYearResult = [];
      }
    }

    //add Predictions
    // if (year === dayjs().year() - 1) {
    //   const predictionValues = this.getZonePrediction(zone);
    //   const currentMonth = dayjs().month();
    //   for (let i = 0; i <= 2; i++) {
    //     nextYearResult.push(predictionValues[currentMonth + i]);
    //   }
    // }

    return this.getProductiveValues(yearResult, nextYearResult);
  }

  private async getAnnualRHMean(zone, applyMask = false) {
    const geometry = !applyMask ? zone : zone.geometry(500);
    let rh = ee.Image(MAP_PATH['RH_HISTORIC_AVERAGE']).select(['b.*']);

    if (applyMask) {
      rh.unmask();
      rh = rh.updateMask(zone);
    }
    const data = rh.reduceRegion({
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
    const result = this.getMonthly(renamedValues, 'rh');
    return [...result.slice(12), ...result.slice(0, 12)];
  }

  private async getHistoricalRH(zone, applyMask = false) {
    const geometry = !applyMask ? zone : zone.geometry(500);
    let rh = ee.Image(MAP_PATH['RH_HISTORIC_AVERAGE_BY_YEAR']);
    if (applyMask) {
      rh.unmask();
      rh = rh.updateMask(zone);
    }

    const data = rh.reduceRegion({
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
        rh: (value as number).toFixed(2),
      });
    }
    return result.sort((a, b) => {
      return +a.year < +b.year ? -1 : 1;
    });
  }
  // #endregion RH

  // #region RHProp
  private async getRHPropByYear(zone, year, applyMask = false) {
    if (year < 2003) {
      return [];
    }
    const currentYear = dayjs().year();
    if (year > currentYear) {
      return [];
    }
    if (year === currentYear) {
      return this.getCurrentYear(
        zone,
        MAP_PATH.RHProp,
        `b${year}.*`,
        'rhProp',
        16,
        applyMask
      );
    }

    const yearData = await this.getZoneData(
      zone,
      MAP_PATH.RHProp,
      `b${year}.*`,
      applyMask
    );
    const yearValues = await yearData.getInfo();
    const yearResult = this.getMonthly(yearValues, 'rhProp');

    let nextYearResult = [];
    if (
      year !== currentYear - 1 ||
      dayjs().month() !== 0 ||
      dayjs().date() > 20
    ) {
      try {
        const nextYearData = await this.getZoneData(
          zone,
          MAP_PATH.RHProp,
          `b${year + 1}.*`,
          applyMask
        );
        const nextYearValues = await nextYearData.getInfo();
        nextYearResult = this.getMonthly(nextYearValues, 'rhProp');
      } catch {
        console.log(`Error getRHPropByYear -> getZoneData ${year + 1}`);
        nextYearResult = [];
      }
    }

    return this.getProductiveValues(yearResult, nextYearResult);
  }

  private async getAnnualRHPropMean(zone, applyMask = false) {
    const geometry = !applyMask ? zone : zone.geometry(500);
    let rhProp = ee.Image(MAP_PATH['RHProp_HISTORIC_AVERAGE']).select(['b.*']);

    if (applyMask) {
      rhProp.unmask();
      rhProp = rhProp.updateMask(zone);
    }
    const data = rhProp.reduceRegion({
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
    const result = this.getMonthly(renamedValues, 'rhProp');
    return [...result.slice(12), ...result.slice(0, 12)];
  }

  private async getHistoricalRHProp(zone, applyMask = false) {
    const geometry = !applyMask ? zone : zone.geometry(500);
    let rhProp = ee.Image(MAP_PATH['RHProp_HISTORIC_AVERAGE_BY_YEAR']);
    if (applyMask) {
      rhProp.unmask();
      rhProp = rhProp.updateMask(zone);
    }

    const data = rhProp.reduceRegion({
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
        rhProp: (value as number).toFixed(2),
      });
    }
    return result.sort((a, b) => {
      return +a.year < +b.year ? -1 : 1;
    });
  }
  // #endregion RHProp

  // #region IOSE
  private async getHistoricalIOSE(zone, applyMask = false) {
    const geometry = !applyMask ? zone : zone.geometry(500);
    let iose = ee.Image(MAP_PATH['IOSE']);
    if (applyMask) {
      iose.unmask();
      iose = iose.updateMask(zone);
    }

    const dataMean = iose.reduceRegion({
      reducer: ee.Reducer.mean(),
      geometry: geometry,
      scale: 231.65635826395828,
      maxPixels: 1e12,
    });

    const dataStdDev = iose.reduceRegion({
      reducer: ee.Reducer.stdDev(),
      geometry: geometry,
      scale: 231.65635826395828,
      maxPixels: 1e12,
    });

    const valuesMean = await dataMean.getInfo();
    const valuesStdDev = await dataStdDev.getInfo();

    const result = [];
    for (const [key, value] of Object.entries(valuesMean)) {
      const [, year] = key.split('b');
      result.push({
        year: year,
        iose: (value as number).toFixed(3),
        stdDev: (valuesStdDev[key] as number).toFixed(4),
      });
    }
    return result.sort((a, b) => {
      return +a.year < +b.year ? -1 : 1;
    });
  }
  // #endregion IOSE

  // #region Mapbiomas
  private async getHistoricalMapbiomas(zone, applyMask = false) {
    let mapbiomas = ee.Image(MAP_PATH['Mapbiomas']);
    const geometry = !applyMask ? zone : zone.geometry(500);
    if (applyMask) {
      mapbiomas.unmask();
      mapbiomas = mapbiomas.updateMask(zone);
    }
    const results = {};
    const yearResults = [];
    for (let year = 1985; year <= 2021; year++) {
      const bandName = 'classification_' + year;
      const image = mapbiomas.select(bandName);

      // Calculate area of every cover in the current year
      const areaByClass = ee.Image.pixelArea()
        .addBands(image)
        .reduceRegion({
          reducer: ee.Reducer.sum().group({
            groupField: 1,
            groupName: 'class',
          }),
          geometry: geometry,
          scale: 30,
          maxPixels: 1e13,
        });

      yearResults.push(ee.List(areaByClass.get('groups')));
    }

    yearResults.forEach((geeYearResult) => {
      const resultList = geeYearResult.getInfo();
      resultList.forEach((result) => {
        const classId = result['class'];
        const area = result['sum'];

        if (results[classId]) {
          results[classId].push(area);
        } else {
          results[classId] = [area];
        }
      });
    });

    console.log('results: ', { results });
    return results;
  }

  private async getAnnualMapbiomas(zone, year, applyMask = false) {
    let mapbiomas = ee.Image(MAP_PATH['Mapbiomas']);
    const geometry = !applyMask ? zone : zone.geometry(500);
    if (applyMask) {
      mapbiomas.unmask();
      mapbiomas = mapbiomas.updateMask(zone);
    }

    const bandName = 'classification_' + year;
    console.log(`bandName: ${bandName}`);
    const image = mapbiomas.select(bandName);
    // Calculate area of every cover in the current year
    const areaByClass = ee.Image.pixelArea()
      .addBands(image)
      .reduceRegion({
        reducer: ee.Reducer.sum().group({
          groupField: 1,
          groupName: 'class',
        }),
        geometry: geometry,
        scale: 30,
        maxPixels: 1e13,
      });

    const yearResults = ee.List(areaByClass.get('groups')).getInfo();
    console.log('yearResults: ', { yearResults });
    const results = {};

    yearResults.forEach((result) => {
      const classId = result['class'];
      const area = result['sum'];
      results[classId] = area;
    });
    console.log('results: ', { results });
    return results;
  }

  // #endregion Mapbiomas

  // #region SOIL
  private async getSOIL(zone, applyMask = false){
    let soil = ee.Image(MAP_PATH['SOIL']);
    const geometry = !applyMask ? zone : zone.geometry(500);
    if (applyMask) {
      soil.unmask();
      soil = soil.updateMask(zone);
    }

    const results = soil.reduceRegion({
      reducer: ee.Reducer.mean()
        .combine({
          reducer2: ee.Reducer.minMax(),
          sharedInputs: true
        })
        .combine({
          reducer2: ee.Reducer.median(),
          sharedInputs: true
        })
        .combine({
          reducer2: ee.Reducer.percentile([25, 75]),
          sharedInputs: true
        }),
      geometry: geometry,
      scale: 231.65635826395825
    });

    const data = results.getInfo();
    return {
      "max": data.b1_max,
      "mean" : data.b1_mean,
      "median": data.b1_median,
      "min": data.b1_min,
      "p25" : data.b1_p25,
      "p75" : data.b1_p75
    }
  }
  // #endregion SOIL

  // #region EFT
  private async getEFT(zone, applyMask = false){
    let eftImage = ee.Image(MAP_PATH['EFT']);
    const geometry = !applyMask ? zone : zone.geometry(500);
    if (applyMask) {
      eftImage.unmask();
      eftImage = eftImage.updateMask(zone);
    }

    const histogram = eftImage.reduceRegion({
      reducer: ee.Reducer.frequencyHistogram(),
      geometry: geometry,
      scale: 231.65635826395825,
      maxPixels: 1e9
    });

    const histogramObj = ee.Dictionary(histogram.get('b1'));

    const pixelArea = 231.65635826395825 * 231.65635826395825;
    const areas = histogramObj.map(function(key, count) {
      return ee.Number(count).multiply(pixelArea);
    });

    const totalArea = ee.Number(areas.values().reduce(ee.Reducer.sum()));


    //const totalArea = zone.area()

    const result = ee.List(areas.values()).map(function(area) {
      const prop = ee.Number(area).divide(totalArea);
      return prop.multiply(prop.log().multiply(-1));
    }).reduce(ee.Reducer.sum());

   const data = result.getInfo();
    return {
      eft: data
    }
  }
  // #endregion EFT

  // #region AHPPN
  private async getAHPPN(zone, applyMask = false){
    let ahppn = ee.Image(MAP_PATH['AHPPN']);
    const geometry = !applyMask ? zone : zone.geometry(500);
    if (applyMask) {
      ahppn.unmask();
      ahppn = ahppn.updateMask(zone);
    }

    const results = ahppn.reduceRegion({
      reducer: ee.Reducer.mean()
        .combine({
          reducer2: ee.Reducer.minMax(),
          sharedInputs: true
        })
        .combine({
          reducer2: ee.Reducer.median(),
          sharedInputs: true
        })
        .combine({
          reducer2: ee.Reducer.percentile([25, 75]),
          sharedInputs: true
        }),
      geometry: geometry,
      scale: 231.65635826395825
    });

    const data = results.getInfo();
    return {
      "max": data.b1_max,
      "mean" : data.b1_mean,
      "median": data.b1_median,
      "min": data.b1_min,
      "p25" : data.b1_p25,
      "p75" : data.b1_p75
    }
  }
  // #endregion AHPPN

  // #region General (Used for all indicators)
  private async getCurrentYear(
    zone,
    mapPath,
    bandsName,
    indicator,
    days = 16,
    applyMask = false
  ) {
    try {
      const currentMonth = dayjs().month();
      const currentDay = dayjs().date();
      const nextYearResult = [];
      let currentYearResult = [];

      if (currentMonth > 1 || currentDay > 20) {
        const currentYearData = await this.getZoneData(
          zone,
          mapPath,
          bandsName,
          applyMask
        );
        const currentYearValues = await currentYearData.getInfo();
        currentYearResult = this.getMonthly(currentYearValues, indicator);
      }

      return this.getProductiveValues(currentYearResult, nextYearResult, days);
    } catch (e) {
      console.log(`getCurrentYear error: ${e}`);
      return [];
    }
  }

  private getZoneData(zone, mapPath, bandsName, applyMask = false) {
    try {
      const geometry = !applyMask ? zone : zone.geometry(500);
      let image = ee.Image(mapPath).select([bandsName]);
      if (applyMask) {
        image.unmask();
        image = image.updateMask(zone);
      }
      return image.reduceRegion({
        reducer: ee.Reducer.mean(),
        geometry: geometry,
        scale: FILTER_PARAMS.SCALE,
        maxPixels: FILTER_PARAMS.MAX_PIXELS,
      });
    } catch (e) {
      console.log(`getZoneData error: ${e}`);
      return[]
    }
  }

  private getMonthly(data, valueName: string) {
    const results = [];
    const sortData = Object.entries(data).sort((a, b) => {
      const aKey = a[0].split('-')[1];
      const bKey = b[0].split('-')[1];
      return +aKey < +bKey ? -1 : 1;
    });
    for (const [key, value] of sortData) {
      const [, day] = key.split('-');
      const result = {};
      result['day'] = +day;
      result[valueName] = (+value).toFixed(2);
      results.push(result);
    }
    return results;
  }

  // Get last 11(23) dates of the year and 12(23) dates of the next year
  private getProductiveValues(yearResult, nextYearResult, days = 16) {
    const middle = Math.ceil(365 / (days * 2));
    const yearValues = yearResult.slice(middle);
    const nextYearValues = nextYearResult.slice(0, middle);
    return [...yearValues, ...nextYearValues];
  }

  // #endRegion General (used for all indicators)

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

  //#endregion Private Methods


}
