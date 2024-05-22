import { Module } from '@nestjs/common';
import { AuthenticationModule } from '@project/authentication';
import { UserCoreModule } from '@project/user-core';
import { NotifyModule } from '@project/user-notify';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [UserCoreModule, AuthenticationModule, NotifyModule],
  controllers: [UserController],
  providers: [UserService]
})
export class UserModule {}
