import { Module } from '@nestjs/common';
import { ContentCoreModule } from '@project/content-core';
import { PostModule } from '../post-module/post.module';
import { QuotePostController } from './quote-post.controller';
import { QuotePostService } from './quote-post.service';

@Module({
  imports: [ContentCoreModule, PostModule],
  controllers: [QuotePostController],
  providers: [QuotePostService],
  exports: [QuotePostService]
})
export class QuotePostModule {}
