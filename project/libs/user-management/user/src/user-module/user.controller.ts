import { Body, Controller, Delete, Get, HttpStatus, Logger, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { MongoIdValidationPipe } from '@project/pipes';
import { fillDto } from '@project/shared-helpers';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { SubscriptionRdo } from './rdo/subscription.rdo';
import { UserRdo } from './rdo/user.rdo';
import { UserService } from './user.service';

@ApiTags('User')
@Controller('user')
export class UserController {
  private readonly logger = new Logger(UserController.name);

  constructor(
    private readonly userService: UserService
  ) {
  }

  @Post('')
  @ApiOperation({ summary: 'Create a new user' })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'User created', type: UserRdo })
  @ApiResponse({ status: HttpStatus.CONFLICT, description: 'User exists' })
  public async createUser(
    @Body() dto: CreateUserDto
  ): Promise<UserRdo> {
    this.logger.log(`Creating new user with email: '${dto.email}'`);
    const createdUser = await this.userService.createUser(dto);

    return fillDto(UserRdo, createdUser.toPOJO());
  }

  @Get('subscription')
  @ApiOperation({ summary: 'Get subscriptionIds from user' })
  @ApiResponse({ status: HttpStatus.OK, description: 'User subscriptionIds', type: SubscriptionRdo })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'User unauthorized' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Subscribe User not found' })
  @ApiQuery({ name: 'userId', type: 'string', required: true, description: 'Current authorized User ID' })
  public async getSubscriptionIds(
    @Query('userId') userId: string
  ): Promise<SubscriptionRdo> {
    this.logger.log(`Get subscriptionIds from user '${userId}'`);
    const foundUser = await this.userService.findUserById(userId);

    return fillDto(SubscriptionRdo, foundUser.toPOJO());
  }

  @Get(':userId')
  @ApiOperation({ summary: 'Get user by ID' })
  @ApiResponse({ status: HttpStatus.OK, description: 'User found', type: UserRdo })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'User unauthorized' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'User not found' })
  public async getUser(
    @Param('userId', MongoIdValidationPipe) userId: string
  ): Promise<UserRdo> {
    this.logger.log(`Retrieving user with ID: '${userId}'`);
    const foundUser = await this.userService.findUserById(userId);

    return fillDto(UserRdo, foundUser.toPOJO());
  }

  @Patch()
  @ApiOperation({ summary: 'Update user' })
  @ApiResponse({ status: HttpStatus.OK, description: 'User updated', type: UserRdo })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'User unauthorized' })
  @ApiQuery({ name: 'userId', type: 'string', required: true, description: 'Current authorized User ID' })
  public async updateUser(
    @Body() dto: UpdateUserDto,
    @Query('userId') userId: string
  ): Promise<UserRdo> {
    this.logger.log(`Updating user with ID '${userId}'`);
    const updatedUser = await this.userService.updateUserById(userId, dto);

    return fillDto(UserRdo, updatedUser.toPOJO());
  }

  @Post('subscription/:subscribeUserId')
  @ApiOperation({ summary: 'Subscribe user' })
  @ApiResponse({ status: HttpStatus.OK, description: 'User subscribed', type: SubscriptionRdo })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'User unauthorized' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Subscribe User not found' })
  @ApiQuery({ name: 'userId', type: 'string', required: true, description: 'Current authorized User ID' })
  public async subscribeUser(
    @Param('subscribeUserId', MongoIdValidationPipe) subscribeUserId: string,
    @Query('userId') userId: string
  ): Promise<SubscriptionRdo> {
    this.logger.log(`Subscribing user '${userId}' to user '${subscribeUserId}'`);
    const updatedUser = await this.userService.subscribeUserById(userId, subscribeUserId);

    return fillDto(SubscriptionRdo, updatedUser.toPOJO());
  }

  @Delete('subscription/:unsubscribeUserId')
  @ApiOperation({ summary: 'Unsubscribe user' })
  @ApiResponse({ status: HttpStatus.OK, description: 'User unsubscribed', type: SubscriptionRdo })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'User unauthorized' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Subscribe User not found' })
  @ApiQuery({ name: 'userId', type: 'string', required: true, description: 'Current authorized User ID' })
  public async unsubscribeUser(
    @Param('unsubscribeUserId', MongoIdValidationPipe) unsubscribeUserId: string,
    @Query('userId') userId: string
  ): Promise<SubscriptionRdo> {
    this.logger.log(`Unsubscribing user '${userId}' from user '${unsubscribeUserId}'`);
    const updatedUser = await this.userService.unsubscribeUserById(userId, unsubscribeUserId);

    return fillDto(SubscriptionRdo, updatedUser.toPOJO());
  }

  @Post('post-count')
  @ApiOperation({ summary: 'Increment post count for user' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Post count for user successfully incremented', type: Boolean })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'User unauthorized' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Subscribe User not found' })
  @ApiQuery({ name: 'userId', type: 'string', required: true, description: 'Current authorized User ID' })
  public async incrementUserPostCount(
    @Query('userId') userId: string
  ): Promise<{ success: boolean }> {
    this.logger.log(`Attempting to increment post count for user ID: '${userId}'`);
    const success = await this.userService.incrementPostCount(userId);

    return { success };
  }

  @Delete('post-count')
  @ApiOperation({ summary: 'Decrement post count for user' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Post count for user decremented', type: Boolean })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'User unauthorized' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Subscribe User not found' })
  @ApiQuery({ name: 'userId', type: 'string', required: true, description: 'Current authorized User ID' })
  public async decrementUserPostCount(
    @Query('userId') userId: string
  ): Promise<{ success: boolean }> {
    this.logger.log(`Attempting to decrement post count for user ID: '${userId}'`);
    const success = await this.userService.decrementPostCount(userId);

    return { success };
  }
}
