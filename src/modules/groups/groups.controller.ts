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
  UseInterceptors,
} from '@nestjs/common';
import { GroupsService } from './groups.service';
import { CreateGroupDto, UpdateGroupDto } from '../../types/project-group';

@Controller('groups')
@UseInterceptors(ClassSerializerInterceptor)
export class GroupsController {
  constructor(@Inject(GroupsService.token) private readonly projectGroups: GroupsService) {}

  @Get('/')
  async getAll() {
    // get all project groups
    return await this.projectGroups.getAll();
  }

  @Get('/:id')
  async get(@Param('id', ParseUUIDPipe) id: string) {
    // get project group by ID
    return await this.projectGroups.get(id);
  }

  @Post('/')
  async create(@Body() data: CreateGroupDto) {
    // create project group
    return await this.projectGroups.create(data);
  }

  @Patch('/:id')
  async update(@Param('id', ParseUUIDPipe) id: string, @Body() data: UpdateGroupDto) {
    // update project group
    return await this.projectGroups.update(id, data);
  }

  @Delete('/:id')
  async delete(@Param('id', ParseUUIDPipe) id: string) {
    // delete project group
    return await this.projectGroups.delete(id);
  }
}
