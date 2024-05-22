import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { ApplicationConfig } from '@project/content-config';
import { ContentCoreModule } from '@project/content-core';
import { SearchController } from './search.controller';
import { SearchService } from './search.service';

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
  controllers: [SearchController],
  providers: [SearchService],
  exports: [SearchService]
})
export class SearchModule {}
