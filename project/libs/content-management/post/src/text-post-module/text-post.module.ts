import { Module } from '@nestjs/common';
import { ContentCoreModule } from '@project/content-core';
import { PostModule } from '../post-module/post.module';
import { TextPostController } from './text-post.controller';
import { TextPostService } from './text-post.service';

@Module({
  imports: [ContentCoreModule, PostModule],
  controllers: [TextPostController],
  providers: [TextPostService],
  exports: [TextPostService]
})
export class TextPostModule {}
