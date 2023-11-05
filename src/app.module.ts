import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeormModuleOptions } from './config/db';
import { GroupsModule } from './modules/groups/groups.module';
import { AppsModule } from './modules/apps/apps.module';
import { LogsModule } from './modules/app-logs/logs.module';
import { ChartsModule } from './modules/charts/charts.module';
import { HealthModule } from './modules/health/health.module';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    // db
    TypeOrmModule.forRoot(typeormModuleOptions),
    // api
    HealthModule,
    GroupsModule,
    AppsModule,
    LogsModule,
    ChartsModule,
    // schedules
    ScheduleModule.forRoot(),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
