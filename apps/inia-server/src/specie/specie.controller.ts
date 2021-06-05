import {
  Controller,
  Get,
  HttpStatus,
  NotFoundException,
  Param,
} from '@nestjs/common';
import { SpecieService } from './specie.service';

@Controller('species')
export class SpecieController {
  constructor(private readonly specieService: SpecieService) {}

  @Get()
  async getAll() {
    try {
      const specieList = await this.specieService.getAll();
      return { statusCode: HttpStatus.OK, ...specieList };
    } catch (e) {
      console.log('ERROR(SpecieController - getAll: ' + e);
    }
  }
  @Get('/:id')
  async getOne(@Param('id') specieId: string) {
    try {
      const specie = await this.specieService.getOne(specieId);
      return { statusCode: HttpStatus.OK, specie };
    } catch (e) {
      console.log('ERROR(SpecieController - getOne: ' + e);
      throw new NotFoundException();
    }
  }

  @Get('/:id/images')
  async getSpecieImages(@Param('id') specieId: string) {
    try {
      const imageList = await this.specieService.getImages(specieId);
      return { statusCode: HttpStatus.OK, imageList };
    } catch (e) {
      console.log('ERROR(SpecieController - getSpecieImages) ' + e);
      throw new NotFoundException();
    }
  }
}
