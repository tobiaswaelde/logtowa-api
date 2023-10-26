import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Log, Project, ProjectGroup } from '../../models';
import { ProjectsController } from './projects.controller';
import { ProjectsService } from './projects.service';
import { LogsService } from '../project-logs/logs.service';

@Module({
  imports: [TypeOrmModule.forFeature([ProjectGroup, Project, Log])],
  controllers: [ProjectsController],
  providers: [
    { provide: ProjectsService.token, useClass: ProjectsService },
    { provide: LogsService.token, useClass: LogsService },
  ],
})
export class ProjectsModule {}
