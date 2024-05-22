import { IsIn, IsNumber, IsPositive, IsString, Max, Min, validateOrReject } from 'class-validator';
import { AppConfig } from '../app.config';

const USER_APP_MIN_PORT = 0;
const USER_APP_MAX_PORT = 65535;
const ENVIRONMENTS = ['development', 'production', 'stage'] as const;

export class ApplicationConfiguration implements AppConfig {
  @IsString()
  @IsIn(ENVIRONMENTS)
  environment: string;

  @IsNumber()
  @Min(USER_APP_MIN_PORT)
  @Max(USER_APP_MAX_PORT)
  port: number;

  @IsNumber()
  @IsPositive()
  defaultPostCountLimit: number;

  @IsNumber()
  @IsPositive()
  defaultPostPersonalFeedCountLimit: number;

  @IsNumber()
  @IsPositive()
  defaultCommentCountLimit: number;

  @IsString()
  serviceUrlUser: string;

  @IsNumber()
  httpClientMaxRedirects: number;

  @IsNumber()
  httpClientTimeout: number;

  public async validate(): Promise<void> {
    await validateOrReject(this);
  }
}
