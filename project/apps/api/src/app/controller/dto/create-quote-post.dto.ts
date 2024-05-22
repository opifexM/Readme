import { ApiProperty } from '@nestjs/swagger';
import { ArrayMaxSize, IsArray, IsOptional, IsString, Length, Matches, ValidateIf } from 'class-validator';
import { POST } from '../constant/post.constant';
import { QUOTE_POST } from '../constant/quote-post.constant';

export class CreateQuotePostDto {
  @ApiProperty({
    description: 'The main text of the quote post.',
    example: 'Life is what happens when you’re busy making other plans.'
  })
  @IsString()
  @Length(QUOTE_POST.TEXT.MIN, QUOTE_POST.TEXT.MAX)
  public text: string;

  @ApiProperty({
    description: 'The author of the quote.',
    example: 'John Lennon'
  })
  @IsString()
  @Length(QUOTE_POST.AUTHOR.MIN, QUOTE_POST.AUTHOR.MAX)
  public author: string;

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
