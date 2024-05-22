import { Module } from '@nestjs/common';
import { ContentCoreModule } from '@project/content-core';
import { PostModule } from '../post-module/post.module';
import { PhotoPostController } from './photo-post.controller';
import { PhotoPostService } from './photo-post.service';

@Module({
  imports: [ContentCoreModule, PostModule],
  controllers: [PhotoPostController],
  providers: [PhotoPostService],
  exports: [PhotoPostService]
})
export class PhotoPostModule {}
