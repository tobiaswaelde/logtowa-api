import { LogsController } from './logs.controller';
import { Module } from '@nestjs/common';
import { LogsGateway } from './logs.gateway';
import { ProjectsService } from '../projects/projects.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Log, Project, ProjectGroup } from '../../models';
import { LogsService } from './logs.service';

@Module({
  imports: [TypeOrmModule.forFeature([ProjectGroup, Project, Log])],
  controllers: [LogsController],
  providers: [
    { provide: LogsService.token, useClass: LogsService },
    { provide: ProjectsService.token, useClass: ProjectsService },
    LogsGateway,
  ],
})
export class LogsModule {}
