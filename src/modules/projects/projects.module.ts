import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Project, ProjectGroup } from '../../models';
import { ProjectsController } from './projects.controller';
import { ProjectsService } from './projects.service';

@Module({
  imports: [TypeOrmModule.forFeature([ProjectGroup, Project])],
  controllers: [ProjectsController],
  providers: [{ provide: ProjectsService.token, useClass: ProjectsService }],
})
export class ProjectsModule {}
