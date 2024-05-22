import { Entity, Schedule, StorableEntity } from '@project/shared-core';

export class EmailScheduleEntity extends Entity implements StorableEntity<Schedule> {
  lastPostDate: Date;

  constructor(schedule?: Schedule) {
    super();
    this.fillScheduleData(schedule);
  }

  public fillScheduleData(schedule?: Schedule): void {
    if (!schedule) {
      return;
    }

    this.id = schedule.id ?? '';
    this.lastPostDate = schedule.lastPostDate;
  }

  public toPOJO() {
    return {
      id: this.id,
      lastPostDate: this.lastPostDate
    };
  }
}
