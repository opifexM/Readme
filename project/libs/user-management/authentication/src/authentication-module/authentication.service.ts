import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException
} from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Token, User } from '@project/shared-core';
import { createJWTPayload, CryptoProtocol } from '@project/shared-helpers';
import { JwtConfig } from '@project/user-config';
import { UserEntity, UserRepository } from '@project/user-core';
import { NotifyService } from '@project/user-notify';
import { ChangePasswordDto } from '../dto/change-password.dto';
import { LoginDto } from '../dto/login.dto';
import { RefreshTokenService } from '../refresh-token-module/refresh-token.service';
import {
  AUTHENTICATION_NEW_PASSWORD_SAME,
  AUTHENTICATION_PASSWORD_EMPTY,
  AUTHENTICATION_USER_NOT_FOUND,
  AUTHENTICATION_USER_PASSWORD_WRONG
} from './authentication.constant';

@Injectable()
export class AuthenticationService {
  private readonly logger = new Logger(AuthenticationService.name);

  constructor(
    @Inject('UserRepository') private readonly userRepository: UserRepository,
    @Inject('CryptoProtocol') private readonly cryptoProtocol: CryptoProtocol,
    private readonly jwtService: JwtService,
    private readonly notifyService: NotifyService,
    @Inject(JwtConfig.KEY) private readonly jwtConfig: ConfigType<typeof JwtConfig>,
    private readonly refreshTokenService: RefreshTokenService,
  ) {}

  public async hashPassword(password: string): Promise<string> {
    this.logger.log(`Hashing password`);
    if (!password) {
      this.logger.error('Attempt to hash an empty password');
      throw new BadRequestException(AUTHENTICATION_PASSWORD_EMPTY);
    }

    return this.cryptoProtocol.hashPassword(password);
  }

  public async verifyUser(dto: LoginDto): Promise<UserEntity> {
    this.logger.log(`Verifying user: ${dto.email}`);
    const {email, password} = dto;

    const existUser = await this.getUserByEmail(email);
    const isPasswordCorrect = await this.cryptoProtocol.verifyPassword(password, existUser.passwordHash);
    if (!isPasswordCorrect) {
      this.logger.warn(`Incorrect password attempt for user: ${dto.email}`);
      throw new UnauthorizedException(AUTHENTICATION_USER_PASSWORD_WRONG);
    }
    this.logger.log(`User verified: ${existUser.email}`);

    return existUser;
  }

  public async getUserByEmail(email: string): Promise<UserEntity> {
    this.logger.log(`Attempting to retrieve user by email: ${email}`);
    const existUser = await this.userRepository.findByEmail(email);
    if (!existUser) {
      this.logger.warn(`No user found with email: ${email}`);
      throw new NotFoundException(AUTHENTICATION_USER_NOT_FOUND);
    }

    return existUser;
  }

  public async createUserToken(user: User): Promise<Token> {
    this.logger.log(`Generating token for user ID: '${user.id}'`);
    const accessTokenPayload = createJWTPayload(user);
    const refreshTokenPayload = { ...accessTokenPayload, tokenId: crypto.randomUUID() };
    await this.refreshTokenService.createRefreshSession(refreshTokenPayload);

    try {
      const accessToken = await this.jwtService.signAsync(accessTokenPayload);
      const refreshToken = await this.jwtService.signAsync(refreshTokenPayload, {
        secret: this.jwtConfig.refreshTokenSecret,
        expiresIn: this.jwtConfig.refreshTokenExpiresIn
      });
      this.logger.log(`Tokens generated successfully for user ID: '${user.id}'`);

      return { accessToken, refreshToken };
    } catch (error) {
      this.logger.error('[Tokens generation error]: ' + error.message);
      throw new HttpException('Tokens generation error.', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  public async changePassword(userId: string, dto: ChangePasswordDto): Promise<UserEntity> {
    const {oldPassword, newPassword} = dto;
    this.logger.log(`Changing password for user ID: '${userId}'`);

    if (oldPassword === newPassword) {
      throw new NotFoundException(AUTHENTICATION_NEW_PASSWORD_SAME);
    }

    const foundUser = await this.userRepository.findById(userId);
    if (!foundUser) {
      this.logger.warn('New password is the same as old password');
      throw new NotFoundException(AUTHENTICATION_USER_NOT_FOUND);
    }

    foundUser.passwordHash = await this.hashPassword(newPassword);
    const updatedUser = await this.userRepository.update(userId, foundUser);

    await this.notifyService.publishChangePassword({
      email: updatedUser.email,
      firstName: updatedUser.firstName,
      lastName: updatedUser.lastName
    });
    this.logger.log(`Password changed for user ID: '${userId}'`);

    return updatedUser;
  }
}
