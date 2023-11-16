import { IsNotEmpty, IsOptional, IsUUID, Max, MaxLength, Min } from 'class-validator';
import { App } from '../models';
import { GroupDto } from './project-group';

export class AppDto {
  id: string;
  group: GroupDto;
  name: string;
  repoUrl?: string;
  retentionSeconds: number;

  constructor(partial: Partial<AppDto>) {
    Object.assign(this, partial);
  }

  public static fromApp(app: App): AppDto {
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

  @IsNotEmpty()
  @Min(0)
  @Max(315360000) // 10 years
  retentionSeconds: number;
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

  @IsOptional()
  @Min(0)
  @Max(315360000) // 10 years
  retentionSeconds?: number;
}
