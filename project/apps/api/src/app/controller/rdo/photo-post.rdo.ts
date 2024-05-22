import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { PostRdo } from './post.rdo';

export class PhotoPostRdo extends PostRdo {
  @Expose()
  @ApiProperty({
    description: 'The URL of the photo associated with the post.',
    example: 'https://example.com/photo.jpg'
  })
  public url: string;
}
