import { Injectable, Logger } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { UserEntity } from '@project/user-core';
import { Strategy } from 'passport-local';
import { AuthenticationService } from '../authentication-module/authentication.service';

const USERNAME_FIELD_NAME = 'email';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  private readonly logger = new Logger(LocalStrategy.name);

  constructor(
    private readonly authService: AuthenticationService
  ) {
    super({
      usernameField: USERNAME_FIELD_NAME
    });
  }

  public async validate(email: string, password: string): Promise<UserEntity> {
    this.logger.log(`Authenticating user with email: ${email} and password`);
    return this.authService.verifyUser({ email, password });
  }
}
