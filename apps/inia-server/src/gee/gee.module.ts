import { Module } from '@nestjs/common';
import { GEEService } from './gee.service';
import { GEEController } from './gee.controller';
import { CoreModule } from '../core/core.module';

@Module({
  imports: [CoreModule],
  providers: [GEEService],
  controllers: [GEEController],
})
export class GEEModule {}
