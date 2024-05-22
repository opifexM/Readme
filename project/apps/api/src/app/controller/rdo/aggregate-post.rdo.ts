import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { PostRdo } from './post.rdo';

export class AggregatePostRdo extends PostRdo {
  toPOJO(): void {
    throw new Error('Method not implemented.');
  }

  @Expose()
  @ApiProperty({
    description: 'The URL of the content, if applicable.',
    example: 'https://example.com/content',
    required: false
  })
  public url?: string;

  @Expose()
  @ApiProperty({
    description: 'A brief description, if applicable.',
    example: 'An introductory description of the content.',
    required: false
  })
  public description?: string;

  @Expose()
  @ApiProperty({
    description: 'The text content, if applicable.',
    example: 'Detailed text content.',
    required: false
  })
  public text?: string;

  @Expose()
  @ApiProperty({
    description: 'The author of the quote, if applicable.',
    example: 'Famous Author',
    required: false
  })
  public author?: string;

  @Expose()
  @ApiProperty({
    description: 'The title of the post, if applicable.',
    example: 'Title of the Post',
    required: false
  })
  public title?: string;

  @Expose()
  @ApiProperty({
    description: 'A short announcement or headline, if applicable.',
    example: 'Breaking News!',
    required: false
  })
  public announcement?: string;
}
