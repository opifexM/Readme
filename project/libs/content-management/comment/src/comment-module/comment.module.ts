import { Module } from '@nestjs/common';
import { ContentCoreModule } from '@project/content-core';
import { PostModule } from '@project/post';
import { CommentController } from './comment.controller';
import { CommentService } from './comment.service';

@Module({
  imports: [ContentCoreModule, PostModule],
  controllers: [CommentController],
  providers: [CommentService]
})
export class CommentModule {}
