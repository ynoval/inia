import { Module } from '@nestjs/common';
import { GEEService } from './gee.service';
import { GEEController } from './gee.controller';
import { CoreModule } from '../core/core.module';
import { CommunityModule } from '../community/community.module';

@Module({
  imports: [CoreModule, CommunityModule],
  providers: [GEEService],
  controllers: [GEEController],
  exports: [GEEService]
})
export class GEEModule {}
