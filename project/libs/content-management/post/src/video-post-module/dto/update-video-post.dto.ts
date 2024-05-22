import { ApiProperty } from '@nestjs/swagger';
import { POST, VIDEO_POST } from '@project/content-core';
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

export class UpdateVideoPostDto {
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
    description: 'The updated title of the video post, if applicable.',
    example: 'The Grand Canyon: A Closer Look',
    required: false
  })
  @IsOptional()
  @IsString()
  @Length(VIDEO_POST.TITLE.MIN, VIDEO_POST.TITLE.MAX)
  public title?: string;

  @ApiProperty({
    description: 'The updated URL of the video, if applicable.',
    example: 'https://example.com/video/grand-canyon-close',
    required: false
  })
  @IsOptional()
  @IsUrl()
  public url?: string;
}
