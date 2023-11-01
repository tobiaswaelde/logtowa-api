import { TypeOrmQueryService } from '@nestjs-query/query-typeorm';
import { Filter, QueryService, SortField } from '@nestjs-query/core';
import { Log, App } from '../../models';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThanOrEqual } from 'typeorm';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PageMetaDto, PageOptionsDto, PaginatedDto } from '../../types/pagination';
import { CreateLogDto, LogDto } from '../../types/log';
import * as moment from 'moment';
import { ChartData } from '../../types/chart-data';

@Injectable()
@QueryService(Log)
export class LogsService extends TypeOrmQueryService<Log> {
  public static token: string = 'LOGS_SERVICE';

  constructor(
    @InjectRepository(Log) readonly repo: Repository<Log>,
    @InjectRepository(App) readonly appsRepo: Repository<App>,
  ) {
    super(repo);
  }

  async getAll(
    projectId: string,
    pageOptions: PageOptionsDto,
    filter?: Filter<Log>,
    sort?: SortField<Log>[],
  ) {
    const count = await this.count({ ...filter, app: { id: { eq: projectId } } });

    const items = await this.query({
      paging: {
        limit: pageOptions.perPage,
        offset: pageOptions.skip,
      },
      filter: { ...filter, app: { id: { eq: projectId } } },
      sorting: sort,
    });

    const logs = items.map(LogDto.fromLog).map(({ meta, ...rest }) => ({ ...rest }));
    const pageMeta = new PageMetaDto({ itemCount: count, pageOptions });

    return new PaginatedDto(logs, pageMeta);
  }

  async get(id: string) {
    const log = await this.repo.findOneBy({ id });
    if (!log) throw new NotFoundException();
    return LogDto.fromLog(log);
  }

  async create(appKey: string, data: CreateLogDto) {
    const app = await this.appsRepo.findOneBy({ id: appKey });
    if (!app) throw new BadRequestException('Invalid App ID.');

    const log = this.repo.create({ ...data });
    log.app = app;

    await this.repo.save(log, { reload: true });
    return LogDto.fromLog(log);
  }

  private async getLogsSince(date: Date) {
    return this.repo.find({
      select: ['timestamp', 'level'],
      order: { timestamp: 'asc' },
      where: { timestamp: MoreThanOrEqual(date) },
    });
  }

  private getMinutes(date: moment.Moment) {
    const lastHour = date.clone().subtract(1, 'hour');

    const minutes: string[] = [];
    while (lastHour.isBefore(date.endOf('minute'))) {
      const minute = lastHour.format('YYYY-MM-DD HH:mm');
      minutes.push(minute);
      lastHour.add(1, 'minute');
    }

    return minutes;
  }
  private getHours(date: moment.Moment) {
    const lastDay = date.clone().subtract(1, 'day');

    const hours: string[] = [];
    while (lastDay.isBefore(date.endOf('hour'))) {
      const hour = lastDay.format('YYYY-MM-DD HH');
      hours.push(hour);
      lastDay.add(1, 'hour');
    }

    return hours;
  }
  private getDays(date: moment.Moment) {
    const lastMonth = date.clone().subtract(1, 'month');

    const days: string[] = [];
    while (lastMonth.isBefore(date.endOf('day'))) {
      const day = lastMonth.format('YYYY-MM-DD');
      days.push(day);
      lastMonth.add(1, 'day');
    }

    return days;
  }

  async getChartHour(id: string): Promise<ChartData> {
    const now = moment();
    const lastHour = moment(now).subtract(1, 'hour');
    const minutes = this.getMinutes(now);

    const minuteCounts: { [minute: string]: { [level: string]: number } } = {};
    for (const minute of minutes) {
      minuteCounts[minute] = minuteCounts[minute] || {};
    }

    const levels = new Set<string>();

    const logs = await this.getLogsSince(lastHour.toDate());
    logs.forEach((log) => {
      levels.add(log.level);
      const minute = moment(log.timestamp).format('YYYY-MM-DD HH:mm');

      minuteCounts[minute] = minuteCounts[minute] || {};
      minuteCounts[minute][log.level] = (minuteCounts[minute][log.level] || 0) + 1;
    });

    const labels = minutes.map((x) => moment(x).format('HH:mm'));
    const series = Array.from(levels).map((level) => ({
      level: level,
      data: Object.values(minuteCounts).map((x) => x[level] || 0),
    }));

    return {
      levels: Array.from(levels),
      labels: labels,
      series: series,
    };
  }

  async getChartDay(id: string) {
    const now = moment();
    const lastDay = moment(now).subtract(1, 'day');
    const hours = this.getHours(now);

    const hourCounts: { [hour: string]: { [level: string]: number } } = {};
    for (const hour of hours) {
      hourCounts[hour] = hourCounts[hour] || {};
    }

    const levels = new Set<string>();

    const logs = await this.getLogsSince(lastDay.toDate());
    logs.forEach((log) => {
      levels.add(log.level);
      const hour = moment(log.timestamp).format('YYYY-MM-DD HH');

      hourCounts[hour] = hourCounts[hour] || {};
      hourCounts[hour][log.level] = (hourCounts[hour][log.level] || 0) + 1;
    });

    const labels = hours.map((x) => moment(x).format('HH:mm'));
    const series = Array.from(levels).map((level) => ({
      level: level,
      data: Object.values(hourCounts).map((x) => x[level] || 0),
    }));

    return {
      levels: Array.from(levels),
      labels: labels,
      series: series,
    };
  }

  async getChartMonth(id: string) {
    const now = moment();
    const lastMonth = moment(now).subtract(1, 'month');
    const days = this.getDays(now);

    const dayCounts: { [day: string]: { [level: string]: number } } = {};
    for (const day of days) {
      dayCounts[day] = dayCounts[day] || {};
    }

    const levels = new Set<string>();

    const logs = await this.getLogsSince(lastMonth.toDate());
    logs.forEach((log) => {
      levels.add(log.level);
      const hour = moment(log.timestamp).format('YYYY-MM-DD');

      dayCounts[hour] = dayCounts[hour] || {};
      dayCounts[hour][log.level] = (dayCounts[hour][log.level] || 0) + 1;
    });

    const labels = days.map((x) => moment(x).format('YYYY-MM-DD'));
    const series = Array.from(levels).map((level) => ({
      level: level,
      data: Object.values(dayCounts).map((x) => x[level] || 0),
    }));

    return {
      levels: Array.from(levels),
      labels: labels,
      series: series,
    };
  }
}
