import { ApiProperty } from '@nestjs/swagger';
import { POST, QUOTE_POST } from '@project/content-core';
import { PostStatus } from '@project/shared-core';
import {
  ArrayMaxSize,
  IsArray,
  IsDate,
  IsEnum,
  IsOptional,
  IsString,
  Length,
  Matches,
  ValidateIf
} from 'class-validator';

export class UpdateQuotePostDto {
  @ApiProperty({
    description: 'Tags associated with the post. Each tag should start with a letter, be a single word',
    example: ['tech', 'news'],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @ArrayMaxSize(POST.TAG.ARRAY_MAX)
  @ValidateIf(post => post.tags && post.tags.length > 0)
  @IsString({ each: true })
  @Length(POST.TAG.SINGLE_MIN, POST.TAG.SINGLE_MAX, { each: true })
  @Matches(/^[a-zA-Z][a-zA-Z0-9]*$/, { each: true })
  @Matches(/^\S*$/, { each: true })
  public tags?: string[];

  @ApiProperty({
    description: 'The current status of the post.',
    enum: PostStatus
  })
  @IsOptional()
  @IsEnum(PostStatus)
  public postStatus?: PostStatus;

  @ApiProperty({
    description: 'The date the post was published.',
    type: 'string',
    format: 'date-time',
    example: '2023-01-01T12:00:00Z'
  })
  @IsOptional()
  @IsDate()
  public postedAt?: Date;

  @ApiProperty({
    description: 'The updated text of the quote, if changing.',
    example: 'Life is what happens to you while you’re busy making other plans.',
    required: false
  })
  @IsOptional()
  @IsString()
  @Length(QUOTE_POST.TEXT.MIN, QUOTE_POST.TEXT.MAX)
  public text?: string;

  @ApiProperty({
    description: 'The updated author of the quote, if changing.',
    example: 'John Lennon',
    required: false
  })
  @IsOptional()
  @IsString()
  @Length(QUOTE_POST.AUTHOR.MIN, QUOTE_POST.AUTHOR.MAX)
  public author?: string;
}
