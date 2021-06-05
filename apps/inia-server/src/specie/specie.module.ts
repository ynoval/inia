import { Module } from '@nestjs/common';
import { SpecieService } from './specie.service';
import { SpecieController } from './specie.controller';
import { CoreModule } from '../core/core.module';

@Module({
  imports: [CoreModule],
  providers: [SpecieService],
  controllers: [SpecieController],
  exports: [SpecieService],
})
export class SpecieModule {}
