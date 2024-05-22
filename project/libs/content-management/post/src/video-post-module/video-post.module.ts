import { Module } from '@nestjs/common';
import { ContentCoreModule } from '@project/content-core';
import { PostModule } from '../post-module/post.module';
import { VideoPostController } from './video-post.controller';
import { VideoPostService } from './video-post.service';

@Module({
  imports: [ContentCoreModule, PostModule],
  controllers: [VideoPostController],
  providers: [VideoPostService],
  exports: [VideoPostService]
})
export class VideoPostModule {}
