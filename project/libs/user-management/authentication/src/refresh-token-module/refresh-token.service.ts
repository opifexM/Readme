import { Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { RefreshTokenPayload } from '@project/shared-core';
import { parseTime } from '@project/shared-helpers';
import { JwtConfig } from '@project/user-config';
import { RefreshTokenEntity, RefreshTokenRepository } from '@project/user-core';
import dayjs from 'dayjs';

@Injectable()
export class RefreshTokenService {
  private readonly logger = new Logger(RefreshTokenService.name);

  constructor(
    @Inject('RefreshTokenRepository') private readonly refreshTokenRepository: RefreshTokenRepository,
    @Inject(JwtConfig.KEY) private readonly jwtConfig: ConfigType<typeof JwtConfig>
  ) {}

  public async createRefreshSession(payload: RefreshTokenPayload): Promise<RefreshTokenEntity> {
    this.logger.log(`Creating refresh session for user ID: '${payload.sub}'`);
    const timeValue = parseTime(this.jwtConfig.refreshTokenExpiresIn);
    const refreshToken = new RefreshTokenEntity({
      tokenId: payload.tokenId,
      createdAt: new Date(),
      userId: payload.sub,
      expiresIn: dayjs().add(timeValue.value, timeValue.unit).toDate()
    });

    const savedToken = await this.refreshTokenRepository.save(refreshToken);
    this.logger.log(`Refresh session created with token ID: '${savedToken.tokenId}'`);

    return savedToken;
  }

  public async deleteRefreshSession(tokenId: string): Promise<RefreshTokenEntity> {
    this.logger.log(`Attempting to delete refresh session with token ID: '${tokenId}'`);

    const deletedToken = await this.refreshTokenRepository.deleteByTokenId(tokenId);
    this.logger.log(`Refresh session deleted with token ID: '${tokenId}'`);

    return deletedToken;
  }

  public async isExists(tokenId: string): Promise<boolean> {
    const foundToken = await this.refreshTokenRepository.findByTokenId(tokenId);

    return !!foundToken;
  }

  public async deleteExpiredRefreshTokens(): Promise<boolean> {
    this.logger.log('Attempting to delete expired refresh tokens');

    const isExpiredTokensDeleted = await this.refreshTokenRepository.deleteExpiredTokens();
    if (!isExpiredTokensDeleted) {
      this.logger.error('Failed to delete expired refresh tokens');
    }

    return isExpiredTokensDeleted;
  }
}
