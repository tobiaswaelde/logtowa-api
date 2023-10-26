import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { CreateProjectDto, UpdateProjectDto } from '../../types/project';
import { LogsService } from '../project-logs/logs.service';
import { PageOptionsDto } from '../../types/pagination';
import { Filter, SortField } from '@nestjs-query/core';
import { Log } from '../../models';

@Controller('projects')
@UseInterceptors(ClassSerializerInterceptor)
export class ProjectsController {
  constructor(
    @Inject(ProjectsService.token) private readonly projects: ProjectsService,
    @Inject(LogsService.token) private readonly logs: LogsService,
  ) {}

  @Get('/:id')
  async get(@Param('id', ParseUUIDPipe) id: string) {
    // get project by ID
    return this.projects.get(id);
  }

  @Post('/')
  async create(@Body() data: CreateProjectDto) {
    // create project
    return this.projects.create(data);
  }

  @Patch('/:id')
  async update(@Param('id', ParseUUIDPipe) id: string, @Body() data: UpdateProjectDto) {
    // update project
    return this.projects.update(id, data);
  }

  @Delete('/:id')
  async delete(@Param('id', ParseUUIDPipe) id: string) {
    // delete project
    return this.projects.delete(id);
  }

  //#region logs
  @Get('/:id/logs')
  async getAll(
    @Param('id', ParseUUIDPipe) id: string,
    @Query() pageOptions: PageOptionsDto,
    @Query('filter') filter: Filter<Log>,
    @Query('sort') sort: SortField<Log>[],
  ) {
    // get all logs
    return this.logs.getAll(id, pageOptions, filter, sort);
  }

  @Get('/:id/logs/count')
  async count(@Param('id', ParseUUIDPipe) id: string, @Query('filter') filter: Filter<Log>) {
    // get number of logs
    return this.logs.count({ ...filter, project: { id: { eq: id } } });
  }
  //#endregion
}
