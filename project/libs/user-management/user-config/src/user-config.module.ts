import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import appConfig from './configurations/app.config';
import jwtConfig from './configurations/jwt.config';
import mongoConfig from './configurations/mongodb.config';
import RabbitConfig from './configurations/rabbit.config';

const ENV_USER_MANAGEMENT_FILE_PATH = 'apps/user-management/user-app.env';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      load: [appConfig, mongoConfig, jwtConfig, RabbitConfig],
      envFilePath: ENV_USER_MANAGEMENT_FILE_PATH
    }),
  ]
})
export class UserConfigModule {}
