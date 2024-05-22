import { ApiProperty } from '@nestjs/swagger';
import {
  ArrayMaxSize,
  IsArray,
  IsOptional,
  IsString,
  IsUrl,
  Length,
  Matches,
  MaxLength,
  ValidateIf
} from 'class-validator';
import { LINK_POST } from '../constant/link-post.constant';
import { POST } from '../constant/post.constant';

export class CreateLinkPostDto {
  @ApiProperty({
    description: 'The URL of the link post.',
    example: 'https://example.com/article'
  })
  @IsUrl()
  public url: string;

  @ApiProperty({
    description: 'A short description of the link post.',
    example: 'This is an interesting article about technology.'
  })
  @IsString()
  @MaxLength(LINK_POST.DESCRIPTION.MAX)
  public description: string;

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
