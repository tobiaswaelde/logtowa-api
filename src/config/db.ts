import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ENV } from './env';
import { entities } from '../models';
import { DataSource, DataSourceOptions } from 'typeorm';

const options: DataSourceOptions = {
  type: 'postgres',
  host: ENV.DB_HOST,
  port: ENV.DB_PORT,
  username: ENV.DB_USERNAME,
  password: ENV.DB_PASSWORD,
  ssl: ENV.DB_SECURE,
  database: ENV.DB_NAME,
  applicationName: ENV.APP_NAME,
  synchronize: ENV.DB_SYNC,
  entities: entities,
};

export const typeormModuleOptions: TypeOrmModuleOptions = options;
export const datasource = new DataSource(options);
