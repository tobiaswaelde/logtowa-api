import { TypeOrmQueryService } from '@nestjs-query/query-typeorm';
import { Log } from '../../models';
import { QueryService } from '@nestjs-query/core';
import { InjectRepository } from '@nestjs/typeorm';
import { Equal, In, MoreThanOrEqual, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import * as moment from 'moment';
import { ChartDuration } from '../../types/chart-data';

@Injectable()
@QueryService(Log)
export class ChartsService extends TypeOrmQueryService<Log> {
  public static token: string = 'CHARTS_SERVICE';

  constructor(@InjectRepository(Log) readonly repo: Repository<Log>) {
    super(repo);
  }

  private getIntervalKey(date: moment.Moment, duration: ChartDuration) {
    switch (duration) {
      case 'hour':
        return date.format('YYYY-MM-DD HH:mm');
      case 'day':
        return date.format('YYYY-MM-DD HH');
      case 'month':
        return date.format('YYYY-MM-DD');
    }
  }
  private getIntervalLabel(date: moment.Moment, duration: ChartDuration) {
    switch (duration) {
      case 'hour':
      case 'day':
        return date.format('HH:mm');
      case 'month':
        return date.format('YYYY-MM-DD');
    }
  }
  private getIntervalKeys(date: moment.Moment, duration: ChartDuration) {
    const lastInterval = moment(date).subtract(1, duration);

    const keys: string[] = [];

    if (duration === 'hour') {
      while (lastInterval.isBefore(date.endOf('minute'))) {
        const key = this.getIntervalKey(lastInterval, duration);
        keys.push(key);
        lastInterval.add(1, 'minute');
      }
    } else if (duration === 'day') {
      while (lastInterval.isBefore(date.endOf('hour'))) {
        const key = this.getIntervalKey(lastInterval, duration);
        keys.push(key);
        lastInterval.add(1, 'hour');
      }
    } else if (duration === 'month') {
      while (lastInterval.isBefore(date.endOf('day'))) {
        const key = this.getIntervalKey(lastInterval, duration);
        keys.push(key);
        lastInterval.add(1, 'day');
      }
    }

    return keys;
  }

  private async getLogsSince(date: Date, appId?: string, levels?: string[]) {
    return this.repo.find({
      select: ['timestamp', 'level'],
      order: { timestamp: 'asc' },
      where: {
        timestamp: MoreThanOrEqual(date),
        app: appId ? Equal(appId) : undefined,
        level: levels ? In(levels) : undefined,
      },
    });
  }

  public async getLogsCharts(duration: ChartDuration, appId?: string, selectedLevels?: string[]) {
    const now = moment();
    const lastInterval = moment(now).subtract(1, duration);
    const keys = this.getIntervalKeys(now, duration);

    // prefill object
    const intervalCounts: { [key: string]: { [level: string]: number } } = {};
    for (const key of keys) {
      intervalCounts[key] = {};
    }

    const levels = new Set<string>(['error', 'warn', 'info', 'http', 'debug', 'silly', 'verbose']);

    // get data
    const logs = await this.getLogsSince(lastInterval.toDate(), appId, selectedLevels);
    logs.forEach(({ level, timestamp }) => {
      levels.add(level);
      const intervalKey = this.getIntervalKey(moment(timestamp), duration);

      intervalCounts[intervalKey] = intervalCounts[intervalKey] || {};
      intervalCounts[intervalKey][level] = (intervalCounts[intervalKey][level] || 0) + 1;
    });

    // prepare data
    const sortedLevels = Array.from(levels).sort((a, b) => a.localeCompare(b));
    const labels = keys.map((x) => this.getIntervalLabel(moment(x), duration));
    const series = sortedLevels.map((level) => ({
      level: level,
      data: Object.values(intervalCounts).map((x) => x[level] || 0),
    }));

    // return chart data
    return {
      levels: sortedLevels,
      labels: labels,
      series: series,
    };
  }

  public async getLevelsChart(duration: ChartDuration) {
    const now = moment();
    const lastInterval = moment(now).subtract(1, duration);

    const levels = new Set<string>(['error', 'warn', 'info', 'http', 'debug', 'silly', 'verbose']);
    const data = new Map<string, number>();

    const logs = await this.getLogsSince(lastInterval.toDate());
    logs.forEach(({ level }) => {
      levels.add(level);
      data.set(level, (data.get(level) || 0) + 1);
    });

    // prepare data
    const sortedLevels = Array.from(levels).sort((a, b) => a.localeCompare(b));
    const labels = sortedLevels;
    const series = sortedLevels.map((x) => data.get(x) || 0);

    // return chart data
    return {
      labels: labels,
      series: series,
    };
  }
}
