import { ConfigType, registerAs } from '@nestjs/config';
import { plainToClass } from 'class-transformer';
import { EmailConfiguration } from './email/email.env';

export interface EmailConfig {
  host: string;
  port: number;
  user: string;
  password: string;
  from: string;
}

async function getAppConfig(): Promise<EmailConfiguration> {
  const config = plainToClass(EmailConfiguration, {
    host: process.env.EMAIL_SMTP_HOST,
    port: parseInt(process.env.EMAIL_SMTP_PORT, 10),
    user: process.env.EMAIL_USER_NAME,
    password: process.env.EMAIL_USER_PASSWORD,
    from: process.env.EMAIL_FROM,
  });

  try {
    await config.validate();
  } catch (error) {
    console.error('Configuration validation error:', error);
    throw error;
  }

  return config;
}

export default registerAs('email', async (): Promise<ConfigType<typeof getAppConfig>> => {
  return getAppConfig();
});
