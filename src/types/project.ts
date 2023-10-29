import { IsNotEmpty, IsOptional, IsUUID, MaxLength } from 'class-validator';
import { App } from '../models';
import { GroupDto } from './project-group';

export class AppDto {
  id: string;
  group: GroupDto;
  name: string;
  repoUrl?: string;

  constructor(partial: Partial<AppDto>) {
    Object.assign(this, partial);
  }

  public static fromProject(app: App): AppDto {
    const group = app.group ? GroupDto.fromGroup(app.group) : undefined;

    return new AppDto({
      ...app,
      group: group,
    });
  }
}

export class CreateAppDto {
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

export class UpdateAppDto {
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
