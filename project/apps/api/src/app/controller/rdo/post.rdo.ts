import { ApiProperty } from '@nestjs/swagger';
import { PostStatus, PostType } from '@project/shared-core';
import { Expose } from 'class-transformer';

export class PostRdo {
  @Expose()
  @ApiProperty({
    description: 'The unique identifier of the post.',
    example: '12345'
  })
  public id: string;

  @Expose()
  @ApiProperty({
    description: 'Tags associated with the post.',
    example: ['tag1', 'tag2']
  })
  public tags: string[];

  @Expose()
  @ApiProperty({
    description: 'The author of the post.',
    example: 'authorId123'
  })
  public authorId: string;

  @Expose()
  @ApiProperty({
    description: 'The date the post was published.',
    type: 'string',
    format: 'date-time',
    example: '2023-01-01T12:00:00Z'
  })
  public postedAt: Date;

  @Expose()
  @ApiProperty({
    description: 'The date the post was created.',
    type: 'string',
    format: 'date-time',
    example: '2023-01-01T12:00:00Z'
  })
  public createdAt: Date;

  @Expose()
  @ApiProperty({
    description: 'The status of the post.',
    enum: PostStatus
  })
  public postStatus: PostStatus;

  @Expose()
  @ApiProperty({
    description: 'The identifier of the original post, if this is a repost.',
    example: 'originalPostId456',
    required: false
  })
  public originalPostId: string;

  @Expose()
  @ApiProperty({
    description: 'The type of the post.',
    enum: PostType
  })
  public postType: PostType;

  @Expose()
  @ApiProperty({
    description: 'List of user IDs who liked the post.',
    type: [String],
    example: ['user1', 'user2']
  })
  public userLikeIds: string[];

  @Expose()
  @ApiProperty({
    description: 'The total number of likes on the post.',
    example: 150
  })
  public likeCount: number;

  @Expose()
  @ApiProperty({
    description: 'The total number of comments on the post.',
    example: 30
  })
  public commentCount: number;

  @Expose()
  @ApiProperty({
    description: 'The total number of times the post has been reposted.',
    example: 5
  })
  public repostCount: number;
}
