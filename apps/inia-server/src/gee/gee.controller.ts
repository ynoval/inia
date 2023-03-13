import { Body, Controller, Get, HttpStatus, Param, Post } from '@nestjs/common';
import { applicationDefault } from 'firebase-admin/app';
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
      console.log('Executing getInformationMaps...');
      const layers = await this.geeService.getInformationMaps();
      console.log('getInformationMaps results: ', { layers });
      return { statusCode: HttpStatus.OK, layers };
    } catch (e) {
      console.log(`ERROR(GEEController- getInformationMaps: ${e}`);
      return 'ERROR';
    }
  }

  @Get('maps/communities')
  async getCommunitiesMaps() {
    try {
      console.log('Executing getCommunitiesMaps...');
      const layers = await this.geeService.getCommunitiesMaps();
      console.log('getCommunitiesMaps results: ', { layers });
      return { statusCode: HttpStatus.OK, layers };
    } catch (e) {
      console.log(`ERROR(GEEController- getCommunitiesMaps: ${e}`);
      return 'ERROR';
    }
  }

  @Get('/maps/:id')
  async getMap(@Param('id') mapType: MapType) {
    try {
      console.log(`Executing getMap for map ${mapType}...`);
      const layer = await this.geeService.getMap(mapType);
      console.log('getMap results: ', { layer });
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
      console.log('Executing getZoneInformation...');
      const zoneInformation = await this.geeService.getZoneInformation(
        zoneInfo
      );
      console.log('getZoneInformation results: ', { zoneInformation });
      return { statusCode: HttpStatus.OK, zoneInformation };
    } catch (e) {
      console.log(`ERROR(GEEController - getPPNAByZone: ${e}`);
    }
  }

  // #region PPNA
  @Post('/zone/ppna/annual/mean')
  async getZoneAnnualPPNAMean(@Body() zoneInfo: ZoneInfo) {
    try {
      console.log('Executing getZoneAnnualPPNAMean...');
      const ppnaInformation = await this.geeService.getZoneAnnualPPNAMean(
        zoneInfo
      );
      console.log('getZoneAnnualPPNAMean results: ', {
        ppnaInformation: JSON.stringify(ppnaInformation),
      });
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
      console.log(`Executing getZoneAnnualPPNA for year ${year}...`);
      const ppnaInformation = await this.geeService.getZoneAnnualPPNA(
        zoneInfo,
        +year
      );
      console.log('getZoneAnnualPPNA results: ', {
        ppnaInformation: JSON.stringify(ppnaInformation),
      });
      return { statusCode: HttpStatus.OK, ppnaInformation };
    } catch (e) {
      console.log(`ERROR(GEEController - getZoneAnnualPPNA: ${e}`);
      return 'ERROR';
    }
  }

  @Post('/zone/ppna/historical')
  async getZoneHistoricalPPNA(@Body() zoneInfo: ZoneInfo) {
    try {
      console.log('Executing getZoneHistoricalPPNA...');
      const historicalPPNAInformation =
        await this.geeService.getZoneHistoricalPPNA(zoneInfo);
      console.log('getZoneHistoricalPPNA results: ', {
        historicalPPNAInformation: JSON.stringify(historicalPPNAInformation),
      });
      return { statusCode: HttpStatus.OK, historicalPPNAInformation };
    } catch (e) {
      console.log(`ERROR(GEEController - getZoneHistoricalPPNA: ${e}`);
      return 'ERROR';
    }
  }
  // #endregion

  //#region APAR
  @Post('/zone/apar/annual/mean')
  async getZoneAnnualAPARMean(@Body() zoneInfo: ZoneInfo) {
    try {
      console.log('Executing getZoneAnnualAPARMean... ');
      const aparInformation = await this.geeService.getZoneAnnualAPARMean(
        zoneInfo
      );
      console.log('getZoneAnnualAPARMean results: ', {
        aparInformation: JSON.stringify(aparInformation),
      });
      return { statusCode: HttpStatus.OK, aparInformation };
    } catch (e) {
      console.log(`ERROR(GEEController - getZoneAnnualAPARMean: ${e}`);
      return 'ERROR';
    }
  }

  @Post('/zone/apar/annual/:year')
  async getZoneAnnualAPAR(
    @Param('year') year: number,
    @Body() zoneInfo: ZoneInfo
  ) {
    try {
      console.log(`Executing getZoneAnnualAPAR for year ${year}...`);
      const aparInformation = await this.geeService.getZoneAnnualAPAR(
        zoneInfo,
        +year
      );
      console.log('getZoneAnnualAPAR results: ', {
        aparInformation: JSON.stringify(aparInformation),
      });
      return { statusCode: HttpStatus.OK, aparInformation };
    } catch (e) {
      console.log(`ERROR(GEEController - getZoneAnnualAPAR: ${e}`);
      return 'ERROR';
    }
  }

  @Post('/zone/apar/historical')
  async getZoneHistoricalAPAR(@Body() zoneInfo: ZoneInfo) {
    try {
      console.log('Executing getZoneHistoricalAPAR...');
      const historicalAPARInformation =
        await this.geeService.getZoneHistoricalAPAR(zoneInfo);
      console.log('getZoneHistoricalAPAR results: ', {
        historicalAPARInformation: JSON.stringify(historicalAPARInformation),
      });
      return { statusCode: HttpStatus.OK, historicalAPARInformation };
    } catch (e) {
      console.log(`ERROR(GEEController - getZoneHistoricalAPAR: ${e}`);
      return 'ERROR';
    }
  }
  // #endregion APAR

  // #region ET
  @Post('/zone/et/annual/mean')
  async getZoneAnnualETMean(@Body() zoneInfo: ZoneInfo) {
    try {
      console.log('Executing getZoneAnnualETMean...');
      const etInformation = await this.geeService.getZoneAnnualETMean(zoneInfo);
      console.log('getZoneAnnualETMean results: ', {
        etInformation: JSON.stringify(etInformation),
      });
      return { statusCode: HttpStatus.OK, etInformation };
    } catch (e) {
      console.log(`ERROR(GEEController - getZoneAnnualETMean: ${e}`);
      return 'ERROR';
    }
  }

  @Post('/zone/et/annual/:year')
  async getZoneAnnualET(
    @Param('year') year: number,
    @Body() zoneInfo: ZoneInfo
  ) {
    try {
      console.log('Executing getZoneAnnualET for year ', year);
      // TODO: change variable name (change client)
      const etInformation = await this.geeService.getZoneAnnualET(
        zoneInfo,
        +year
      );
      console.log('getZoneAnnualET Result:', {
        etInformation: JSON.stringify(etInformation),
      });
      return { statusCode: HttpStatus.OK, etInformation };
    } catch (e) {
      console.log(`ERROR(GEEController - getZoneAnnualET: ${e}`);
      return 'ERROR';
    }
  }

  @Post('/zone/et/historical')
  async getZoneHistoricalET(@Body() zoneInfo: ZoneInfo) {
    try {
      console.log('Executing getZoneHistoricalET');
      const historicalETInformation = await this.geeService.getZoneHistoricalET(
        zoneInfo
      );
      console.log('getZoneHistoricalET results: ', {
        historicalETInformation: JSON.stringify(historicalETInformation),
      });
      return { statusCode: HttpStatus.OK, historicalETInformation };
    } catch (e) {
      console.log(`ERROR(GEEController - getZoneHistoricalET: ${e}`);
      return 'ERROR';
    }
  }

  // #endregion ET

  // #region RH
  @Post('/zone/rh/annual/mean')
  async getZoneAnnualRHMean(@Body() zoneInfo: ZoneInfo) {
    try {
      console.log('Executing getZoneAnnualRHMean...');
      const rhInformation = await this.geeService.getZoneAnnualRHMean(zoneInfo);
      console.log('getZoneAnnulRHMean result: ', { rhInformation });

      return { statusCode: HttpStatus.OK, rhInformation };
    } catch (e) {
      console.log(`ERROR(GEEController - getZoneAnnualRHMean: ${e}`);
      return 'ERROR';
    }
  }

  @Post('/zone/rh/annual/:year')
  async getZoneAnnualRH(
    @Param('year') year: number,
    @Body() zoneInfo: ZoneInfo
  ) {
    try {
      console.log(`Executing getZoneAnnualRH for year ${year}...`);
      const rhInformation = await this.geeService.getZoneAnnualRH(
        zoneInfo,
        +year
      );
      console.log('getZoneAnnualRH results: ', { rhInformation });
      return { statusCode: HttpStatus.OK, rhInformation };
    } catch (e) {
      console.log(`ERROR(GEEController - getZoneAnnualRH: ${e}`);
      return 'ERROR';
    }
  }

  @Post('/zone/rh/historical')
  async getZoneHistoricalRH(@Body() zoneInfo: ZoneInfo) {
    try {
      console.log('Executing getZoneHistoricalRH...');
      const historicalRHInformation = await this.geeService.getZoneHistoricalRH(
        zoneInfo
      );
      console.log('getZoneHistoricalRH results: ', { historicalRHInformation });
      return { statusCode: HttpStatus.OK, historicalRHInformation };
    } catch (e) {
      console.log(`ERROR(GEEController - getZoneHistoricalRH: ${e}`);
      return 'ERROR';
    }
  }
  // #endregion RH

  // #region RH
  @Post('/zone/rhProp/annual/mean')
  async getZoneAnnualRHPropMean(@Body() zoneInfo: ZoneInfo) {
    try {
      console.log('Executing getZoneAnnualRHPropMean...');
      const rhPropInformation = await this.geeService.getZoneAnnualRHPropMean(
        zoneInfo
      );
      console.log('getZoneAnnulRHPropMean result: ', { rhPropInformation });

      return { statusCode: HttpStatus.OK, rhPropInformation };
    } catch (e) {
      console.log(`ERROR(GEEController - getZoneAnnualRHPropMean: ${e}`);
      return 'ERROR';
    }
  }

  @Post('/zone/rhProp/annual/:year')
  async getZoneAnnualRHProp(
    @Param('year') year: number,
    @Body() zoneInfo: ZoneInfo
  ) {
    try {
      console.log(`Executing getZoneAnnualRHProp for year ${year}...`);
      const rhPropInformation = await this.geeService.getZoneAnnualRHProp(
        zoneInfo,
        +year
      );
      console.log('getZoneAnnualRHProp results: ', { rhPropInformation });
      return { statusCode: HttpStatus.OK, rhPropInformation };
    } catch (e) {
      console.log(`ERROR(GEEController - getZoneAnnualRHProp: ${e}`);
      return 'ERROR';
    }
  }

  @Post('/zone/rhProp/historical')
  async getZoneHistoricalRHProp(@Body() zoneInfo: ZoneInfo) {
    try {
      console.log('Executing getZoneHistoricalRHProp...');
      const historicalRHPropInformation =
        await this.geeService.getZoneHistoricalRHProp(zoneInfo);
      console.log('getZoneHistoricalRHProp results: ', {
        historicalRHPropInformation,
      });
      return { statusCode: HttpStatus.OK, historicalRHPropInformation };
    } catch (e) {
      console.log(`ERROR(GEEController - getZoneHistoricalRHProp: ${e}`);
      return 'ERROR';
    }
  }
  // #endregion RH

  //#region IOSE
  @Post('/zone/iose/historical')
  async getZoneHistoricalIOSE(@Body() zoneInfo: ZoneInfo) {
    try {
      console.log('Executing getZoneHistoricalIOSE...');
      const historicalIOSEInformation =
        await this.geeService.getZoneHistoricalIOSE(zoneInfo);
      console.log('getZoneHistoricalIOSE results: ', {
        historicalIOSEInformation: JSON.stringify(historicalIOSEInformation),
      });
      return { statusCode: HttpStatus.OK, historicalIOSEInformation };
    } catch (e) {
      console.log(`ERROR(GEEController - getZoneHistoricalIOSE: ${e}`);
      return 'ERROR';
    }
  }
  // #endregion IOSE

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

  // #region Police Sectionals
  @Get('police-sectionals')
  async getPoliceSectionals() {
    try {
      const policeSectionals = await this.geeService.getPoliceSectionals();
      return {
        statusCode: HttpStatus.OK,
        policeSectionals,
      };
    } catch (e) {
      console.log(`ERROR(GEEController - getPoliceSectionals: ${e}`);
      return 'ERROR';
    }
  }
  @Get('basins/:grade')
  async getBasins(@Param('grade') grade: 'I' | 'II' | 'III' | 'IV' | 'V') {
    try {
      const basins = await this.geeService.getBasins(grade);
      return {
        statusCode: HttpStatus.OK,
        basins,
      };
    } catch (e) {
      console.log(`ERROR(GEEController - getBasins: ${e}`);
      return 'ERROR';
    }
  }
  // #endregion

  // #region update GEE data
  @Post('update-ppna')
  async updatePPNA() {
    try {
      // TODO: Get year from parameters
      await this.geeService.updatePPNA(2023);
      return {
        statusCode: HttpStatus.OK,
      };
    } catch (e) {
      console.log(`ERROR(GEEController - updatePPNA: ${e}`);
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      };
    }
  }

  @Post('update-et')
  async updateET() {
    try {
      await this.geeService.updateET();
      return {
        statusCode: HttpStatus.OK,
      };
    } catch (e) {
      console.log(`ERROR(GEEController - updateET: ${e}`);
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      };
    }
  }

  @Get('check-tasks')
  async checkTasks() {
    try {
      await this.geeService.checkTasks();
      return {
        statusCode: HttpStatus.OK,
      };
    } catch (e) {
      console.log(`ERROR(GEEController - checkTasks: ${e}`);
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      };
    }
  }
  // #endregion
}
