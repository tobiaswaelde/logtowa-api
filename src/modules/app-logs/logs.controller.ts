import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  Inject,
  Param,
  ParseUUIDPipe,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { LogsService } from './logs.service';
import { AuthGuard } from '../../guards/auth.guard';

@Controller('logs')
@UseGuards(AuthGuard)
@UseInterceptors(ClassSerializerInterceptor)
export class LogsController {
  constructor(@Inject(LogsService.token) private readonly logs: LogsService) {}

  @Get('/retention')
  async getRetentionInfo() {
    return this.logs.getRetentionInfo();
  }

  @Get('/:id')
  async get(@Param('id', ParseUUIDPipe) id: string) {
    // get log info
    return this.logs.get(id);
  }
}
