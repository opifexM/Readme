import { Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { RefreshTokenPayload } from '@project/shared-core';
import { JwtConfig } from '@project/user-config';
import { UserEntity } from '@project/user-core';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthenticationService } from '../authentication-module/authentication.service';
import { TokenNotExistsException } from '../exceptions/token-not-exists.exception';
import { RefreshTokenService } from '../refresh-token-module/refresh-token.service';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  private readonly logger = new Logger(JwtRefreshStrategy.name);

  constructor(
    @Inject(JwtConfig.KEY) private readonly jwtOptions: ConfigType<typeof JwtConfig>,
    private readonly authService: AuthenticationService,
    private readonly refreshTokenService: RefreshTokenService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: jwtOptions.refreshTokenSecret,
    });
  }

  public async validate(payload: RefreshTokenPayload): Promise<UserEntity> {
    this.logger.log(`Validating JWT refresh token for user with email: ${payload.email}`);
    if (!await this.refreshTokenService.isExists(payload.tokenId)) {
      this.logger.warn(`Token ID '${payload.tokenId}' does not exist.`);
      throw new TokenNotExistsException(payload.tokenId);
    }

    this.logger.log(`Deleting refresh session for token ID: ${payload.tokenId}`);
    await this.refreshTokenService.deleteRefreshSession(payload.tokenId);

    this.logger.log(`Deleting expired refresh tokens`);
    await this.refreshTokenService.deleteExpiredRefreshTokens();

    return this.authService.getUserByEmail(payload.email);
  }
}
