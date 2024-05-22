import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import appConfig from './configurations/app.config';
import mongoConfig from './configurations/mongodb.config';

const ENV_FILE_MANAGEMENT_FILE_PATH = 'apps/file-management/file-app.env';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      load: [appConfig, mongoConfig],
      envFilePath: ENV_FILE_MANAGEMENT_FILE_PATH
    }),
  ]
})
export class FileConfigModule {}
