import {
  Controller,
  Get,
  HttpStatus,
  NotFoundException,
  Param,
} from '@nestjs/common';
import { CommunityService } from './community.service';

@Controller('communities')
export class CommunityController {
  constructor(private readonly communityService: CommunityService) {}

  @Get()
  async getAll() {
    try {
      const communities = await this.communityService.getAll();
      return { statusCode: HttpStatus.OK, communities };
    } catch (e) {
      console.log('ERROR(CommunityController - getAll: ' + e);
    }
  }
  @Get('/:id')
  async getOne(@Param('id') communityId: string) {
    try {
      const community = await this.communityService.getOne(communityId);
      return { statusCode: HttpStatus.OK, community };
    } catch (e) {
      console.log('ERROR(CommunityController - getOne: ' + e);
      return { statusCode: HttpStatus.NOT_FOUND };
    }
  }
  @Get('/findByOrder/:id')
  async getOneByOrder(@Param('id') communityOrder: string) {
    try {
      const community = await this.communityService.getOneByOrder(
        communityOrder
      );
      return { statusCode: HttpStatus.OK, community };
    } catch (e) {
      console.log('ERROR(CommunityController - getOneByOrder: ' + e);
      return { statusCode: HttpStatus.NOT_FOUND };
    }
  }
  @Get('/:id/species')
  async findSpecies(@Param('id') communityId: string) {
    try {
      const species = await this.communityService.findSpecies(communityId);
      return { statusCode: HttpStatus.OK, species };
    } catch (e) {
      console.log('ERROR(CommunityController - findSpecies: ' + e);
    }
  }

  @Get('/:id/subcommunities')
  async findSubCommunities(@Param('id') communityId: string) {
    try {
      const subcommunities = await this.communityService.findSubCommunities(
        communityId
      );
      return { statusCode: HttpStatus.OK, subcommunities };
    } catch (e) {
      console.log('ERROR(CommunityController - findSubcommiunities: ' + e);
    }
  }

  @Get(':id/subcommunities/:sid/images')
  async findSubCommunityImages(
    @Param('id') communityId: string,
    @Param('sid') subCommunityId: string
  ) {
    try {
      const imageList = await this.communityService.getSubCommunityImages(
        communityId,
        subCommunityId
      );
      return { statusCode: HttpStatus.OK, imageList };
    } catch (e) {
      console.log('ERROR(CommunityController - getSubCommunityImages) ' + e);
      throw new NotFoundException();
    }
  }
}
