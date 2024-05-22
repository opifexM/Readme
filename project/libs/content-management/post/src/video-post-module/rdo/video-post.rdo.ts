import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { PostRdo } from '../../post-module/rdo/post.rdo';

export class VideoPostRdo extends PostRdo {
  @Expose()
  @ApiProperty({
    description: 'The title of the video post.',
    example: 'Exploring the Grand Canyon'
  })
  public title: string;

  @Expose()
  @ApiProperty({
    description: 'The URL where the video can be accessed.',
    example: 'https://example.com/video/grand-canyon'
  })
  public url: string;
}
