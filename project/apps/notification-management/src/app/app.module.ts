import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EmailSubscriberModule } from '@project/email-subscriber';
import { NotificationConfigModule } from '@project/notification-config';
import { getMongooseOptions } from '@project/user-config';

@Module({
  imports: [
    EmailSubscriberModule,
    NotificationConfigModule,
    MongooseModule.forRootAsync(
      getMongooseOptions()
    )
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
