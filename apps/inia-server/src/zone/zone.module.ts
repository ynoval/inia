import { Module } from '@nestjs/common';
import { CoreModule } from '../core/core.module';

import { ZoneService } from './zone.service';
import { ZoneController } from './zone.controller';

@Module({
  imports: [CoreModule],
  providers: [ZoneService],
  controllers: [ZoneController],
  exports: [ZoneService],
})
export class ZoneModule {}
