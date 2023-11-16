import {
  IsNotEmpty,
  IsOptional,
  IsObject,
  MaxLength,
  IsNumber,
  IsDateString,
} from 'class-validator';
import { Log } from '../models';

export class LogMessage {
  @IsNotEmpty()
  appKey: string;

  @IsOptional()
  @IsDateString()
  timestamp?: Date;

  @IsOptional()
  @IsNumber()
  ns?: number;

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

export class LogDto {
  id: string;
  timestamp: Date;
  ns: number;
  level: string;
  scope?: string | null;
  message: any;
  meta: object;

  constructor(partial: Partial<LogDto>) {
    Object.assign(this, { ...partial });
  }

  public static fromLog(log: Log): LogDto {
    return new LogDto(log);
  }
}

export class CreateLogDto {
  @IsNotEmpty()
  timestamp: Date;

  @IsNotEmpty()
  @IsNumber()
  ns: number;

  @IsNotEmpty()
  level: string;

  @IsOptional()
  scope?: string | null;

  @IsOptional()
  message?: string | null;

  @IsOptional()
  meta?: object;
}
