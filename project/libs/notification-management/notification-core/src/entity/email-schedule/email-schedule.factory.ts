import { Injectable } from '@nestjs/common';
import { EntityFactory, Schedule } from '@project/shared-core';
import { EmailScheduleEntity } from './email-schedule.entity';

@Injectable()
export class EmailScheduleFactory implements EntityFactory<EmailScheduleEntity> {
  public create(entityPlainData: Schedule): EmailScheduleEntity {
    return new EmailScheduleEntity(entityPlainData);
  }
}
