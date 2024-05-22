import { ApiPropertyOptional } from '@nestjs/swagger';
import { SortDirection, SortType } from '@project/shared-core';
import { Type } from 'class-transformer';
import { IsIn, IsNumber, IsOptional, IsPositive } from 'class-validator';

export class PersonaFeedQuery {
  @ApiPropertyOptional({
    description: 'Page number of the personal feed posts pagination',
    type: Number,
    example: 1
  })
  @IsNumber()
  @IsPositive()
  @IsOptional()
  @Type(() => Number)
  public page?: number;

  @ApiPropertyOptional({
    description: 'Limit the number of personal feed posts returned',
    type: Number,
    example: 10
  })
  @IsNumber()
  @IsPositive()
  @IsOptional()
  @Type(() => Number)
  public limit?: number;

  @ApiPropertyOptional({
    description: 'Direction of personal feed posts sorting (ASC or DESC)',
    enum: SortDirection,
    example: SortDirection.ASC
  })
  @IsIn(Object.values(SortDirection))
  @IsOptional()
  public sortDirection?: SortDirection;

  @ApiPropertyOptional({
    description: 'Type of sorting to be applied to personal feed post list',
    enum: SortType,
    example: SortType.BY_DATE
  })
  @IsIn(Object.values(SortType))
  @IsOptional()
  public sortType?: SortType;

  public authorIds?: string[];
}
