import { ApiProperty } from '@nestjs/swagger';
import { UserNotificationType, UserType } from '@project/shared-core';
import { Expose } from 'class-transformer';

export class UserRdo {
  @Expose()
  @ApiProperty({
    description: 'The unique identifier of the user.',
    example: '9c8becbd-7d1e-4826-b930-ddbd12490c86'
  })
  public id: string;

  @Expose()
  @ApiProperty({
    description: 'The email address of the user.',
    example: 'user@example.com'
  })
  public email: string;

  @Expose()
  @ApiProperty({
    description: 'The first name of the user.',
    example: 'John'
  })
  public firstName: string;

  @Expose()
  @ApiProperty({
    description: 'The last name of the user.',
    example: 'Doe'
  })
  public lastName: string;

  @Expose()
  @ApiProperty({
    description: 'The date of birth of the user.',
    type: 'string', format: 'date'
  })
  public dateOfBirth: Date;

  @Expose()
  @ApiProperty({
    description: 'The type of user.',
    enum: UserType
  })
  public userType: UserType;

  @Expose()
  @ApiProperty({
    description: 'The URL to the user\'s avatar image.',
    example: 'https://example.com/avatar.jpg'
  })
  public avatarId: string;

  @Expose()
  @ApiProperty({
    description: 'The date when the user was registered.',
    type: 'string',
    format: 'date'
  })
  public registeredAt: Date;

  @Expose()
  @ApiProperty({
    description: 'A list of subscription IDs the user is currently subscribed to.',
    type: [String]
  })
  public subscriptionIds: string[];

  @Expose()
  @ApiProperty({
    description: 'The total number of followers who follow the user.',
    example: 7
  })
  public followerCount: number

  @Expose()
  @ApiProperty({
    description: 'The total number of posts that have been published by the user.',
    example: 10
  })
  public postCount: number

  @Expose()
  @ApiProperty({
    description: 'The notification type settings for the user.',
    enum: UserNotificationType
  })
  public notificationType: UserNotificationType;
}
