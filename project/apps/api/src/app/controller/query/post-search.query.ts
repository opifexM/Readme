import { ApiPropertyOptional } from '@nestjs/swagger';
import { PostStatus, PostType, SortDirection, SortType } from '@project/shared-core';
import { Type } from 'class-transformer';
import { ArrayMaxSize, IsArray, IsIn, IsNumber, IsOptional, IsPositive, IsString, ValidateIf } from 'class-validator';
import { POST } from '../constant/post.constant';

export class PostSearchQuery {
  @ApiPropertyOptional({
    description: 'Page number of the posts pagination',
    type: Number,
    example: 1
  })
  @IsNumber()
  @IsPositive()
  @IsOptional()
  @Type(() => Number)
  public page?: number;

  @ApiPropertyOptional({
    description: 'Limit the number of posts returned',
    type: Number,
    example: 10
  })
  @IsNumber()
  @IsPositive()
  @IsOptional()
  @Type(() => Number)
  public limit?: number;

  @ApiPropertyOptional({
    description: 'The title of the post.',
    example: 'New Perspectives on Software Development'
  })
  @IsString()
  @IsOptional()
  public title?: string;

  @ApiPropertyOptional({
    description: 'The unique identifier of the author of the posts',
    example: '6629510ff7987067e6076a82'
  })
  @IsOptional()
  @IsArray()
  @ValidateIf(post => post.authorIds && post.authorIds.length > 0)
  @IsString({ each: true })
  public authorIds?: string[];

  @ApiPropertyOptional({
    description: 'Filter posts by type',
    enum: PostType,
    example: PostType.TEXT
  })
  @IsIn(Object.values(PostType))
  @IsOptional()
  public postType?: PostType;

  @ApiPropertyOptional({
    description: 'Type of post status to be applied to the post list',
    enum: PostStatus,
    example: PostStatus.PUBLISHED
  })
  @IsIn(Object.values(PostStatus))
  @IsOptional()
  public postStatus?: PostStatus;

  @ApiPropertyOptional({
    description: 'Tags associated with the post. Each tag should start with a letter, be a single word',
    example: ['tech', 'news'],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @ArrayMaxSize(POST.TAG.ARRAY_MAX)
  @ValidateIf(post => post.tags && post.tags.length > 0)
  @IsString({ each: true })
  public tags?: string[];

  @ApiPropertyOptional({
    description: 'Direction of posts sorting (ASC or DESC)',
    enum: SortDirection,
    example: SortDirection.ASC
  })
  @IsIn(Object.values(SortDirection))
  @IsOptional()
  public sortDirection?: SortDirection;

  @ApiPropertyOptional({
    description: 'Type of sorting to be applied to the post list',
    enum: SortType,
    example: SortType.BY_DATE
  })
  @IsIn(Object.values(SortType))
  @IsOptional()
  public sortType?: SortType;

  @ApiPropertyOptional({
    description: 'The date the post was published.',
    type: 'string',
    format: 'date-time',
    example: '2023-01-01T12:00:00Z'
  })
  @IsOptional()
  public postDate?: Date;
}
