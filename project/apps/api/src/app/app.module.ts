import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { ApiConfigModule, ApplicationConfig } from '@project/api-config';
import { ApiAuthenticationController } from './controller/api-authentication.controller';
import { ApiCommentController } from './controller/api-comment.controller';
import { ApiEmailSubscriberController } from './controller/api-email-subscriber.controller';
import { ApiFileUploaderController } from './controller/api-file-uploader.controller';
import { ApiLinkPostController } from './controller/api-link-post.controller';
import { ApiPhotoPostController } from './controller/api-photo-post.controller';
import { ApiPostController } from './controller/api-post.controller';
import { ApiQuotePostController } from './controller/api-quote-post.controller';
import { ApiSearchController } from './controller/api-search.controller';
import { ApiTextPostController } from './controller/api-text-post.controller';
import { ApiUserController } from './controller/api-user.controller';
import { ApiVideoPostController } from './controller/api-video-post.controller';
import { CheckAuthGuard } from './guard/check-auth.guard';

@Module({
  imports: [
    ApiConfigModule,
    HttpModule.registerAsync({
      useFactory: (applicationConfig: ConfigType<typeof ApplicationConfig>) => ({
        timeout: applicationConfig.httpClientTimeout,
        maxRedirects: applicationConfig.httpClientMaxRedirects,
      }),
      inject: [ApplicationConfig.KEY]
    }),
  ],
  controllers: [
    ApiAuthenticationController,
    ApiUserController,
    ApiCommentController,
    ApiPostController,
    ApiLinkPostController,
    ApiPhotoPostController,
    ApiQuotePostController,
    ApiTextPostController,
    ApiVideoPostController,
    ApiSearchController,
    ApiEmailSubscriberController,
    ApiFileUploaderController
  ],
  providers: [CheckAuthGuard],
})
export class AppModule {}
