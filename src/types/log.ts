import { IsNotEmpty, IsOptional, IsObject, MaxLength, IsDate } from 'class-validator';
// import { Log } from '../models';

export class LogMessage {
  @IsNotEmpty()
  appKey: string;

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
  level: string;
  scope?: string | null;
  message: any;
  meta: object;

  constructor(partial: Partial<LogDto>) {
    Object.assign(this, { ...partial });
  }

  // public static fromLog(log: Log): LogDto {
  //   return new LogDto(log);
  // }
}

export class CreateLogDto {
  @IsNotEmpty()
  @IsDate()
  timestamp: Date;

  @IsNotEmpty()
  level: string;

  @IsOptional()
  scope?: string | null;

  @IsOptional()
  message?: string | null;

  @IsOptional()
  meta?: object;
}
