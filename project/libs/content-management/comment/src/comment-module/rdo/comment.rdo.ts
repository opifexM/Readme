import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class CommentRdo {
  @Expose()
  @ApiProperty({
    description: 'The unique identifier of the comment.',
    example: '123',
  })
  public id: string;

  @Expose()
  @ApiProperty({
    description: 'The text content of the comment.',
    example: 'This is a comment.',
  })
  public text: string;

  @Expose()
  @ApiProperty({
    description: 'The ID of the post to which the comment belongs.',
    example: '456',
  })
  public postId: string;

  @Expose()
  @ApiProperty({
    description: 'The ID of the user who authored the comment.',
    example: '789',
  })
  public authorId: string;

  @Expose()
  @ApiProperty({
    description: 'The date and time when the comment was created.',
    type: 'string',
    format: 'date-time',
    example: '2021-01-01T12:00:00Z',
  })
  public createdAt: Date;
}
