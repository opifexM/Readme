import { IsIn, IsNumber, IsString, Max, Min, validateOrReject } from 'class-validator';
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
  httpClientMaxRedirects: number;

  @IsNumber()
  httpClientTimeout: number;

  @IsString()
  serviceUrlAuth: string;

  @IsString()
  serviceUrlComment: string;

  @IsString()
  serviceUrlFiles: string;

  @IsString()
  serviceUrlNotificationNewPost: string;

  @IsString()
  serviceUrlPost: string;

  @IsString()
  serviceUrlPostLink: string;

  @IsString()
  serviceUrlPostPhoto: string;

  @IsString()
  serviceUrlPostQuote: string;

  @IsString()
  serviceUrlPostText: string;

  @IsString()
  serviceUrlPostVideo: string;

  @IsString()
  serviceUrlSearch: string;

  @IsString()
  serviceUrlUser: string;

  public async validate(): Promise<void> {
    await validateOrReject(this);
  }
}
