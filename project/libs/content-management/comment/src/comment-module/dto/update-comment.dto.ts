import { ApiProperty } from '@nestjs/swagger';
import { COMMENT } from '@project/content-core';
import { IsString, Length } from 'class-validator';

export class UpdateCommentDto {
  @ApiProperty({
    description: 'The updated text content of the comment.',
    example: 'This is an updated comment.',
  })
  @IsString()
  @Length(COMMENT.TEXT.MIN, COMMENT.TEXT.MAX)
  public text: string;
}
