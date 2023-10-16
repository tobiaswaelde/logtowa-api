import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { ProjectGroup } from '../../models';
import { TypeOrmQueryService } from '@nestjs-query/query-typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryService } from '@nestjs-query/core';
import { Not, Repository, IsNull } from 'typeorm';
import {
  CreateProjectGroupDto,
  ProjectGroupDto,
  UpdateProjectGroupDto,
} from '../../types/project-group';

@Injectable()
@QueryService(ProjectGroup)
export class ProjectGroupsService extends TypeOrmQueryService<ProjectGroup> {
  public static token: string = 'PROJECT_GROUPS_SERVICE';

  constructor(@InjectRepository(ProjectGroup) readonly repo: Repository<ProjectGroup>) {
    super(repo);
  }

  async getAll() {
    const projectGroups = await this.repo.find({
      order: { name: 'ASC' },
      where: { parent: IsNull() },
      relations: { parent: true, children: true, projects: true },
    });
    return projectGroups.map((x) => ProjectGroupDto.fromProjectGroup(x));
  }

  async get(id: string) {
    const projectGroup = await this.repo.findOne({
      where: { id },
      relations: { parent: true, children: true, projects: true },
    });
    if (!projectGroup) throw new NotFoundException();
    return ProjectGroupDto.fromProjectGroup(projectGroup);
  }

  async create(data: CreateProjectGroupDto) {
    await this.checkExists(data.name, data.parent);

    const projectGroup = this.repo.create({
      name: data.name,
    });
    if (data.parent) {
      const parentGroup = await this.repo.findOne({ where: { id: data.parent } });
      if (!projectGroup) {
        throw new BadRequestException(`Project group with ID '${data.parent}' not found.`);
      }
      projectGroup.parent = parentGroup;
    }

    await this.repo.save(projectGroup, { reload: true });

    return ProjectGroupDto.fromProjectGroup(projectGroup);
  }

  async update(id: string, data: UpdateProjectGroupDto) {
    await this.checkExists(data.name, data.parent, id);

    const projectGroup = await this.repo.findOne({
      where: { id },
      relations: { parent: true, children: true, projects: true },
    });

    if (data.name) projectGroup.name = data.name;
    if (data.parent) {
      const parentGroup = await this.repo.findOne({ where: { id: data.parent } });
      if (!projectGroup)
        throw new BadRequestException(`ProjectGroup with ID '${data.parent}' not found.`);
      projectGroup.parent = parentGroup;
    }

    await this.repo.save(projectGroup, { reload: true });

    return ProjectGroupDto.fromProjectGroup(projectGroup);
  }

  async delete(id: string) {
    const projectGroup = await this.repo.findOneBy({ id });
    if (!projectGroup) throw new NotFoundException();

    await this.deleteOne(id);
    return ProjectGroupDto.fromProjectGroup(projectGroup);
  }

  private async checkExists(name: string, parent?: string, id?: string) {
    // check if project group already exists
    const existingGroup = await this.repo.findOne({
      where: {
        id: id ? Not(id) : undefined,
        name: name,
        parent: { id: parent },
      },
    });
    if (existingGroup !== null) {
      throw new BadRequestException(`Project group '${name}' already exists in the current group.`);
    }
  }
}
