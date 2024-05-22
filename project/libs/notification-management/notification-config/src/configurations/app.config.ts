import { ConfigType, registerAs } from '@nestjs/config';
import { plainToClass } from 'class-transformer';
import { ApplicationConfiguration } from './app/app.env';

export interface AppConfig {
  environment: string;
  port: number;
  defaultPostCountLimit: number;
  httpClientMaxRedirects: number;
  httpClientTimeout: number;
  serviceUrlSearch: string;
}

async function getAppConfig(): Promise<ApplicationConfiguration> {
  const config = plainToClass(ApplicationConfiguration, {
    environment: process.env.APP_ENVIRONMENT,
    port: parseInt(process.env.APP_PORT, 10),
    defaultPostCountLimit: parseInt(process.env.APP_DEFAULT_POST_COUNT_LIMIT, 10),
    httpClientMaxRedirects: parseInt(process.env.APP_HTTP_CLIENT_MAX_REDIRECTS, 10),
    httpClientTimeout: parseInt(process.env.APP_HTTP_CLIENT_TIMEOUT, 10),
    serviceUrlSearch: process.env.APP_SERVICE_URL_SEARCH,
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
