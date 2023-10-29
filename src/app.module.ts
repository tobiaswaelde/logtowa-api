import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeormModuleOptions } from './config/db';
import { GroupsModule } from './modules/groups/groups.module';
import { AppsModule } from './modules/apps/apps.module';
import { LogsModule } from './modules/app-logs/logs.module';

@Module({
  imports: [TypeOrmModule.forRoot(typeormModuleOptions), GroupsModule, AppsModule, LogsModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
