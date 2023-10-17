import { IsNotEmpty, IsOptional, IsUUID, MaxLength } from 'class-validator';
import { Project } from '../models';
import { ProjectGroupDto } from './project-group';

export class ProjectDto {
  id: string;
  group: ProjectGroupDto;
  name: string;
  repoUrl?: string;

  constructor(partial: Partial<ProjectDto>) {
    Object.assign(this, partial);
  }

  public static fromProject(project: Project): ProjectDto {
    const group = project.group ? ProjectGroupDto.fromProjectGroup(project.group) : undefined;

    return new ProjectDto({
      ...project,
      group: group,
    });
  }
}

export class CreateProjectDto {
  @IsNotEmpty()
  @IsUUID('4')
  group: string;

  @IsNotEmpty()
  @MaxLength(255)
  name: string;

  @IsOptional()
  @MaxLength(2000)
  repoUrl?: string;
}

export class UpdateProjectDto {
  @IsOptional()
  @IsUUID('4')
  group: string;

  @IsOptional()
  @MaxLength(255)
  name: string;

  @IsOptional()
  @MaxLength(2000)
  repoUrl?: string;
}
