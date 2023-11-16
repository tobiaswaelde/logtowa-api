import { IsNotEmpty, IsOptional, IsUUID, MaxLength } from 'class-validator';
import { Group } from '../models';
import { AppDto } from './app';

export class GroupDto {
  id: string;
  name: string;
  parent: GroupDto;
  children: GroupDto[];
  apps: AppDto[];

  constructor(partial: Partial<GroupDto>) {
    Object.assign(this, partial);
  }

  public static fromGroup(group: Group) {
    const parent = group.parent ? GroupDto.fromGroup(group.parent) : undefined;
    const children = group.children?.map((x) => GroupDto.fromGroup(x)) ?? undefined;
    const apps = group.apps?.map((x) => AppDto.fromApp(x)) ?? undefined;

    return new GroupDto({
      ...group,
      parent: parent,
      children: children,
      apps: apps,
    });
  }
}

export class CreateGroupDto {
  @IsNotEmpty()
  @MaxLength(255)
  name: string;

  @IsOptional()
  @IsUUID('4')
  parent?: string;
}

export class UpdateGroupDto {
  @IsOptional()
  @MaxLength(255)
  name?: string;

  @IsOptional()
  @IsUUID('4')
  parent?: string;
}
