import { IsNotEmpty, IsOptional, IsObject, MaxLength } from 'class-validator';

export class LogMessage {
  @IsNotEmpty()
  projectKey: string;

  @IsNotEmpty()
  @MaxLength(255)
  level: string;

  @IsOptional()
  @MaxLength(255)
  scope?: string;

  @IsNotEmpty()
  message: string;

  @IsOptional()
  @IsObject()
  meta?: object;
}
