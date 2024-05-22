import { Repository } from '@project/data-access';
import { EmailScheduleEntity } from '../../entity/email-schedule/email-schedule.entity';

export interface EmailScheduleRepository extends Repository<EmailScheduleEntity> {
  getLastSubscriptionPostDate(): Promise<Date | null>;

  updateLastSubscriptionPostDate(postDate: Date): Promise<boolean>;
}
