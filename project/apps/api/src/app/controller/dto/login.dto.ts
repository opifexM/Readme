import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length } from 'class-validator';
import { USER } from '../constant/user.constant';

export class LoginDto {
  @ApiProperty({
    description: 'The email address of the user trying to log in.',
    example: 'user@example.com',
  })
  @IsString()
  public email: string;

  @ApiProperty({
    description: 'The password for the user account.',
    example: 'UserPassword123!',
  })
  @IsString()
  @Length(USER.PASSWORD.MIN, USER.PASSWORD.MAX)
  public password: string;
}
