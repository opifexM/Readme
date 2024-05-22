import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { PostRdo } from './post.rdo';

export class LinkPostRdo extends PostRdo {
  @Expose()
  @ApiProperty({
    description: 'The URL of the link post.',
    example: 'https://example.com/article'
  })
  public url: string;

  @Expose()
  @ApiProperty({
    description: 'A short description of the link post.',
    example: 'This is an interesting article about technology.'
  })
  public description: string;
}
