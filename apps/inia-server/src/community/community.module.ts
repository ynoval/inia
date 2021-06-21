import { Module } from '@nestjs/common';
import { CommunityService } from './community.service';
import { CommunityController } from './community.controller';
import { CoreModule } from '../core/core.module';
import { SpecieModule } from '../specie/specie.module';

@Module({
  imports: [CoreModule, SpecieModule],
  providers: [CommunityService],
  controllers: [CommunityController],
  exports: [CommunityService],
})
export class CommunityModule {}
