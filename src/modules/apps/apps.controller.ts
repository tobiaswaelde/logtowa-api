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
import { AppsService } from './apps.service';
import { CreateAppDto, UpdateAppDto } from '../../types/project';
import { LogsService } from '../app-logs/logs.service';
import { PageOptionsDto } from '../../types/pagination';
import { Filter, SortField } from '@nestjs-query/core';

@Controller('apps')
@UseInterceptors(ClassSerializerInterceptor)
export class AppsController {
  constructor(
    @Inject(AppsService.token) private readonly apps: AppsService,
    @Inject(LogsService.token) private readonly logs: LogsService,
  ) {}

  @Get('/:id')
  async get(@Param('id', ParseUUIDPipe) id: string) {
    // get app by ID
    return this.apps.get(id);
  }

  @Post('/')
  async create(@Body() data: CreateAppDto) {
    // create app
    return this.apps.create(data);
  }

  @Patch('/:id')
  async update(@Param('id', ParseUUIDPipe) id: string, @Body() data: UpdateAppDto) {
    // update app
    return this.apps.update(id, data);
  }

  @Delete('/:id')
  async delete(@Param('id', ParseUUIDPipe) id: string) {
    // delete app
    return this.apps.delete(id);
  }

  //#region logs
  @Get('/:id/logs')
  async getAll(
    @Param('id', ParseUUIDPipe) id: string,
    @Query() pageOptions: PageOptionsDto,
    // @Query('filter') filter: Filter<Log>,
    // @Query('sort') sort: SortField<Log>[],
  ) {
    // get all logs
    // return this.logs.getAll(id, pageOptions, filter, sort);
  }

  @Get('/:id/logs/count')
  async count(
    @Param('id', ParseUUIDPipe) id: string,
    // @Query('filter') filter: Filter<Log>
  ) {
    // get number of logs
    // return this.logs.count({ ...filter, app: { id: { eq: id } } });
  }

  @Get('/:id/logs/charts/hour')
  async getChartHour(@Param('id', ParseUUIDPipe) id: string) {
    return this.logs.getChartHour(id);
  }

  @Get('/:id/logs/charts/day')
  async getChartDay(@Param('id', ParseUUIDPipe) id: string) {
    return this.logs.getChartDay(id);
  }

  @Get('/:id/logs/charts/month')
  async getChartMonth(@Param('id', ParseUUIDPipe) id: string) {
    return this.logs.getChartMonth(id);
  }
  //#endregion
}
