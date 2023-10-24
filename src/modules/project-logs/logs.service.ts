import { TypeOrmQueryService } from '@nestjs-query/query-typeorm';
import { Filter, QueryService, SortField } from '@nestjs-query/core';
import { Log, Project } from '../../models';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PageMetaDto, PageOptionsDto, PaginatedDto } from '../../types/pagination';
import { CreateLogDto, LogDto } from '../../types/log';

@Injectable()
@QueryService(Log)
export class LogsService extends TypeOrmQueryService<Log> {
  public static token: string = 'LOGS_SERVICE';

  constructor(
    @InjectRepository(Log) readonly repo: Repository<Log>,
    @InjectRepository(Project) readonly projectsRepo: Repository<Project>,
  ) {
    super(repo);
  }

  async getAll(pageOptions: PageOptionsDto, filter?: Filter<Log>, sort?: SortField<Log>[]) {
    const items = await this.query({
      paging: {
        limit: pageOptions.perPage,
        offset: pageOptions.skip,
      },
      filter: filter,
      sorting: sort,
    });

    const logs = items.map(LogDto.fromLog).map(({ meta, ...rest }) => ({ ...rest }));
    const pageMeta = new PageMetaDto({ itemCount: logs.length, pageOptions });

    return new PaginatedDto(logs, pageMeta);
  }

  async get(id: string) {
    const log = await this.repo.findOneBy({ id });
    if (!log) throw new NotFoundException();
    return LogDto.fromLog(log);
  }

  async create(projectKey: string, data: CreateLogDto) {
    const project = await this.projectsRepo.findOneBy({ id: projectKey });
    if (!project) throw new BadRequestException('Invalid Project ID.');

    const log = this.repo.create({ ...data });
    log.project = project;

    await this.repo.save(log, { reload: true });
    return LogDto.fromLog(log);
  }
}
