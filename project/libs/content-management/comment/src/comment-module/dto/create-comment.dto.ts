import { ApiProperty } from '@nestjs/swagger';
import { COMMENT } from '@project/content-core';
import { IsString, Length } from 'class-validator';

export class CreateCommentDto {
  @ApiProperty({
    description: 'The text content of the comment.',
    example: 'This is a comment.',
  })
  @IsString()
  @Length(COMMENT.TEXT.MIN, COMMENT.TEXT.MAX)
  public text: string;
}
