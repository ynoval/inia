import { Injectable } from '@nestjs/common';
import { CommunityService } from '../community/community.service';
import { Maps, MapType, MapModel } from './gee.models';
@Injectable()
export class GEEService {
  constructor(private communityService: CommunityService) {}
  async getMap(mapType: MapType): Promise<MapModel> {
    return this.getMapInfo(mapType);
  }

  /**
   * Return all information layers
   * PPNA
   */
  async getInformationMaps(): Promise<MapModel[]> {
    try {
      const promises = [
        this.getMapInfo('PPNA'),
        this.getMapInfo('PPT'),
        this.getMapInfo('T'),
        this.getMapInfo('CPUr'),
        this.getMapInfo('ROU'),
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

  //#region Private Methods
  private async getMapInfo(mapType: MapType): Promise<MapModel> {
    const mapInfo = new Maps(this.communityService).getMapInfo(mapType);
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
        };
      })
      .catch((e) => {
        return undefined;
      });
  }
  //#endregion
}
