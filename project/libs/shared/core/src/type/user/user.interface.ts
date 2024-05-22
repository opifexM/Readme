import { UserNotificationType } from './notification-type.enum';
import { UserType } from './user-type.enum';

export interface User {
  id?: string;
  email: string;
  firstName: string;
  lastName: string;
  dateOfBirth?: Date;
  userType?: UserType;
  avatarId?: string;
  registeredAt?: Date;
  subscriptionIds?: string[];
  followerCount?: number;
  postCount?: number;
  notificationType?: UserNotificationType;
}
