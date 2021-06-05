import { Injectable } from '@nestjs/common';
import { Maps, MapType } from './gee.constants';

@Injectable()
export class GEEService {
  async getMap(mapId: MapType): Promise<string> {
    const { resource, visualiationParams } = new Maps().getMapInfo(mapId);
    return new Promise((resolve, reject) => {
      try {
        resource.getMap(visualiationParams, ({ mapid }) => resolve(mapid));
      } catch (e) {
        reject(e);
      }
    });
  }
}
