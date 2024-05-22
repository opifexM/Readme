import { ApiProperty } from '@nestjs/swagger';
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
import { POST } from '../constant/post.constant';
import { TEXT_POST } from '../constant/text-post.constant';

export class UpdateTextPostDto {
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
    description: 'The updated title of the text post, if applicable.',
    example: 'Advanced Perspectives on Software Development',
    required: false
  })
  @IsOptional()
  @IsString()
  @Length(TEXT_POST.TITLE.MIN, TEXT_POST.TITLE.MAX)
  public title?: string;

  @ApiProperty({
    description: 'Updated announcement or summary of the text post, if applicable.',
    example: 'A deeper look into cutting-edge software practices.',
    required: false
  })
  @IsOptional()
  @IsString()
  @Length(TEXT_POST.ANNOUNCEMENT.MIN, TEXT_POST.ANNOUNCEMENT.MAX)
  public announcement?: string;

  @ApiProperty({
    description: 'Updated full text content of the post, if applicable.',
    example: 'This updated article continues to explore...',
    required: false
  })
  @IsOptional()
  @IsString()
  @Length(TEXT_POST.TEXT.MIN, TEXT_POST.TEXT.MAX)
  public text?: string;
}
