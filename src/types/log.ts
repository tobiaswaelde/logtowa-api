import { IsNotEmpty, IsOptional, IsObject } from 'class-validator';

export class LogMessage {
  @IsNotEmpty()
  projectKey: string;

  @IsNotEmpty()
  level: string;

  @IsOptional()
  scope?: string;

  @IsNotEmpty()
  message: string;

  @IsOptional()
  @IsObject()
  meta?: object;
}
