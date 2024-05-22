import { Module } from '@nestjs/common';
import { ConfigService, ConfigType } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { BcryptCrypto } from '@project/shared-helpers';
import { ApplicationConfig, getJwtOptions } from '@project/user-config';
import { UserCoreModule } from '@project/user-core';
import { NotifyModule } from '@project/user-notify';
import { RefreshTokenModule } from '../refresh-token-module/refresh-token.module';
import { JwtAccessStrategy } from '../strategy/jwt-access.strategy';
import { JwtRefreshStrategy } from '../strategy/jwt-refresh.strategy';
import { LocalStrategy } from '../strategy/local.strategy';
import { AuthenticationController } from './authentication.controller';
import { AuthenticationService } from './authentication.service';

@Module({
  imports: [
    UserCoreModule, NotifyModule, RefreshTokenModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: getJwtOptions,
    })
  ],
  controllers: [AuthenticationController],
  providers: [
    AuthenticationService,
    {
      provide: 'CryptoProtocol',
      useFactory: (applicationConfig: ConfigType<typeof ApplicationConfig>) => new BcryptCrypto(applicationConfig.passwordSaltRounds),
      inject: [ApplicationConfig.KEY]
    },
    JwtAccessStrategy,
    JwtRefreshStrategy,
    LocalStrategy
  ],
  exports: [AuthenticationService]
})
export class AuthenticationModule {}
