import { ApiProperty } from '@nestjs/swagger';
import { POST } from '@project/content-core';
import { ArrayMaxSize, IsArray, IsOptional, IsString, IsUrl, Length, Matches, ValidateIf } from 'class-validator';

export class CreatePhotoPostDto {
  @ApiProperty({
    description: 'The URL of the photo.',
    example: 'https://example.com/photo.jpg'
  })
  @IsOptional()
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
