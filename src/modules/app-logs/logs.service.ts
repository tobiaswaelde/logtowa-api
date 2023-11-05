import { TypeOrmQueryService } from '@nestjs-query/query-typeorm';
import { Filter, QueryService, SortField } from '@nestjs-query/core';
import { Log, App } from '../../models';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan } from 'typeorm';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PageMetaDto, PageOptionsDto, PaginatedDto } from '../../types/pagination';
import { CreateLogDto, LogDto } from '../../types/log';
import * as moment from 'moment';
import { runInSequence } from 'run-in-sequence';
import { Cron, SchedulerRegistry } from '@nestjs/schedule';
import { ENV } from '../../config/env';

@Injectable()
@QueryService(Log)
export class LogsService extends TypeOrmQueryService<Log> {
  public static token: string = 'LOGS_SERVICE';

  constructor(
    private scheduler: SchedulerRegistry,
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

  @Cron(ENV.RETENTION_CRON, { name: 'log-retention', disabled: !ENV.RETENTION_ENABLED })
  public async checkLogRetention() {
    // get apps
    const apps = await this.appsRepo.find({ select: { id: true, retentionSeconds: true } });

    // get functions to delete old logs
    const deleteOldLogsFunctions = apps.map((app) => async () => {
      // calculate timestamp of the last log to keep
      const ts = moment().subtract(app.retentionSeconds, 'seconds').toDate();
      // delete logs older than the timestamp
      await this.repo.delete({ app: { id: app.id }, timestamp: LessThan(ts) });
    });

    await runInSequence(deleteOldLogsFunctions);
  }

  async getRetentionInfo() {
    const job = this.scheduler.getCronJob('log-retention');
    return {
      lastDate: job.lastDate()?.toISOString() ?? null,
      nextDate: job.nextDate().toISO(),
      nextDates: job.nextDates(10).map((x) => x.toISO()),
    };
  }
}
