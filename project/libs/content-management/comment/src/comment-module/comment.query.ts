import { ApiPropertyOptional } from '@nestjs/swagger';
import { SortDirection } from '@project/shared-core';
import { Type } from 'class-transformer';
import { IsIn, IsNumber, IsOptional, IsPositive } from 'class-validator';

export class CommentQuery {
  @ApiPropertyOptional({
    description: 'Page number of the comments pagination',
    type: Number,
    example: 1
  })
  @IsNumber()
  @IsPositive()
  @IsOptional()
  @Type(() => Number)
  public page?: number;

  @ApiPropertyOptional({
    description: 'Limit the number of comments returned',
    type: Number,
    example: 10
  })
  @IsNumber()
  @IsPositive()
  @IsOptional()
  @Type(() => Number)
  public limit?: number;

  @ApiPropertyOptional({
    description: 'Direction of comments sorting (ASC or DESC)',
    enum: SortDirection,
    example: SortDirection.ASC
  })
  @IsIn(Object.values(SortDirection))
  @IsOptional()
  public sortDirection?: SortDirection;
}
