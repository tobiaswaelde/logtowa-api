import { QueryService } from '@nestjs-query/core';
import { TypeOrmQueryService } from '@nestjs-query/query-typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Project, ProjectGroup } from '../../models';
import { Repository, Not } from 'typeorm';
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { CreateProjectDto, ProjectDto, UpdateProjectDto } from '../../types/project';

@Injectable()
@QueryService(Project)
export class ProjectsService extends TypeOrmQueryService<Project> {
  public static token: string = 'PROJECTS_SERVICE';

  constructor(
    @InjectRepository(Project) readonly repo: Repository<Project>,
    @InjectRepository(ProjectGroup) readonly projectGroups: Repository<ProjectGroup>,
  ) {
    super(repo);
  }

  async get(id: string) {
    const project = await this.repo.findOne({ where: { id }, relations: { group: true } });
    if (!project) throw new NotFoundException();
    return ProjectDto.fromProject(project);
  }

  async create(data: CreateProjectDto) {
    await this.checkExists(data.name, data.group);

    const project = this.repo.create({
      name: data.name,
      repoUrl: data.repoUrl,
    });
    if (data.group) {
      const projectGroup = await this.projectGroups.findOne({ where: { id: data.group } });
      if (!projectGroup) {
        throw new BadRequestException(`Project group with ID '${data.group}' not found.`);
      }
      project.group = projectGroup;
    }

    await this.repo.save(project, { reload: true });

    return ProjectDto.fromProject(project);
  }

  async update(id: string, data: UpdateProjectDto) {
    await this.checkExists(data.name, data.group, id);

    const project = await this.repo.findOne({
      where: { id },
      relations: { group: true },
    });

    if (data.name) project.name = data.name;
    if (data.repoUrl) project.repoUrl = data.repoUrl;
    if (data.group) {
      const projectGroup = await this.projectGroups.findOne({ where: { id: data.group } });
      if (!projectGroup) {
        throw new BadRequestException(`Project group with ID '${data.group}' not found.`);
      }
      project.group = projectGroup;
    }

    await this.repo.save(project, { reload: true });

    return ProjectDto.fromProject(project);
  }

  async delete(id: string) {
    const project = await this.repo.findOneBy({ id });
    if (!project) throw new NotFoundException();

    await this.deleteOne(id);
    return ProjectDto.fromProject(project);
  }

  private async checkExists(name: string, group?: string, id?: string) {
    const existingProject = await this.repo.findOne({
      where: {
        id: id ? Not(id) : undefined,
        name: name,
        group: { id: group },
      },
    });
    if (existingProject !== null) {
      throw new BadRequestException(`Project '${name}' already exists in the current group.`);
    }
  }
}
