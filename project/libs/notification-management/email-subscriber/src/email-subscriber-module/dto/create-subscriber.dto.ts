import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CreateSubscriberDto {
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
  @IsNotEmpty()
  @IsString()
  public firstName: string;

  @ApiProperty({
    description: 'The last name of the user.',
    example: 'Doe',
  })
  @IsString()
  @IsNotEmpty()
  @IsString()
  public lastName: string;
}
