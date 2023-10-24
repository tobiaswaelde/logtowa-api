import { ClassSerializerInterceptor, Controller, Inject, UseInterceptors } from '@nestjs/common';
import { LogsService } from './logs.service';

@Controller('logs')
@UseInterceptors(ClassSerializerInterceptor)
export class LogsController {
  constructor(@Inject(LogsService.token) private readonly logs: LogsService) {}
}
