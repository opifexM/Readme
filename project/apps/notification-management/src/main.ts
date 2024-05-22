import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ApplicationConfig } from '@project/notification-config';

import { AppModule } from './app/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);

  const config = new DocumentBuilder()
    .setTitle('Notification Management service')
    .setDescription('Notification Management API')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('spec', app, document);

  app.useGlobalPipes(new ValidationPipe({
    transform: true,
  }));

  const appConfiguration = app.get<ConfigType<typeof ApplicationConfig>>(ApplicationConfig.KEY);

  await app.listen(appConfiguration.port);
  Logger.log(
    `🚀 Application is running on: http://localhost:${appConfiguration.port}/${globalPrefix}`,
  );
}

bootstrap();
