import { Injectable } from '@nestjs/common';
import { EntityFactory, Subscriber } from '@project/shared-core';
import { EmailSubscriberEntity } from './email-subscriber.entity';

@Injectable()
export class EmailSubscriberFactory implements EntityFactory<EmailSubscriberEntity> {
  public create(entityPlainData: Subscriber): EmailSubscriberEntity {
    return new EmailSubscriberEntity(entityPlainData);
  }
}
