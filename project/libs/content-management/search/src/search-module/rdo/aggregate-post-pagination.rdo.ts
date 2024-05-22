import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { AggregatePostRdo } from './aggregate-post.rdo';

export class AggregatePostPaginationRdo {
  @Expose()
  @ApiProperty({
    description: 'Array of Aggregate Post entities',
    type: [AggregatePostRdo],
  })
  public entities: AggregatePostRdo[];

  @Expose()
  @ApiProperty({
    description: 'Total number of available pages',
    example: 5,
  })
  public totalPages: number;

  @Expose()
  @ApiProperty({
    description: 'Current page number',
    example: 1,
  })
  public currentPage: number;

  @Expose()
  @ApiProperty({
    description: 'Total number of items across all pages',
    example: 50,
  })
  public totalItems: number;

  @Expose()
  @ApiProperty({
    description: 'Number of items per page',
    example: 10,
  })
  public itemsPerPage: number;
}
