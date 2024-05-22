import { ApiProperty } from '@nestjs/swagger';
import { USER } from '@project/user-core';
import { IsString, Length } from 'class-validator';

export class ChangePasswordDto {
  @ApiProperty({
    description: 'The user current password.',
    example: 'CurrentPassword123!',
  })
  @IsString()
  @Length(USER.PASSWORD.MIN, USER.PASSWORD.MAX)
  public oldPassword: string;

  @ApiProperty({
    description: 'The new password that the user wants to set.',
    example: 'NewSecurePassword321!',
  })
  @IsString()
  @Length(USER.PASSWORD.MIN, USER.PASSWORD.MAX)
  public newPassword: string;
}
