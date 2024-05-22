import { ConfigType, registerAs } from '@nestjs/config';
import { plainToClass } from 'class-transformer';
import { ApplicationConfiguration } from './app/app.env';

export interface AppConfig {
  environment: string;
  port: number;
  httpClientMaxRedirects: number;
  httpClientTimeout: number;
  serviceUrlUser: string;
  serviceUrlAuth: string;
  serviceUrlComment: string;
  serviceUrlPost: string;
  serviceUrlPostLink: string;
  serviceUrlPostPhoto: string;
  serviceUrlPostQuote: string;
  serviceUrlPostText: string;
  serviceUrlPostVideo: string;
  serviceUrlSearch: string;
  serviceUrlFiles: string;
  serviceUrlNotificationNewPost: string;
}

async function getAppConfig(): Promise<ApplicationConfiguration> {
  const config = plainToClass(ApplicationConfiguration, {
    environment: process.env.APP_ENVIRONMENT,
    port: parseInt(process.env.APP_PORT, 10),
    httpClientMaxRedirects: parseInt(process.env.APP_HTTP_CLIENT_MAX_REDIRECTS, 10),
    httpClientTimeout: parseInt(process.env.APP_HTTP_CLIENT_TIMEOUT, 10),
    serviceUrlUser: process.env.APP_SERVICE_URL_USER,
    serviceUrlAuth: process.env.APP_SERVICE_URL_AUTH,
    serviceUrlComment: process.env.APP_SERVICE_URL_COMMENT,
    serviceUrlPost: process.env.APP_SERVICE_URL_POST,
    serviceUrlPostLink: process.env.APP_SERVICE_URL_POST_LINK,
    serviceUrlPostPhoto: process.env.APP_SERVICE_URL_POST_PHOTO,
    serviceUrlPostQuote: process.env.APP_SERVICE_URL_POST_QUOTE,
    serviceUrlPostText: process.env.APP_SERVICE_URL_POST_TEXT,
    serviceUrlPostVideo: process.env.APP_SERVICE_URL_POST_VIDEO,
    serviceUrlSearch: process.env.APP_SERVICE_URL_SEARCH,
    serviceUrlFiles: process.env.APP_SERVICE_URL_FILES,
    serviceUrlNotificationNewPost: process.env.APP_SERVICE_URL_NOTIFICATION_NEW_POST,
  });

  try {
    await config.validate();
  } catch (error) {
    console.error('Configuration validation error:', error);
    throw error;
  }

  return config;
}

export default registerAs('application', async (): Promise<ConfigType<typeof getAppConfig>> => {
  return getAppConfig();
});
