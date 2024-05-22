import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { CommentRdo } from './comment.rdo';

export class CommentPaginationRdo {
  @Expose()
  @ApiProperty({
    description: 'Array of Comment entities',
    type: [CommentRdo],
  })
  public entities: CommentRdo[];

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
