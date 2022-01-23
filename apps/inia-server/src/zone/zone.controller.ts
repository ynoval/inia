import {
  Controller,
  Get,
  HttpStatus,
  NotFoundException,
  Param,
} from '@nestjs/common';
import { ZoneService } from './zone.service';

@Controller('zones')
export class ZoneController {
  constructor(private readonly zoneService: ZoneService) {}

  @Get('/:userId')
  async getAllByUser(@Param('userId') userId: string) {
    try {
      const zones = await this.zoneService.getAllByUser(userId);
      return { statusCode: HttpStatus.OK, zones };
    } catch (e) {
      console.log('ERROR(ZoneController - getAllByUser: ' + e);
      throw new NotFoundException();
    }
  }
}
