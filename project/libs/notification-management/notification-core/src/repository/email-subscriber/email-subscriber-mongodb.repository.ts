import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { BaseMongoRepository } from '@project/data-access';
import { Model } from 'mongoose';
import { EmailSubscriberEntity } from '../../entity/email-subscriber/email-subscriber.entity';
import { EmailSubscriberFactory } from '../../entity/email-subscriber/email-subscriber.factory';
import { EmailSubscriberModel } from '../../entity/email-subscriber/email-subscriber.model';
import { EmailSubscriberRepository } from './email-subscriber.repository.interface';

@Injectable()
export class EmailSubscriberMongodbRepository extends BaseMongoRepository<EmailSubscriberEntity, EmailSubscriberModel> implements EmailSubscriberRepository {
  private readonly logger = new Logger(EmailSubscriberMongodbRepository.name);

  constructor(
    entityFactory: EmailSubscriberFactory,
    @InjectModel(EmailSubscriberModel.name) emailSubscriberModel: Model<EmailSubscriberModel>
  ) {
    super(entityFactory, emailSubscriberModel);
  }

  public async findByEmail(email: string): Promise<EmailSubscriberEntity | null> {
    this.logger.log(`Searching for subscriber by email: '${email}'`);
    const foundDocument = await this.model.findOne({ email: email });

    return this.createEntityFromDocument(foundDocument);
  }

  public async getAllSubscribers(): Promise<EmailSubscriberEntity[]> {
    this.logger.log('Fetching all subscribers');
    const subscribers = await this.model.find();

    return subscribers.map(subscriber => this.createEntityFromDocument(subscriber));
  }
}
