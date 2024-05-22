import { UserEntity } from '@project/user-core';

export interface RequestWithUser {
  user?: UserEntity;
}
