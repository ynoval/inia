import { Controller, Get, Param } from '@nestjs/common';
import { MapType } from './gee.constants';
import { GEEService } from './gee.service'

@Controller('gee')
export class GEEController {
  constructor(private readonly geeService: GEEService) {}

  @Get('/maps/:id')
  async getMap(@Param('id') mapType: MapType) {
    try {
      const mapId = await this.geeService.getMap(mapType);
      return mapId;
    } catch (e) {
      console.log('ERROR(GEEController - getAll: ' + e);
    }
  }
}
