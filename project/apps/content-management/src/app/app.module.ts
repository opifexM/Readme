import { Module } from '@nestjs/common';
import { CommentModule } from '@project/comment';
import { ContentConfigModule } from '@project/content-config';
import {
  LinkPostModule,
  PhotoPostModule,
  PostModule,
  QuotePostModule,
  TextPostModule,
  VideoPostModule
} from '@project/post';
import { SearchModule } from '@project/search';

@Module({
  imports: [
    PostModule,
    LinkPostModule,
    PhotoPostModule,
    QuotePostModule,
    TextPostModule,
    VideoPostModule,
    CommentModule,
    SearchModule,
    ContentConfigModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
