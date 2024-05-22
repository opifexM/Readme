import { Repository } from '@project/data-access';
import { UserEntity } from '../../entity/user/user.entity';

export interface UserRepository extends Repository<UserEntity> {
  findByEmail(email: string): Promise<UserEntity | null>;

  containsSubscription(userId: string, subscriptionId: string): Promise<boolean>;

  addSubscription(userId: string, subscriptionId: string): Promise<UserEntity>;

  removeSubscription(userId: string, subscriptionId: string): Promise<UserEntity>;

  incrementFollowerCount(userId: string): Promise<boolean>;

  decrementFollowerCount(userId: string): Promise<boolean>;

  incrementPostCount(userId: string): Promise<boolean>;

  decrementPostCount(userId: string): Promise<boolean>;
}
