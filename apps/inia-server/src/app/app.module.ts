// External dependencies
import { Module } from '@nestjs/common';
//App dependencies
import { CoreModule } from '../core/core.module';
import { SpecieModule } from '../specie/specie.module';
import { CommunityModule } from '../community/community.module';
//Module
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GEEModule } from '../gee/gee.module';

@Module({
  imports: [CoreModule, SpecieModule, CommunityModule, GEEModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
