import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { ApplicationConfig } from '@project/content-config';
import { ContentCoreModule } from '@project/content-core';
import { PostController } from './post.controller';
import { PostService } from './post.service';

@Module({
  imports: [
    ContentCoreModule,
    HttpModule.registerAsync({
      useFactory: (applicationConfig: ConfigType<typeof ApplicationConfig>) => ({
        timeout: applicationConfig.httpClientTimeout,
        maxRedirects: applicationConfig.httpClientMaxRedirects,
      }),
      inject: [ApplicationConfig.KEY]
    }),
  ],
  controllers: [PostController],
  providers: [PostService],
  exports: [PostService]
})
export class PostModule {
}
