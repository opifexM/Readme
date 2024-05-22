import { IsString, validateOrReject } from 'class-validator';
import { JWTConfig } from '../jwt.config';

export class JwtConfiguration implements JWTConfig {
  @IsString()
  accessTokenSecret: string;

  @IsString()
  accessTokenExpiresIn: string;

  @IsString()
  refreshTokenSecret: string;

  @IsString()
  refreshTokenExpiresIn: string;

  public async validate(): Promise<void> {
    await validateOrReject(this);
  }
}
