import { IsNotEmpty, IsOptional, IsUUID, MaxLength } from 'class-validator';
import { Group } from '../models';

export class GroupDto {
  id: string;
  name: string;
  parent: GroupDto;
  children: GroupDto[];
  projects: any[];

  constructor(partial: Partial<GroupDto>) {
    Object.assign(this, partial);
  }

  public static fromGroup(group: Group) {
    const parent = group.parent ? GroupDto.fromGroup(group.parent) : undefined;
    const children = group.children?.map((x) => GroupDto.fromGroup(x)) ?? [];
    const projects = group.apps?.map((x) => x) ?? [];

    return new GroupDto({
      ...group,
      parent: parent,
      children: children,
      projects: projects,
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
