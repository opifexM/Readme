import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { NotificationCoreModule } from '@project/notification-core';
import { getMailerAsyncOptions } from '@project/shared-helpers';
import { EmailService } from './email.service';

@Module({
  imports: [
    NotificationCoreModule,
    MailerModule.forRootAsync(getMailerAsyncOptions('email')),
  ],
  providers: [EmailService],
  exports: [EmailService]
})
export class EmailModule {}
