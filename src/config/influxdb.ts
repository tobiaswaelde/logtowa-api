import { InfluxDB } from '@influxdata/influxdb-client';
import { ENV } from './env';

export const influxdb = new InfluxDB({
  url: ENV.INFLUXDB_URL,
  token: ENV.INFLUXDB_TOKEN,
});
