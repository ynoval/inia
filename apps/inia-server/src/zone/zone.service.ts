import { Injectable } from '@nestjs/common';
import { FirestoreProvider } from '../core/firestore.provider';

import { ZoneModel } from './zone.model';
import { ZONES_COLLECTION_NAME } from './zone.constants';

@Injectable()
export class ZoneService {
  constructor(private fs: FirestoreProvider) {}

  async getAllByUser(userId: string): Promise<ZoneModel[]> {
    try {
      const results = [];
      const zonesRef = await this.fs.db
        .collection(ZONES_COLLECTION_NAME)
        .orderBy('order')
        .get();
      zonesRef.docs.forEach((zone) => {
        const zoneInfo = this.getZone({
          ...zone.data(),
          id: zone.id,
        });
        results.push(zoneInfo);
      });
      return results;
    } catch (e) {
      console.log('ERROR (ZoneService - getAllByUser):  ' + e);
    }
  }

  private getZone(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    zoneInfo: any
  ): ZoneModel {
    try {
      return {
        id: zoneInfo.id,
        name: zoneInfo.name,
        order: zoneInfo.order,
        type: zoneInfo.type,
        visible: zoneInfo.visible,
        coordinates: zoneInfo.coordinates,
      };
    } catch (e) {
      console.log(
        'ERROR (ZoneService - getZone): Unable to create a ZoneModel using the info parameter -> ' +
          e
      );
    }
  }
}
