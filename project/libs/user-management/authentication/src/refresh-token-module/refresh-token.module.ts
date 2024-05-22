import { Module } from '@nestjs/common';
import { UserCoreModule } from '@project/user-core';
import { RefreshTokenService } from './refresh-token.service';

@Module({
  imports: [
    UserCoreModule
  ],
  controllers: [],
  providers: [
    RefreshTokenService,
  ],
  exports: [RefreshTokenService]
})
export class RefreshTokenModule {}
