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

  @IsString()
  serveRoot: string;

  @IsString()
  uploadDirectoryPath: string;

  public async validate(): Promise<void> {
    await validateOrReject(this);
  }
}
