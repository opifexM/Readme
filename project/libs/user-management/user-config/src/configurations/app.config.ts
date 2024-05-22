import { ConfigType, registerAs } from '@nestjs/config';
import { plainToClass } from 'class-transformer';
import { ApplicationConfiguration } from './app/app.env';

export interface AppConfig {
  environment: string;
  port: number;
  passwordSaltRounds: number;
  userDefaultAvatar: string;
}

async function getAppConfig(): Promise<ApplicationConfiguration> {
  const config = plainToClass(ApplicationConfiguration, {
    environment: process.env.APP_ENVIRONMENT,
    port: parseInt(process.env.APP_PORT, 10),
    passwordSaltRounds: parseInt(process.env.APP_PASSWORD_SALT_ROUNDS, 10),
    userDefaultAvatar: process.env.APP_USER_DEFAULT_AVATAR,
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
