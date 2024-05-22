import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { BaseMongoRepository } from '@project/data-access';
import { Model } from 'mongoose';
import { EmailScheduleEntity } from '../../entity/email-schedule/email-schedule.entity';
import { EmailScheduleFactory } from '../../entity/email-schedule/email-schedule.factory';
import { EmailScheduleModel } from '../../entity/email-schedule/email-schedule.model';
import { EmailScheduleRepository } from './email-schedule.repository.interface';

@Injectable()
export class EmailScheduleMongodbRepository extends BaseMongoRepository<EmailScheduleEntity, EmailScheduleModel> implements EmailScheduleRepository {
  private readonly logger = new Logger(EmailScheduleMongodbRepository.name);

  constructor(
    entityFactory: EmailScheduleFactory,
    @InjectModel(EmailScheduleModel.name) emailScheduleModel: Model<EmailScheduleModel>
  ) {
    super(entityFactory, emailScheduleModel);
  }

  public async getLastSubscriptionPostDate(): Promise<Date | null> {
    this.logger.log('Fetching last subscription post date');
    const scheduleData = await this.model.findOne();
    this.logger.log(`Last subscription post date is: '${scheduleData?.lastPostDate || 'not set'}'`);

    return scheduleData?.lastPostDate;
  }

  public async updateLastSubscriptionPostDate(postDate: Date): Promise<boolean> {
    this.logger.log(`Updating last subscription post date to: '${postDate}'`);
    const result = await this.model.updateOne(
      {},
      {
        $set: { lastPostDate: postDate }
      },
      { upsert: true }
    );

    return result !== null;
  }
}
