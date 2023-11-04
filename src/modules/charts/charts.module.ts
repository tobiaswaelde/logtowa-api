import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Log } from '../../models';
import { ChartsController } from './charts.controller';
import { ChartsService } from './charts.service';

@Module({
  imports: [TypeOrmModule.forFeature([Log])],
  controllers: [ChartsController],
  providers: [{ provide: ChartsService.token, useClass: ChartsService }],
})
export class ChartsModule {}
