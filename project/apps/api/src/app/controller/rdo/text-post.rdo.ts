import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { PostRdo } from './post.rdo';

export class TextPostRdo extends PostRdo {
  @Expose()
  @ApiProperty({
    description: 'The title of the text post.',
    example: 'New Perspectives on Software Development'
  })
  public title: string;

  @Expose()
  @ApiProperty({
    description: 'A brief announcement or summary of the text post.',
    example: 'Exploring innovative approaches to modern software practices.'
  })
  public announcement: string;

  @Expose()
  @ApiProperty({
    description: 'The full text content of the post.',
    example: 'In this article, we delve into various methodologies...'
  })
  public text: string;
}
