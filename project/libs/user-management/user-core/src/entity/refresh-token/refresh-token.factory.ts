import { Injectable } from '@nestjs/common';
import { EntityFactory, JwtToken } from '@project/shared-core';
import { RefreshTokenEntity } from './refresh-token.entity';

@Injectable()
export class RefreshTokenFactory implements EntityFactory<RefreshTokenEntity> {
  public create(entityPlainData: JwtToken): RefreshTokenEntity {
    return new RefreshTokenEntity(entityPlainData)
  }
}
