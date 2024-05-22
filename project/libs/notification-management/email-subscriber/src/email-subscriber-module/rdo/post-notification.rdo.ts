import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class PostNotificationRdo {
  @Expose()
  @ApiProperty({
    description: 'Total number of posts that will be included in the email notification.',
    example: 5,
    required: true
  })
  public postCount: number;

  @Expose()
  @ApiProperty({
    description: 'Total number of users who will receive the email notification.',
    example: 150,
    required: true
  })
  public userCount: number;

  @Expose()
  @ApiProperty({
    description: 'New Posts for the Period.',
    example: '2023-01-01T12:00:00Z',
    required: true
  })
  public lastPostDate: Date;
}
