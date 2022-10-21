import { Body, Controller, Get, HttpStatus, Param, Post } from '@nestjs/common';
import { CommunityModel } from '../community/community.models';
import { MapType } from './gee.models';
import { GEEService } from './gee.service';

export type ZoneInformationResponse = {
  statusCode: number;
  zoneInformation: {
    latitude?: number;
    longitude?: number;
    area?: number;
    perimeter?: number;
    communitiesAreas: {
      community: CommunityModel;
      area: number;
    }[];
  };
};

export type ZoneInfo = {
  type: 'marker' | 'polygon' | 'rectangle';
  coordinates: number[];
};
@Controller('gee')
export class GEEController {
  constructor(private readonly geeService: GEEService) {}
  // #region MAPS
  @Get('maps/information')
  async getInformationMaps() {
    try {
      const layers = await this.geeService.getInformationMaps();
      return { statusCode: HttpStatus.OK, layers };
    } catch (e) {
      console.log(`ERROR(GEEController- getInformationMaps: ${e}`);
      return 'ERROR';
    }
  }

  @Get('maps/communities')
  async getCommunitiesMaps() {
    try {
      const layers = await this.geeService.getCommunitiesMaps();
      return { statusCode: HttpStatus.OK, layers };
    } catch (e) {
      console.log(`ERROR(GEEController- getCommunitiesMaps: ${e}`);
      return 'ERROR';
    }
  }

  @Get('/maps/:id')
  async getMap(@Param('id') mapType: MapType) {
    try {
      const layer = await this.geeService.getMap(mapType);
      return { statusCode: HttpStatus.OK, layer };
    } catch (e) {
      console.log(`ERROR(GEEController - getMap: ${e}`);
      return 'ERROR';
    }
  }
  // #endregion

  // #region ZONE
  @Post('/zone/information')
  // @ApiResponse({
  //   status: 200,
  //   description: 'Retrieve Zone information like (Area, Area per communities)',
  // })
  async getZoneInformation(
    @Body() zoneInfo: ZoneInfo
  ): Promise<ZoneInformationResponse> {
    try {
      const zoneInformation = await this.geeService.getZoneInformation(
        zoneInfo
      );
      return { statusCode: HttpStatus.OK, zoneInformation };
    } catch (e) {
      console.log(`ERROR(GEEController - getPPNAByZone: ${e}`);
    }
  }

  @Post('/zone/ppna/annual/mean')
  async getZoneAnnualPPNAMean(@Body() zoneInfo: ZoneInfo) {
    try {
      const ppnaInformation = await this.geeService.getZoneAnnualPPNAMean(
        zoneInfo
      );
      return { statusCode: HttpStatus.OK, ppnaInformation };
    } catch (e) {
      console.log(`ERROR(GEEController - getZoneAnnualPPNAMean: ${e}`);
      return 'ERROR';
    }
  }

  @Post('/zone/ppna/annual/:year')
  async getZoneAnnualPPNA(
    @Param('year') year: number,
    @Body() zoneInfo: ZoneInfo
  ) {
    try {
      const ppnaInformation = await this.geeService.getZoneAnnualPPNA(
        zoneInfo,
        +year
      );
      return { statusCode: HttpStatus.OK, ppnaInformation };
    } catch (e) {
      console.log(`ERROR(GEEController - getZoneAnnualPPNA: ${e}`);
      return 'ERROR';
    }
  }

  @Post('/zone/ppna/historical')
  async getZoneHistoricalPPNA(@Body() zoneInfo: ZoneInfo) {
    try {
      const historicalPPNAInformation =
        await this.geeService.getZoneHistoricalPPNA(zoneInfo);
      return { statusCode: HttpStatus.OK, historicalPPNAInformation };
    } catch (e) {
      console.log(`ERROR(GEEController - getZoneHitoricalPPNA: ${e}`);
      return 'ERROR';
    }
  }

  // #endregion

  // #region COMMUNITY
  @Get('/community/:order/ppna')
  async getCommunityPPNAInformation(@Param('order') communityOrder: string) {
    try {
      const communityPPNAInformation =
        await this.geeService.getCommunityPPNAInformation(communityOrder);
      return {
        statusCode: HttpStatus.OK,
        communityPPNAInformation,
      };
    } catch (e) {
      console.log(`ERROR(GEEController - getCommunityPPNAInformation: ${e}`);
      return 'ERROR';
    }
  }

  @Get('/community/:order/ppna/annual/mean')
  async getCommunityAnnualPPNAMean(@Param('order') communityOrder: string) {
    try {
      const communityAnnualPPNAMean =
        await this.geeService.getCommunityAnnualPPNAMean(communityOrder);
      return {
        statusCode: HttpStatus.OK,
        communityAnnualPPNAMean,
      };
    } catch (e) {
      console.log(`ERROR(GEEController - getCommunityAnnualPPNAMean: ${e}`);
      return 'ERROR';
    }
  }

  @Get('/community/:order/ppna/annual/:year')
  async getCommunityAnnualPPNA(
    @Param('order') communityOrder: string,
    @Param('year') year: number
  ) {
    try {
      const communityAnnualPPNA = await this.geeService.getCommunityAnnualPPNA(
        communityOrder,
        +year
      );
      return {
        statusCode: HttpStatus.OK,
        communityAnnualPPNA,
      };
    } catch (e) {
      console.log(`ERROR(GEEController - getCommunityAnnualPPNA: ${e}`);
      return 'ERROR';
    }
  }

  @Get('/community/:order/ppna/historical')
  async getCommunityPPNAHistorical(@Param('order') communityOrder: string) {
    try {
      const communityHistoricalPPNA =
        await this.geeService.getCommunityHistoricalPPNA(communityOrder);
      return {
        statusCode: HttpStatus.OK,
        communityHistoricalPPNA,
      };
    } catch (e) {
      console.log(`ERROR(GEEController - getCommunityHistoricalPPNA: ${e}`);
      return 'ERROR';
    }
  }
  // #endregion
}
