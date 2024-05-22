import { ConfigType, registerAs } from '@nestjs/config';
import { plainToClass } from 'class-transformer';
import { RabbitConfiguration } from './rabbit/rabbit.env';

export interface RabbitConfig {
  host: string;
  password: string;
  user: string;
  queue: string;
  exchange: string;
  port: number;
}

async function getAppConfig(): Promise<RabbitConfiguration> {
  const config = plainToClass(RabbitConfiguration, {
    host: process.env.RABBITMQ_HOST,
    password: process.env.RABBITMQ_PASSWORD,
    user: process.env.RABBITMQ_USER,
    queue: process.env.RABBITMQ_QUEUE,
    exchange: process.env.RABBITMQ_EXCHANGE,
    port: parseInt(process.env.RABBITMQ_PORT, 10),
  });

  try {
    await config.validate();
  } catch (error) {
    console.error('Configuration validation error:', error);
    throw error;
  }

  return config;
}

export default registerAs('rabbit', async (): Promise<ConfigType<typeof getAppConfig>> => {
  return getAppConfig();
});
