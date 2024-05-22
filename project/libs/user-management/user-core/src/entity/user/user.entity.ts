import { AuthUser, Entity, StorableEntity, UserNotificationType, UserType } from '@project/shared-core';

export class UserEntity extends Entity implements StorableEntity<AuthUser> {
  public email: string;
  public firstName: string;
  public lastName: string;
  public dateOfBirth: Date;
  public userType: UserType;
  public passwordHash: string;
  public avatarId: string;
  public registeredAt: Date;
  public subscriptionIds: string[];
  public followerCount: number;
  public postCount: number;
  public notificationType: UserNotificationType;

  constructor(user?: AuthUser) {
    super();
    this.fillUserData(user);
  }

  public fillUserData(user?: AuthUser): void {
    if (!user) {
      return;
    }

    this.id = user.id ?? '';
    this.email = user.email;
    this.firstName = user.firstName;
    this.lastName = user.lastName;
    this.dateOfBirth = user.dateOfBirth ?? new Date(0);
    this.userType = user.userType ?? UserType.USER;
    this.passwordHash = user.passwordHash;
    this.avatarId = user.avatarId;
    this.registeredAt = user.registeredAt ?? new Date();
    this.subscriptionIds = user.subscriptionIds ?? [];
    this.followerCount = user.followerCount ?? 0;
    this.postCount = user.postCount ?? 0;
    this.notificationType = user.notificationType ?? UserNotificationType.EMAIL;
  }

  public toPOJO() {
    return {
      id: this.id,
      email: this.email,
      firstName: this.firstName,
      lastName: this.lastName,
      dateOfBirth: this.dateOfBirth,
      userType: this.userType,
      passwordHash: this.passwordHash,
      avatarId: this.avatarId,
      registeredAt: this.registeredAt,
      subscriptionIds: this.subscriptionIds.map(id => id.toString()),
      followerCount: this.followerCount,
      postCount: this.postCount,
      notificationType: this.notificationType
    };
  }
}
