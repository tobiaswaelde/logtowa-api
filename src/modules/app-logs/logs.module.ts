import { LogsController } from './logs.controller';
import { Module } from '@nestjs/common';
import { LogsGateway } from './logs.gateway';
import { AppsService } from '../apps/apps.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Group, App } from '../../models';
import { LogsService } from './logs.service';

@Module({
  imports: [TypeOrmModule.forFeature([Group, App])],
  controllers: [LogsController],
  providers: [
    { provide: LogsService.token, useClass: LogsService },
    { provide: AppsService.token, useClass: AppsService },
    LogsGateway,
  ],
})
export class LogsModule {}
