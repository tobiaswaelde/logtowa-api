import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  Inject,
  Param,
  UseInterceptors,
} from '@nestjs/common';
import { ChartsService } from './charts.service';
import { ChartDuration } from '../../types/chart-data';

@Controller('charts')
@UseInterceptors(ClassSerializerInterceptor)
export class ChartsController {
  constructor(@Inject(ChartsService.token) private readonly charts: ChartsService) {}

  @Get('/logs/:duration')
  async getLogsChart(@Param('duration') duration: ChartDuration) {
    return this.charts.getLogsCharts(duration);
  }

  @Get('/levels/:duration')
  async getLevelsChart(@Param('duration') duration: ChartDuration) {
    return this.charts.getLevelsChart(duration);
  }
}
