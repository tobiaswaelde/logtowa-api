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
import { ProjectGroupsService } from './project-groups.service';
import { CreateProjectGroupDto, UpdateProjectGroupDto } from '../../types/project-group';

@Controller('project-groups')
@UseInterceptors(ClassSerializerInterceptor)
export class ProjectGroupsController {
  constructor(
    @Inject(ProjectGroupsService.token) private readonly projectGroups: ProjectGroupsService,
  ) {}

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
  async create(@Body() data: CreateProjectGroupDto) {
    // create project group
    return await this.projectGroups.create(data);
  }

  @Patch('/:id')
  async update(@Param('id', ParseUUIDPipe) id: string, @Body() data: UpdateProjectGroupDto) {
    // update project group
    return await this.projectGroups.update(id, data);
  }

  @Delete('/:id')
  async delete(@Param('id', ParseUUIDPipe) id: string) {
    // delete project group
    return await this.projectGroups.delete(id);
  }
}
