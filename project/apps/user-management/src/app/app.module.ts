import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthenticationModule } from '@project/authentication';
import { UserModule } from '@project/user';
import { getMongooseOptions, UserConfigModule } from '@project/user-config';
import { NotifyModule } from '@project/user-notify';

@Module({
  imports: [
    UserModule,
    AuthenticationModule,
    NotifyModule,
    UserConfigModule,
    MongooseModule.forRootAsync(
      getMongooseOptions()
    )
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
