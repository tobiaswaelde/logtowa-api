import { QueryService } from '@nestjs-query/core';
import { TypeOrmQueryService } from '@nestjs-query/query-typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { App, Group } from '../../models';
import { Repository, Not } from 'typeorm';
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { CreateAppDto, AppDto, UpdateAppDto } from '../../types/app';

@Injectable()
@QueryService(App)
export class AppsService extends TypeOrmQueryService<App> {
  public static token: string = 'PROJECTS_SERVICE';

  constructor(
    @InjectRepository(App) readonly repo: Repository<App>,
    @InjectRepository(Group) readonly groups: Repository<Group>,
  ) {
    super(repo);
  }

  async get(id: string) {
    const app = await this.repo.findOne({ where: { id }, relations: { group: true } });
    if (!app) throw new NotFoundException();
    return AppDto.fromProject(app);
  }

  async create(data: CreateAppDto) {
    await this.checkExists(data.name, data.group);

    const app = this.repo.create({
      name: data.name,
      retentionSeconds: data.retentionSeconds,
      repoUrl: data.repoUrl,
    });
    if (data.group) {
      const group = await this.groups.findOne({ where: { id: data.group } });
      if (!group) {
        throw new BadRequestException(`Group with ID '${data.group}' not found.`);
      }
      app.group = group;
    }

    await this.repo.save(app, { reload: true });

    return AppDto.fromProject(app);
  }

  async update(id: string, data: UpdateAppDto) {
    await this.checkExists(data.name, data.group, id);

    const app = await this.repo.findOne({
      where: { id },
      relations: { group: true },
    });

    if (data.name) app.name = data.name;
    if (data.retentionSeconds) app.retentionSeconds = data.retentionSeconds;
    if (data.repoUrl) app.repoUrl = data.repoUrl;
    if (data.group) {
      const group = await this.groups.findOne({ where: { id: data.group } });
      if (!group) {
        throw new BadRequestException(`Group with ID '${data.group}' not found.`);
      }
      app.group = group;
    }

    await this.repo.save(app, { reload: true });

    return AppDto.fromProject(app);
  }

  async delete(id: string) {
    const app = await this.repo.findOne({ where: { id }, relations: { group: true } });
    if (!app) throw new NotFoundException();

    await this.deleteOne(id);
    return AppDto.fromProject(app);
  }

  private async checkExists(name: string, group?: string, id?: string) {
    const existingApp = await this.repo.findOne({
      where: {
        id: id ? Not(id) : undefined,
        name: name,
        group: { id: group },
      },
    });
    if (existingApp !== null) {
      throw new BadRequestException(`App '${name}' already exists in the current group.`);
    }
  }
}
