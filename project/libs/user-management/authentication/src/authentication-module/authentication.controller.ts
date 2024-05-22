import { Body, Controller, HttpCode, HttpStatus, Logger, Patch, Post, Query, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ChangePasswordDto } from '@project/authentication';
import { Token, TokenPayload } from '@project/shared-core';
import { fillDto } from '@project/shared-helpers';
import { LoginDto } from '../dto/login.dto';
import { JwtAuthGuard } from '../guard/jwt-auth.guard';
import { JwtRefreshGuard } from '../guard/jwt-refresh.guard';
import { LocalAuthGuard } from '../guard/local-auth.guard';
import { LoggedRdo } from '../rdo/logged.rdo';
import { AuthenticationService } from './authentication.service';
import { RequestWithTokenPayload } from './interface/request-with-token-payload.interface';
import { RequestWithUser } from './interface/request-with-user.interface';

@ApiTags('Authentication')
@Controller('auth')
export class AuthenticationController {
  private readonly logger = new Logger(AuthenticationController.name);

  constructor(
    private readonly authService: AuthenticationService
  ) {
  }

  @Post('login')
  @UseGuards(LocalAuthGuard)
  @ApiOperation({ summary: 'Log in a user' })
  @ApiBody({ type: LoginDto })
  @ApiResponse({ status: HttpStatus.OK, description: 'Login successful', type: LoginDto })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'User password is empty' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'User not found' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'User password is wrong' })
  public async login(
    @Req() { user }: RequestWithUser
  ): Promise<LoggedRdo> {
    this.logger.log(`User logged in successfully: ${user.email}`);
    const userToken = await this.authService.createUserToken(user);

    return fillDto(LoggedRdo, { ...userToken, ...user.toPOJO() });
  }

  @Post('refresh')
  @UseGuards(JwtRefreshGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Refresh access and refresh tokens' })
  @ApiResponse({ status: HttpStatus.OK, description: 'New access and refresh tokens provided' })
  public async refreshToken(
    @Req() { user }: RequestWithUser
  ): Promise<Token> {
    return this.authService.createUserToken(user);
  }

  @Post('check')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Check validity of the access token' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Access token is valid' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized if token is invalid or expired' })
  public async checkToken(
    @Req() { user: payload }: RequestWithTokenPayload
  ): Promise<TokenPayload> {
    this.logger.log('Check JWT access token');

    return payload;
  }

  @Patch('change-password')
  @ApiOperation({ summary: 'Change user password' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Login successful', type: ChangePasswordDto })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'User unauthorized' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'User password is the same' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'User not found' })
  @ApiQuery({ name: 'userId', type: 'string', required: true, description: 'Current authorized User ID' })
  public async changePassword(
    @Body() dto: ChangePasswordDto,
    @Query('userId') userId: string
  ): Promise<LoggedRdo> {
    this.logger.log(`Changing password for user ID: '${userId}'`);
    const updatedUser = await this.authService.changePassword(userId, dto);

    return fillDto(LoggedRdo, updatedUser.toPOJO());
  }
}

