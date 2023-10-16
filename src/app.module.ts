import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeormModuleOptions } from './config/db';
import { ProjectGroupsModule } from './modules/project-groups/project-groups.module';

@Module({
  imports: [TypeOrmModule.forRoot(typeormModuleOptions), ProjectGroupsModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
