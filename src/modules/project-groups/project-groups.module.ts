import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectGroup } from '../../models';
import { ProjectGroupsController } from './project-groups.controller';
import { Module } from '@nestjs/common';
import { ProjectGroupsService } from './project-groups.service';

@Module({
  imports: [TypeOrmModule.forFeature([ProjectGroup])],
  controllers: [ProjectGroupsController],
  providers: [{ provide: ProjectGroupsService.token, useClass: ProjectGroupsService }],
})
export class ProjectGroupsModule {}
