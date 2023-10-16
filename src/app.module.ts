import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeormModuleOptions } from './config/db';
import { ProjectGroupsModule } from './modules/project-groups/project-groups.module';
import { ProjectsModule } from './modules/projects/projects.module';

@Module({
  imports: [TypeOrmModule.forRoot(typeormModuleOptions), ProjectGroupsModule, ProjectsModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
