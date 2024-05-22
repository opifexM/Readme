import { Repository } from '@project/data-access';
import { EmailSubscriberEntity } from '../../entity/email-subscriber/email-subscriber.entity';

export interface EmailSubscriberRepository extends Repository<EmailSubscriberEntity> {
  findByEmail(email: string): Promise<EmailSubscriberEntity | null>;

  getAllSubscribers(): Promise<EmailSubscriberEntity[]>;
}
