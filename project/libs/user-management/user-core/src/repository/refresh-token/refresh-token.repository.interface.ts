import { Repository } from '@project/data-access';
import { RefreshTokenEntity } from '../../entity/refresh-token/refresh-token.entity';

export interface RefreshTokenRepository extends Repository<RefreshTokenEntity> {
  deleteExpiredTokens(): Promise<boolean>;

  deleteByTokenId(tokenId: string): Promise<RefreshTokenEntity>;

  findByTokenId(tokenId: string): Promise<RefreshTokenEntity | null>;
}
