import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length } from 'class-validator';
import { COMMENT } from '../constant/comment.constant';

export class CreateCommentDto {
  @ApiProperty({
    description: 'The text content of the comment.',
    example: 'This is a comment.',
  })
  @IsString()
  @Length(COMMENT.TEXT.MIN, COMMENT.TEXT.MAX)
  public text: string;
}
