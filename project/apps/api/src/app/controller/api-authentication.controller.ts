import { HttpService } from '@nestjs/axios';
import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Inject,
  Logger,
  Patch,
  Post,
  Req,
  UseFilters,
  UseGuards,
  UseInterceptors
} from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ApplicationConfig } from '@project/api-config';
import { InjectUserIdToBodyInterceptor } from '@project/interceptors';
import { Token } from '@project/shared-core';
import { fillDto } from '@project/shared-helpers';
import { GetUser } from '../decorator/get-user.decorator';
import { AxiosExceptionFilter } from '../filter/axios-exception.filter';
import { CheckAuthGuard } from '../guard/check-auth.guard';
import { ChangePasswordDto } from './dto/change-password.dto';
import { LoginDto } from './dto/login.dto';
import { LoggedRdo } from './rdo/logged.rdo';

@ApiTags('Api-Authentication')
@Controller('auth')
@UseFilters(AxiosExceptionFilter)
export class ApiAuthenticationController {
  private readonly logger = new Logger(ApiAuthenticationController.name);

  constructor(
    private readonly httpService: HttpService,
    @Inject(ApplicationConfig.KEY) private readonly applicationConfig: ConfigType<typeof ApplicationConfig>
  ) {}

  @Post('login')
  @ApiOperation({ summary: 'User login' })
  @ApiBody({ type: LoginDto })
  @ApiOperation({ summary: 'Log in a user' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Login successful', type: LoginDto })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'User password is empty' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'User not found' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'User password is wrong' })
  public async login(@Body() loginData: LoginDto): Promise<LoggedRdo> {
    this.logger.log(`Attempting to log in user with email: ${loginData.email}`);
    const { data } = await this.httpService.axiosRef
      .post(`${this.applicationConfig.serviceUrlAuth}/login`, loginData);
    this.logger.log(`Login successful for user with email: ${loginData.email}`);

    return fillDto(LoggedRdo, data);
  }

  @Post('refresh')
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Refresh access and refresh tokens' })
  @ApiResponse({ status: HttpStatus.OK, description: 'New access and refresh tokens provided' })
  public async refreshToken(@Req() req: Request): Promise<Token> {
    this.logger.log('Attempting to refresh token');
    const { data } = await this.httpService.axiosRef
      .post(`${this.applicationConfig.serviceUrlAuth}/refresh`, {}, {
      headers: {
        'Authorization': req.headers['authorization']
      }
    });

    return data;
  }

  @Patch('change-password')
  @UseGuards(CheckAuthGuard)
  @UseInterceptors(InjectUserIdToBodyInterceptor)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Change user password' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Login successful', type: ChangePasswordDto })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'User unauthorized' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'User password is the same' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'User not found' })
  public async changePassword(
    @Body() dto: ChangePasswordDto,
    @GetUser() userId: string
  ): Promise<LoggedRdo> {
    this.logger.log('Attempting to change password for user');
    const { data } = await this.httpService.axiosRef
      .patch(`${this.applicationConfig.serviceUrlAuth}/change-password`, dto, { params: { userId } });
    this.logger.log(`Password change successful for user ID: ${data.id}`);

    return fillDto(LoggedRdo, data);
  }
}
