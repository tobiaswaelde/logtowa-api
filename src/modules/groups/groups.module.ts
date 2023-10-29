import { TypeOrmModule } from '@nestjs/typeorm';
import { Group } from '../../models';
import { GroupsController } from './groups.controller';
import { Module } from '@nestjs/common';
import { GroupsService } from './groups.service';

@Module({
  imports: [TypeOrmModule.forFeature([Group])],
  controllers: [GroupsController],
  providers: [{ provide: GroupsService.token, useClass: GroupsService }],
})
export class GroupsModule {}
