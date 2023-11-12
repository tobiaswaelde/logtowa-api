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
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AppsService } from './apps.service';
import { CreateAppDto, UpdateAppDto } from '../../types/app';
import { LogsService } from '../app-logs/logs.service';
import { PageOptionsDto } from '../../types/pagination';
import { Filter, SortField } from '@nestjs-query/core';
import { Log } from '../../models';
import { ChartsService } from '../charts/charts.service';
import { ChartDuration } from '../../types/chart-data';
import { AuthGuard } from '../../guards/auth.guard';

@Controller('apps')
@UseGuards(AuthGuard)
@UseInterceptors(ClassSerializerInterceptor)
export class AppsController {
  constructor(
    @Inject(AppsService.token) private readonly apps: AppsService,
    @Inject(LogsService.token) private readonly logs: LogsService,
    @Inject(ChartsService.token) private readonly charts: ChartsService,
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
    @Query('filter') filter: Filter<Log>,
    @Query('sort') sort: SortField<Log>[],
  ) {
    // get all logs
    return this.logs.getAll(id, pageOptions, filter, sort);
  }

  @Get('/:id/logs/count')
  async count(@Param('id', ParseUUIDPipe) id: string, @Query('filter') filter: Filter<Log>) {
    // get number of logs
    return this.logs.count({ ...filter, app: { id: { eq: id } } });
  }
  //#endregion

  //#region charts
  @Get('/:id/charts/:duration')
  async getChart(
    @Param('id', ParseUUIDPipe) id: string,
    @Param('duration') duration: ChartDuration,
    @Query('levels') levels?: string[],
  ) {
    return this.charts.getLogsCharts(duration, id, levels);
  }
  //#endregion
}
