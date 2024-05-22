import { IsNumber, IsString, Max, Min, validateOrReject } from 'class-validator';
import { EmailConfig } from '../email.config';

const USER_APP_MIN_PORT = 0;
const USER_APP_MAX_PORT = 65535;

export class EmailConfiguration implements EmailConfig {
  @IsString()
  host: string;

  @IsString()
  password: string;

  @IsString()
  user: string;

  @IsNumber()
  @Min(USER_APP_MIN_PORT)
  @Max(USER_APP_MAX_PORT)
  port: number;

  @IsString()
  from: string;

  public async validate(): Promise<void> {
    await validateOrReject(this);
  }
}
