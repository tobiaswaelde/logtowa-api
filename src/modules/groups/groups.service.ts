import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Group } from '../../models';
import { TypeOrmQueryService } from '@nestjs-query/query-typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryService } from '@nestjs-query/core';
import { Not, Repository, IsNull } from 'typeorm';
import { CreateGroupDto, GroupDto as GroupDto, UpdateGroupDto } from '../../types/project-group';

@Injectable()
@QueryService(Group)
export class GroupsService extends TypeOrmQueryService<Group> {
  public static token: string = 'GROUPS_SERVICE';

  constructor(@InjectRepository(Group) readonly repo: Repository<Group>) {
    super(repo);
  }

  async getAll() {
    const groups = await this.repo.find({
      order: { name: 'ASC' },
      where: { parent: IsNull() },
      relations: { parent: true, children: true, apps: true },
    });
    return groups.map((x) => GroupDto.fromGroup(x));
  }

  async get(id: string) {
    const group = await this.repo.findOne({
      where: { id },
      relations: { parent: true, children: true, apps: true },
    });
    if (!group) throw new NotFoundException();
    return GroupDto.fromGroup(group);
  }

  async create(data: CreateGroupDto) {
    await this.checkExists(data.name, data.parent);

    const group = this.repo.create({
      name: data.name,
    });
    if (data.parent) {
      const parentGroup = await this.repo.findOne({ where: { id: data.parent } });
      if (!group) {
        throw new BadRequestException(`Project group with ID '${data.parent}' not found.`);
      }
      group.parent = parentGroup;
    }

    await this.repo.save(group, { reload: true });

    return GroupDto.fromGroup(group);
  }

  async update(id: string, data: UpdateGroupDto) {
    await this.checkExists(data.name, data.parent, id);

    const group = await this.repo.findOne({
      where: { id },
      relations: { parent: true, children: true, apps: true },
    });

    if (data.name) group.name = data.name;
    if (data.parent) {
      const parentGroup = await this.repo.findOne({ where: { id: data.parent } });
      if (!group) throw new BadRequestException(`ProjectGroup with ID '${data.parent}' not found.`);
      group.parent = parentGroup;
    }

    await this.repo.save(group, { reload: true });

    return GroupDto.fromGroup(group);
  }

  async delete(id: string) {
    const group = await this.repo.findOne({
      where: { id },
      relations: { parent: true, children: true, apps: true },
    });
    if (!group) throw new NotFoundException();

    if (group.children.length > 0) {
      throw new BadRequestException('The group still has subgroups.');
    }
    if (group.apps.length > 0) {
      throw new BadRequestException('The group still has apps.');
    }

    await this.deleteOne(id);
    return GroupDto.fromGroup(group);
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
