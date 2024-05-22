import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString, IsUrl, Length } from 'class-validator';
import { USER } from '../constant/user.constant';

export class CreateUserDto {
  @ApiProperty({
    description: 'The unique user email address.',
    example: 'user@example.com',
  })
  @IsEmail()
  public email: string;

  @ApiProperty({
    description: 'The first name of the user.',
    example: 'John',
  })
  @IsString()
  @Length(USER.FIRST_NAME.MIN, USER.FIRST_NAME.MAX)
  public firstName: string;

  @ApiProperty({
    description: 'The last name of the user.',
    example: 'Doe',
  })
  @IsString()
  @Length(USER.LAST_NAME.MIN, USER.LAST_NAME.MAX)
  public lastName: string;

  @ApiProperty({
    description: 'The password for the user account.',
    example: 'YourSecurePassword123!',
  })
  @IsString()
  @Length(USER.PASSWORD.MIN, USER.PASSWORD.MAX)
  public password: string;

  @ApiProperty({
    description: 'The URL to the user\'s avatar image.',
    example: 'https://example.com/avatar.jpg',
    required: false,
  })
  @IsOptional()
  @IsUrl()
  public avatarId?: string;
}
