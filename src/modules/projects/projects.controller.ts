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
import { ProjectsService } from './projects.service';
import { CreateProjectDto, UpdateProjectDto } from '../../types/project';

@Controller('projects')
@UseInterceptors(ClassSerializerInterceptor)
export class ProjectsController {
  constructor(@Inject(ProjectsService.token) private readonly projects: ProjectsService) {}

  @Get('/:id')
  async get(@Param('id', ParseUUIDPipe) id: string) {
    // get project by ID
    return this.projects.get(id);
  }

  @Post('/')
  async create(@Body() data: CreateProjectDto) {
    // create project
    return this.projects.create(data);
  }

  @Patch('/:id')
  async update(@Param('id', ParseUUIDPipe) id: string, @Body() data: UpdateProjectDto) {
    // update project
    return this.projects.update(id, data);
  }

  @Delete('/:id')
  async delete(@Param('id', ParseUUIDPipe) id: string) {
    // delete project
    return this.projects.delete(id);
  }
}
