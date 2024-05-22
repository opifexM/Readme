import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { BaseMongoRepository } from '@project/data-access';
import { Model } from 'mongoose';
import { UserEntity } from '../../entity/user/user.entity';
import { UserFactory } from '../../entity/user/user.factory';
import { UserModel } from '../../entity/user/user.model';
import { UserRepository } from './user.repository.interface';

@Injectable()
export class UserMongodbRepository extends BaseMongoRepository<UserEntity, UserModel> implements UserRepository {
  private readonly logger = new Logger(UserMongodbRepository.name);

  constructor(
    entityFactory: UserFactory,
    @InjectModel(UserModel.name) userModel: Model<UserModel>
  ) {
    super(entityFactory, userModel);
  }

  public async findByEmail(email: string): Promise<UserEntity | null> {
    this.logger.log(`Searching for user by email: ${email}`);
    const foundDocument = await this.model.findOne({ email: email });

    return this.createEntityFromDocument(foundDocument);
  }

  public async containsSubscription(userId: string, subscriptionId: string): Promise<boolean> {
    this.logger.log(`Checking subscription presence for user ID: '${userId}' with subscription ID: '${subscriptionId}'`);
    const user = await this.model.findById(userId);
    if (!user) {
      this.logger.warn(`User not found with ID: '${userId}'`);
      return false;
    }

    return user.subscriptionIds.some(id => id.equals(subscriptionId));
  }

  public async addSubscription(userId: string, subscriptionId: string): Promise<UserEntity> {
    this.logger.log(`Adding subscription '${subscriptionId}' to user '${userId}'`);
    const updatedUser = await this.model.findByIdAndUpdate(userId,
      {
        $addToSet: { subscriptionIds: subscriptionId }
      },
      { new: true });

    return this.createEntityFromDocument(updatedUser);
  }

  public async removeSubscription(userId: string, subscriptionId: string): Promise<UserEntity> {
    this.logger.log(`Removing subscription '${subscriptionId}' from user '${userId}'`);
    const updatedUser = await this.model.findByIdAndUpdate(userId,
      {
        $pull: { subscriptionIds: subscriptionId }
      },
      { new: true });

    return this.createEntityFromDocument(updatedUser);
  }

  public async incrementFollowerCount(userId: string): Promise<boolean> {
    this.logger.log(`Incrementing follower count for user ID: '${userId}'`);
    const updatedUser = await this.model.findByIdAndUpdate(userId,
      {
        $inc: { followerCount: 1 }
      }
    );

    return updatedUser !== null;
  }

  public async decrementFollowerCount(userId: string): Promise<boolean> {
    this.logger.log(`Decrementing follower count for user ID: '${userId}'`);
    const updatedUser = await this.model.findByIdAndUpdate(userId,
      {
        $inc: { followerCount: -1 }
      }
    );

    return updatedUser !== null;
  }

  public async incrementPostCount(userId: string): Promise<boolean> {
    this.logger.log(`Incrementing post count for user ID: '${userId}'`);
    const updatedUser = await this.model.findByIdAndUpdate(userId,
      {
        $inc: { postCount: 1 }
      }
    );

    return updatedUser !== null;
  }

  public async decrementPostCount(userId: string): Promise<boolean> {
    this.logger.log(`Decrementing post count for user ID: '${userId}'`);
    const updatedUser = await this.model.findByIdAndUpdate(userId,
      {
        $inc: { postCount: -1 }
      }
    );

    return updatedUser !== null;
  }
}
