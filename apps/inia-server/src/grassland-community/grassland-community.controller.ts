import {
  Controller,
  Get,
  HttpStatus,
  NotFoundException,
  Param,
} from '@nestjs/common';
import { GrasslandCommunityService } from './grassland-community.service';

@Controller('communities')
export class GrasslandCommunityController {
  constructor(
    private readonly grasslandCommunityService: GrasslandCommunityService
  ) {}

  @Get()
  async getAll() {
    try {
      const grasslandCommunityList = await this.grasslandCommunityService.getAll();
      return { statusCode: HttpStatus.OK, ...grasslandCommunityList };
    } catch (e) {
      console.log('ERROR(GrasslandCommunityController - getAll: ' + e);
    }
  }
  @Get('/:id')
  async getOne(@Param('id') grasslandCommunityId: string) {
    try {
      const grasslandCommunity = await this.grasslandCommunityService.getOne(
        grasslandCommunityId
      );
      return { statusCode: HttpStatus.OK, ...grasslandCommunity };
    } catch (e) {
      console.log('ERROR(GrasslandCommunityController - getOne: ' + e);
    }
  }
  @Get('/:id/species')
  async findSpecies(@Param('id') grasslandCommunityId: string) {
    try {
      const species = await this.grasslandCommunityService.findSpecies(
        grasslandCommunityId
      );
      return { statusCode: HttpStatus.OK, ...species };
    } catch (e) {
      console.log('ERROR(GrasslandCommunityController - findSpecies: ' + e);
    }
  }

  @Get('/:id/subcommunities')
  async findSubCommunities(@Param('id') grasslandCommunityId: string) {
    try {
      const subcommunities = await this.grasslandCommunityService.findSubCommunities(
        grasslandCommunityId
      );
      return { statusCode: HttpStatus.OK, ...subcommunities };
    } catch (e) {
      console.log(
        'ERROR(GrasslandCommunityController - findSubcommiunities: ' + e
      );
    }
  }

  @Get(':id/subcommunities/:sid/images')
  async findSubCommunityImages(
    @Param('id') communityId: string,
    @Param('sid') subCommunityId: string
  ) {
    try {
      const imageList = await this.grasslandCommunityService.getSubCommunityImages(
        communityId,
        subCommunityId
      );
      return { statusCode: HttpStatus.OK, imageList };
    } catch (e) {
      console.log('ERROR(SpecieController - getSpecieImages) ' + e);
      throw new NotFoundException();
    }
  }
}
