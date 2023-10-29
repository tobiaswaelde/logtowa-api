import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  Inject,
  Param,
  ParseUUIDPipe,
  UseInterceptors,
} from '@nestjs/common';
import { LogsService } from './logs.service';

@Controller('logs')
@UseInterceptors(ClassSerializerInterceptor)
export class LogsController {
  constructor(@Inject(LogsService.token) private readonly logs: LogsService) {}

  @Get('/:id')
  async get(@Param('id', ParseUUIDPipe) id: string) {
    // get log info
    return this.logs.get(id);
  }
}
