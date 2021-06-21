import { Controller, Get, HttpStatus, Param } from '@nestjs/common';
import { MapType } from './gee.models';
import { GEEService } from './gee.service';

@Controller('gee')
export class GEEController {
  constructor(private readonly geeService: GEEService) {}

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
}
