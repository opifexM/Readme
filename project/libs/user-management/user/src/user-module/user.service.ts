import { BadRequestException, ConflictException, Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { AuthenticationService } from '@project/authentication';
import { ApplicationConfig } from '@project/user-config';
import { UserEntity, UserRepository } from '@project/user-core';
import { NotifyService } from '@project/user-notify';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import {
  SUBSCRIBE_USER_ALREADY_ADDED,
  SUBSCRIBE_USER_ALREADY_REMOVED,
  SUBSCRIBE_USER_NOT_FOUND,
  SUBSCRIBE_USER_YOURSELF,
  USER_EXISTS,
  USER_NOT_FOUND
} from './user.constant';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(
    @Inject('UserRepository') private readonly userRepository: UserRepository,
    private readonly authenticationService: AuthenticationService,
    @Inject(ApplicationConfig.KEY) private readonly applicationConfig: ConfigType<typeof ApplicationConfig>,
    private readonly notifyService: NotifyService
  ) {
  }

  public async createUser(dto: CreateUserDto): Promise<UserEntity> {
    this.logger.log(`Attempting to create user with email: ${dto.email}`);
    const existUser = await this.userRepository.findByEmail(dto.email);
    if (existUser) {
      this.logger.warn(`User already exists with email: ${dto.email}`);
      throw new ConflictException(USER_EXISTS);
    }

    const hashedPassword = await this.authenticationService.hashPassword(dto.password);
    const userData = {
      email: dto.email,
      firstName: dto.firstName,
      lastName: dto.lastName,
      avatarId: dto.avatarId ?? this.applicationConfig.userDefaultAvatar,
      passwordHash: hashedPassword
    };

    const userEntity = new UserEntity(userData);
    const createdUser = await this.userRepository.save(userEntity);
    this.logger.log(`User created with ID: '${createdUser.id}'`);

    await this.notifyService.publishSubscriberRegistration({
      email: createdUser.email,
      firstName: createdUser.firstName,
      lastName: createdUser.lastName
    });

    return createdUser;
  }

  public async findUserById(userId: string): Promise<UserEntity> {
    this.logger.log(`Looking for user with ID: '${userId}'`);
    const foundUser = await this.userRepository.findById(userId);
    if (!foundUser) {
      this.logger.warn(`User not found with ID: '${userId}'`);
      throw new NotFoundException(USER_NOT_FOUND);
    }

    return foundUser;
  }

  public async exists(userId: string): Promise<boolean> {
    return this.userRepository.exists(userId);
  }

  public async updateUserById(userId: string, dto: UpdateUserDto): Promise<UserEntity> {
    this.logger.log(`Updating user with ID: '${userId}'`);
    const updatedUser = await this.findUserById(userId);

    if (dto.firstName !== undefined) updatedUser.firstName = dto.firstName;
    if (dto.dateOfBirth !== undefined) updatedUser.dateOfBirth = dto.dateOfBirth;
    if (dto.lastName !== undefined) updatedUser.lastName = dto.lastName;
    if (dto.avatarId !== undefined) updatedUser.avatarId = dto.avatarId;

    return this.userRepository.update(userId, updatedUser);
  }

  public async subscribeUserById(userId: string, subscribeUserId: string): Promise<UserEntity> {
    this.logger.log(`Subscribing user '${userId}' to user '${subscribeUserId}'`);
    if (!await this.exists(userId)) {
      this.logger.warn(`User not found with ID: '${userId}'`);
      throw new NotFoundException(SUBSCRIBE_USER_NOT_FOUND);
    }

    if (await this.userRepository.containsSubscription(userId, subscribeUserId)) {
      this.logger.warn(`User '${userId}' already subscribed to '${subscribeUserId}'`);
      throw new ConflictException(SUBSCRIBE_USER_ALREADY_ADDED);
    }

    if (userId === subscribeUserId) {
      this.logger.warn('Attempt to subscribe to oneself');
      throw new BadRequestException(SUBSCRIBE_USER_YOURSELF);
    }

    const userEntityUpdated = await this.userRepository.addSubscription(userId, subscribeUserId);
    await this.incrementFollowerCount(subscribeUserId);
    this.logger.log(`User ${userId} subscribed to ${subscribeUserId}`);

    return userEntityUpdated;
  }

  public async unsubscribeUserById(userId: string, unsubscribeUserId: string): Promise<UserEntity> {
    this.logger.log(`Unsubscribing user '${userId}' from user '${unsubscribeUserId}'`);
    if (!await this.exists(userId)) {
      this.logger.warn(`User not found with ID: '${userId}'`);
      throw new NotFoundException(SUBSCRIBE_USER_NOT_FOUND);
    }

    if (!await this.userRepository.containsSubscription(userId, unsubscribeUserId)) {
      this.logger.warn(`Subscription not found between user '${userId}' and '${unsubscribeUserId}'`);
      throw new ConflictException(SUBSCRIBE_USER_ALREADY_REMOVED);
    }

    const userEntityUpdated = await this.userRepository.removeSubscription(userId, unsubscribeUserId);
    await this.decrementFollowerCount(unsubscribeUserId);

    return userEntityUpdated;
  }

  public async incrementFollowerCount(userId: string): Promise<boolean> {
    this.logger.log(`Attempting to increment follower count for user ID: '${userId}'`);
    const isFollowerCountUpdated = await this.userRepository.incrementFollowerCount(userId);
    if (!isFollowerCountUpdated) {
      this.logger.error(`Failed to increment 'followerCount' for User ID '${userId}'`);
    }

    return isFollowerCountUpdated;
  }

  public async decrementFollowerCount(userId: string): Promise<boolean> {
    this.logger.log(`Attempting to decrement follower count for user ID: '${userId}'`);
    const isFollowerCountUpdated = await this.userRepository.decrementFollowerCount(userId);
    if (!isFollowerCountUpdated) {
      this.logger.error(`Failed to decrement 'followerCount' for User ID '${userId}'`);
    }

    return isFollowerCountUpdated;
  }

  public async incrementPostCount(userId: string): Promise<boolean> {
    this.logger.log(`Attempting to increment post count for user ID: '${userId}'`);
    const isPostCountUpdated = await this.userRepository.incrementPostCount(userId);
    if (!isPostCountUpdated) {
      this.logger.error(`Failed to increment 'PostCount' for User ID '${userId}'`);
    }

    return isPostCountUpdated;
  }

  public async decrementPostCount(userId: string): Promise<boolean> {
    this.logger.log(`Attempting to decrement post count for user ID: '${userId}'`);
    const isPostCountUpdated = await this.userRepository.decrementPostCount(userId);
    if (!isPostCountUpdated) {
      this.logger.error(`Failed to decrement 'PostCount' for User ID '${userId}'`);
    }

    return isPostCountUpdated;
  }
}
