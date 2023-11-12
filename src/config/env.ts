import * as path from 'node:path';
import * as dotenv from 'dotenv';
import { bool, cleanEnv, num, str } from 'envalid';

const envPath = path.resolve(process.cwd(), '.env.local');
dotenv.config({ path: envPath });

export const ENV = cleanEnv(process.env, {
  // app
  PORT: num({ default: 3001 }),
  APP_NAME: str({ default: 'LogTowa' }),
  LOG_LEVEL: str({ default: 'warn', devDefault: 'info' }),
  // db
  DB_HOST: str(),
  DB_PORT: num({ default: 5432 }),
  DB_NAME: str({ devDefault: 'logtowa' }),
  DB_USERNAME: str(),
  DB_PASSWORD: str(),
  DB_SECURE: bool({ default: true }),
  DB_SYNC: bool({ default: false, devDefault: true }),
  // auth
  SOCKET_TOKEN: str({
    desc: 'Token to authenticate socket connections. Used by the winston transport.',
  }),
  AUTH_TOKEN: str({ desc: 'Token to authenticate API requests. Used by the frontend.' }),
  // retention
  RETENTION_ENABLED: bool({ default: true }),
  RETENTION_CRON: str({ default: '0 0 * * *', devDefault: '* * * * *' }),
});
