import * as ee from '@google/earthengine';
import { CommunityInfo } from './gee.models';

export class ZoneInformationModel {
  coodinates?: ee.Coordinate;
  area?: number;
  perimeter?: number;
  communitiesInfo: [
    {
      comunity: string;
      percent: number;
    }
  ];
  productivity: {};
}
