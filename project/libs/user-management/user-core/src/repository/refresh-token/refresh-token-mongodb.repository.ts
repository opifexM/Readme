import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { BaseMongoRepository } from '@project/data-access';
import { Model } from 'mongoose';
import { RefreshTokenEntity } from '../../entity/refresh-token/refresh-token.entity';
import { RefreshTokenFactory } from '../../entity/refresh-token/refresh-token.factory';
import { RefreshTokenModel } from '../../entity/refresh-token/refresh-token.model';
import { RefreshTokenRepository } from './refresh-token.repository.interface';

@Injectable()
export class RefreshTokenMongodbRepository extends BaseMongoRepository<RefreshTokenEntity, RefreshTokenModel> implements RefreshTokenRepository {
  private readonly logger = new Logger(RefreshTokenMongodbRepository.name);

  constructor(
    entityFactory: RefreshTokenFactory,
    @InjectModel(RefreshTokenModel.name) refreshTokenModel: Model<RefreshTokenModel>
  ) {
    super(entityFactory, refreshTokenModel);
  }

  public async deleteExpiredTokens(): Promise<boolean> {
    this.logger.log('Attempting to delete expired refresh tokens');
    const result = await this.model.deleteMany({ expiresIn: { $lt: new Date() } });

    return !!result;
  }

  public async deleteByTokenId(tokenId: string): Promise<RefreshTokenEntity> {
    this.logger.log(`Attempting to delete refresh token with ID: '${tokenId}'`);
    const deletedToken = await this.model.findOneAndDelete({ tokenId: tokenId });
    if (!deletedToken) {
      this.logger.warn(`Token with ID ${tokenId} not found for deletion.`);
      throw new NotFoundException(`Token with id '${tokenId}' not found.`);
    }

    this.logger.log(`Successfully deleted token with ID: '${tokenId}'`);
    return this.createEntityFromDocument(deletedToken);
  }

  public async findByTokenId(tokenId: string): Promise<RefreshTokenEntity | null> {
    this.logger.log(`Searching for token with ID: '${tokenId}'`);
    const foundToken = await this.model.findOne({ tokenId: tokenId });

    return this.createEntityFromDocument(foundToken);
  }
}
