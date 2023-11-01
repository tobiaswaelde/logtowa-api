import axios from 'axios';
import { ENV } from '../config/env';

export class InfluxApi {
  private static api = axios.create({
    baseURL: `${ENV.INFLUXDB_URL}/api/v2`,
    headers: {
      Authorization: `Token ${ENV.INFLUXDB_TOKEN}`,
    },
  });

  private static async getOrgId(name: string = ENV.INFLUXDB_ORG): Promise<string | null> {
    const res = await this.api.get('/orgs');
    const org = res.data.orgs.find((x) => x.name === name);
    if (!org) {
      throw new Error(`Organisation '${name}' not found.`);
    }

    return org.id;
  }

  public static async createBucket(
    id: string,
    name: string,
    retentionSeconds: number = 60 * 60 * 24 * 365,
  ) {
    try {
      const orgId = await this.getOrgId();

      const res = await this.api.post('/buckets', {
        name: id,
        description: name,
        orgId: orgId,
        retentionRules: [{ everySeconds: retentionSeconds }],
      });

      return res.data;
    } catch (err) {
      return null;
    }
  }

  public static async updateBucket(id: string, data: { retentionSeconds: number }) {
    try {
      const res = await this.api.patch(`/buckets/${id}`, {
        retentionRules: [{ everySeconds: data.retentionSeconds }],
      });
      return res.data;
    } catch (err) {
      return null;
    }
  }

  public static async deleteBucket(id: string) {
    try {
      const res = await this.api.delete(`/buckets/${id}`);
      return res.data;
    } catch (err) {
      return null;
    }
  }
}
