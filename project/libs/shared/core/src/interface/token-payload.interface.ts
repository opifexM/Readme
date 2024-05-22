import { UserType } from '@project/shared-core';

export interface TokenPayload {
  sub: string;
  email: string;
  userType: UserType;
  firstName: string;
  lastName: string;
}
