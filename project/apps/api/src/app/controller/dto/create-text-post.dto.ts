import { ApiProperty } from '@nestjs/swagger';
import { ArrayMaxSize, IsArray, IsOptional, IsString, Length, Matches, ValidateIf } from 'class-validator';
import { POST } from '../constant/post.constant';
import { TEXT_POST } from '../constant/text-post.constant';

export class CreateTextPostDto {
  @ApiProperty({
    description: 'The title of the text post.',
    example: 'New Perspectives on Software Development'
  })
  @IsString()
  @Length(TEXT_POST.TITLE.MIN, TEXT_POST.TITLE.MAX)
  public title: string;

  @ApiProperty({
    description: 'A brief announcement or summary of the text post.',
    example: 'Exploring innovative approaches to modern software practices.'
  })
  @IsString()
  @Length(TEXT_POST.ANNOUNCEMENT.MIN, TEXT_POST.ANNOUNCEMENT.MAX)
  public announcement: string;

  @ApiProperty({
    description: 'The full text content of the post.',
    example: 'In this article, we delve into various methodologies...'
  })
  @IsString()
  @Length(TEXT_POST.TEXT.MIN, TEXT_POST.TEXT.MAX)
  public text: string;

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
