import { Module } from '@nestjs/common';
import { getModelToken, MongooseModule } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { EmailScheduleFactory } from './entity/email-schedule/email-schedule.factory';
import { EmailScheduleModel, EmailScheduleSchema } from './entity/email-schedule/email-schedule.model';
import { EmailSubscriberFactory } from './entity/email-subscriber/email-subscriber.factory';
import { EmailSubscriberModel, EmailSubscriberSchema } from './entity/email-subscriber/email-subscriber.model';
import { EmailScheduleMongodbRepository } from './repository/email-schedule/email-schedule-mongodb.repository';
import { EmailSubscriberMongodbRepository } from './repository/email-subscriber/email-subscriber-mongodb.repository';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: EmailSubscriberModel.name, schema: EmailSubscriberSchema }]),
    MongooseModule.forFeature([{ name: EmailScheduleModel.name, schema: EmailScheduleSchema }]),
  ],
  providers: [
    {
      provide: 'EmailSubscriberRepository',
      useFactory: (emailSubscriberFactory: EmailSubscriberFactory, emailSubscriberModel: Model<EmailSubscriberModel>) =>
        new EmailSubscriberMongodbRepository(emailSubscriberFactory, emailSubscriberModel),
      inject: [EmailSubscriberFactory, getModelToken(EmailSubscriberModel.name)]
    },
    EmailSubscriberFactory,
    {
      provide: 'EmailScheduleRepository',
      useFactory: (emailScheduleFactory: EmailScheduleFactory, emailScheduleModelModel: Model<EmailScheduleModel>) =>
        new EmailScheduleMongodbRepository(emailScheduleFactory, emailScheduleModelModel),
      inject: [EmailScheduleFactory, getModelToken(EmailScheduleModel.name)]
    },
    EmailScheduleFactory
  ],
  exports: [
    'EmailSubscriberRepository',
    'EmailScheduleRepository',
  ]
})

export class NotificationCoreModule {
}
