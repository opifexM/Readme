import { HttpService } from '@nestjs/axios';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Inject,
  Logger,
  Param,
  Patch,
  Post,
  UseFilters,
  UseGuards
} from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ApplicationConfig } from '@project/api-config';
import { MongoIdValidationPipe } from '@project/pipes';
import { fillDto } from '@project/shared-helpers';
import { GetUser } from '../decorator/get-user.decorator';
import { AxiosExceptionFilter } from '../filter/axios-exception.filter';
import { CheckAuthGuard } from '../guard/check-auth.guard';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { SubscriptionRdo } from './rdo/subscription.rdo';
import { UserRdo } from './rdo/user.rdo';

@ApiTags('Api-User')
@Controller('user')
@UseFilters(AxiosExceptionFilter)
export class ApiUserController {
  private readonly logger = new Logger(ApiUserController.name);

  constructor(
    private readonly httpService: HttpService,
    @Inject(ApplicationConfig.KEY) private readonly applicationConfig: ConfigType<typeof ApplicationConfig>
  ) {
  }

  @Post('')
  @ApiOperation({ summary: 'Create a new user' })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'User created', type: UserRdo })
  @ApiResponse({ status: HttpStatus.CONFLICT, description: 'User exists' })
  public async createUser(
    @Body() dto: CreateUserDto
  ): Promise<UserRdo> {
    this.logger.log(`Creating new user with email: ${dto.email}`);
    const { data } = await this.httpService.axiosRef.post(`${this.applicationConfig.serviceUrlUser}/`, dto);
    this.logger.log('User created successfully');

    return fillDto(UserRdo, data);
  }

  @Get(':userId')
  @UseGuards(CheckAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get user by ID' })
  @ApiResponse({ status: HttpStatus.OK, description: 'User found', type: UserRdo })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'User unauthorized' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'User not found' })
  public async getUser(
    @Param('userId', MongoIdValidationPipe) userId: string
  ): Promise<UserRdo> {
    this.logger.log(`Fetching user by ID: ${userId}`);
    const { data } = await this.httpService.axiosRef.get(`${this.applicationConfig.serviceUrlUser}/${userId}`);
    this.logger.log('User retrieved successfully');

    return fillDto(UserRdo, data);
  }

  @Patch()
  @UseGuards(CheckAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update user' })
  @ApiResponse({ status: HttpStatus.OK, description: 'User updated', type: UserRdo })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'User unauthorized' })
  public async updateUser(
    @Body() dto: UpdateUserDto,
    @GetUser() userId: string
  ): Promise<UserRdo> {
    this.logger.log(`Updating user ID: ${userId}`);
    const { data } = await this.httpService.axiosRef
      .patch(`${this.applicationConfig.serviceUrlUser}`, dto, { params: { userId } });
    this.logger.log('User updated successfully');

    return fillDto(UserRdo, data);
  }

  @Post('subscription/:subscribeUserId')
  @UseGuards(CheckAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Subscribe user' })
  @ApiResponse({ status: HttpStatus.OK, description: 'User subscribed', type: SubscriptionRdo })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'User unauthorized' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Subscribe User not found' })
  public async subscribeUser(
    @Param('subscribeUserId', MongoIdValidationPipe) subscribeUserId: string,
    @GetUser() userId: string
  ): Promise<SubscriptionRdo> {
    this.logger.log(`Subscribing user ID: ${userId} to user ID: ${subscribeUserId}`);
    const { data } = await this.httpService.axiosRef
      .post(`${this.applicationConfig.serviceUrlUser}/subscription/${subscribeUserId}`, {},{ params: { userId } });
    this.logger.log('Subscription successful');

    return fillDto(SubscriptionRdo, data);
  }

  @Delete('subscription/:unsubscribeUserId')
  @UseGuards(CheckAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Unsubscribe user' })
  @ApiResponse({ status: HttpStatus.OK, description: 'User unsubscribed', type: SubscriptionRdo })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'User unauthorized' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Subscribe User not found' })
  public async unsubscribeUser(
    @Param('unsubscribeUserId', MongoIdValidationPipe) unsubscribeUserId: string,
    @GetUser() userId: string
  ): Promise<SubscriptionRdo> {
    this.logger.log(`Unsubscribing user ID: ${userId} from user ID: ${unsubscribeUserId}`);
    const { data } = await this.httpService.axiosRef
      .delete(`${this.applicationConfig.serviceUrlUser}/subscription/${unsubscribeUserId}`, { params: { userId } });
    this.logger.log('Unsubscription successful');

    return fillDto(SubscriptionRdo, data);
  }
}
