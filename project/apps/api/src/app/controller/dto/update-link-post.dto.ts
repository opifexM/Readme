import { ApiProperty } from '@nestjs/swagger';
import { PostStatus } from '@project/shared-core';
import {
  ArrayMaxSize,
  IsArray,
  IsDate,
  IsEnum,
  IsOptional,
  IsString,
  IsUrl,
  Length,
  Matches,
  ValidateIf
} from 'class-validator';
import { POST } from '../constant/post.constant';

export class UpdateLinkPostDto {
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
    description: 'The URL of the link post, if updating.',
    example: 'https://example.com/new-article',
    required: false
  })
  @IsOptional()
  @IsUrl()
  public url?: string;

  @ApiProperty({
    description: 'A new description for the post, if updating.',
    example: 'Updated description of the article.',
    required: false
  })
  @IsOptional()
  @IsString()
  public description?: string;
}
