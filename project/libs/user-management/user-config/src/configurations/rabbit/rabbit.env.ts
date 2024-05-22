import { IsNumber, IsString, Max, Min, validateOrReject } from 'class-validator';
import { RabbitConfig } from '../rabbit.config';

const USER_APP_MIN_PORT = 0;
const USER_APP_MAX_PORT = 65535;

export class RabbitConfiguration implements RabbitConfig {
  @IsString()
  host: string;

  @IsString()
  password: string;

  @IsString()
  user: string;

  @IsString()
  queue: string;

  @IsString()
  exchange: string;

  @IsNumber()
  @Min(USER_APP_MIN_PORT)
  @Max(USER_APP_MAX_PORT)
  port: number;

  public async validate(): Promise<void> {
    await validateOrReject(this);
  }
}
