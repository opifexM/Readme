import { Entity, JwtToken, StorableEntity } from '@project/shared-core';

export class RefreshTokenEntity extends Entity implements StorableEntity<JwtToken> {
  public tokenId: string;
  public createdAt: Date;
  public userId: string;
  public expiresIn: Date;

  constructor(token?: JwtToken) {
    super();
    this.fillTokenData(token);
  }

  public fillTokenData(token?: JwtToken): void {
    if (!token) {
      return;
    }

    this.id = token.id ?? '';
    this.createdAt = token.createdAt ?? new Date();
    this.expiresIn = token.expiresIn ?? new Date();
    this.userId = token.userId;
    this.tokenId = token.tokenId;
  }

  public toPOJO() {
    return {
      id: this.id,
      createdAt: this.createdAt,
      expiresIn: this.expiresIn,
      userId: this.userId,
      tokenId: this.tokenId,
    };
  }
}
