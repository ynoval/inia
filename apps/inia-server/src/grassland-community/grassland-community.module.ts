import { Module } from '@nestjs/common';
import { GrasslandCommunityService } from './grassland-community.service';
import { GrasslandCommunityController } from './grassland-community.controller';
import { CoreModule } from '../core/core.module';
import { SpecieModule } from '../specie/specie.module';

@Module({
  imports: [CoreModule, SpecieModule],
  providers: [GrasslandCommunityService],
  controllers: [GrasslandCommunityController]
})
export class GrasslandCommunityModule {}
