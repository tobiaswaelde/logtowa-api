import { IsNotEmpty, IsOptional, IsUUID, MaxLength } from 'class-validator';
import { ProjectGroup } from '../models';

export class ProjectGroupDto {
  id: string;
  name: string;
  parent: ProjectGroupDto;
  children: ProjectGroupDto[];
  projects: any[];

  constructor(partial: Partial<ProjectGroupDto>) {
    Object.assign(this, partial);
  }

  public static fromProjectGroup(projectGroup: ProjectGroup) {
    const parent = projectGroup.parent
      ? ProjectGroupDto.fromProjectGroup(projectGroup.parent)
      : undefined;
    const children = projectGroup.children?.map((x) => ProjectGroupDto.fromProjectGroup(x)) ?? [];
    const projects = projectGroup.projects?.map((x) => x) ?? [];

    return new ProjectGroupDto({
      ...projectGroup,
      parent: parent,
      children: children,
      projects: projects,
    });
  }
}

export class CreateProjectGroupDto {
  @IsNotEmpty()
  @MaxLength(255)
  name: string;

  @IsOptional()
  @IsUUID('4')
  parent?: string;
}

export class UpdateProjectGroupDto {
  @IsOptional()
  @MaxLength(255)
  name?: string;

  @IsOptional()
  @IsUUID('4')
  parent?: string;
}
