import { Entity, StorableEntity, Subscriber } from '@project/shared-core';

export class EmailSubscriberEntity extends Entity implements StorableEntity<Subscriber> {
  public email: string;
  public firstName: string;
  public lastName: string;

  constructor(subscriber?: Subscriber) {
    super();
    this.fillSubscriberData(subscriber);
  }

  public fillSubscriberData(subscriber?: Subscriber): void {
    if (!subscriber) {
      return;
    }

    this.id = subscriber.id ?? '';
    this.email = subscriber.email;
    this.firstName = subscriber.firstName;
    this.lastName = subscriber.lastName;
  }

  public toPOJO() {
    return {
      id: this.id,
      email: this.email,
      firstName: this.firstName,
      lastName: this.lastName,
    }
  }
}
