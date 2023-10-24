import { Type } from 'class-transformer';
import { IsArray, IsInt, IsOptional, Max, Min } from 'class-validator';

export interface PageMetaDtoParams {
  pageOptions: PageOptionsDto;
  itemCount: number;
}

export class PageOptionsDto {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  readonly page?: number = 1;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(1000)
  @IsOptional()
  readonly perPage?: number = 50;

  get skip(): number {
    return (this.page - 1) * this.perPage;
  }
}

export class PageMetaDto {
  readonly page: number;
  readonly perPage: number;
  readonly itemCount: number;
  readonly pageCount: number;
  readonly hasPrevPage: boolean;
  readonly hasNextPage: boolean;

  constructor({ pageOptions, itemCount }: PageMetaDtoParams) {
    this.page = pageOptions.page;
    this.perPage = pageOptions.perPage;
    this.itemCount = itemCount;
    this.pageCount = Math.ceil(this.itemCount / this.perPage);
    this.hasPrevPage = this.page > 1;
    this.hasNextPage = this.page < this.pageCount;
  }
}

export class PaginatedDto<T> {
  @IsArray()
  readonly items: T[];

  readonly meta: PageMetaDto;

  constructor(items: T[], meta: PageMetaDto) {
    this.items = items;
    this.meta = meta;
  }
}
