import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import appConfig from './configurations/app.config';

const ENV_CONTENT_MANAGEMENT_FILE_PATH = 'apps/content-management/content-app.env';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      load: [appConfig],
      envFilePath: ENV_CONTENT_MANAGEMENT_FILE_PATH
    }),
  ]
})
export class ContentConfigModule {}
