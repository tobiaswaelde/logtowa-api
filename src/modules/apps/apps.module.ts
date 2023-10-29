import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { App, Group, Log } from '../../models';
import { AppsController } from './apps.controller';
import { AppsService } from './apps.service';
import { LogsService } from '../app-logs/logs.service';

@Module({
  imports: [TypeOrmModule.forFeature([Group, App, Log])],
  controllers: [AppsController],
  providers: [
    { provide: AppsService.token, useClass: AppsService },
    { provide: LogsService.token, useClass: LogsService },
  ],
})
export class AppsModule {}
