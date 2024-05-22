import { ApiProperty } from '@nestjs/swagger';
import { ArrayMaxSize, IsArray, IsOptional, IsString, IsUrl, Length, Matches, ValidateIf } from 'class-validator';
import { POST } from '../constant/post.constant';
import { VIDEO_POST } from '../constant/video-post.constant';

export class CreateVideoPostDto {
  @ApiProperty({
    description: 'The title of the video post.',
    example: 'Exploring the Grand Canyon'
  })
  @IsString()
  @Length(VIDEO_POST.TITLE.MIN, VIDEO_POST.TITLE.MAX)
  public title: string;

  @ApiProperty({
    description: 'The URL where the video can be accessed.',
    example: 'https://example.com/video/grand-canyon'
  })
  @IsUrl()
  public url: string;

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
}
