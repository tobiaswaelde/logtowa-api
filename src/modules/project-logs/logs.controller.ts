import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  Inject,
  Param,
  ParseUUIDPipe,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { LogsService } from './logs.service';
import { PageOptionsDto } from '../../types/pagination';
import { Filter, SortField } from '@nestjs-query/core';
import { Log } from '../../models';

@Controller('logs')
@UseInterceptors(ClassSerializerInterceptor)
export class LogsController {
  constructor(@Inject(LogsService.token) private readonly logs: LogsService) {}

  @Get('/')
  async getAll(
    @Query() pageOptions: PageOptionsDto,
    @Query('filter') filter: Filter<Log>,
    @Query('sort') sort: SortField<Log>[],
  ) {
    // get all logs
    return this.logs.getAll(pageOptions, filter, sort);
  }

  @Get('/count')
  async count(@Query('filter') filter: Filter<Log>) {
    // get number of logs
    return this.logs.count(filter);
  }

  @Get('/:id')
  async get(@Param('id', ParseUUIDPipe) id: string) {
    // get log info
    return this.logs.get(id);
  }
}
