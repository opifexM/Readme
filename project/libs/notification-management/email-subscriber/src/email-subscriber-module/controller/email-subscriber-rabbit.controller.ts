import { RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import { Controller, Logger } from '@nestjs/common';
import { RabbitExchange, RabbitQueue, RabbitRouting } from '@project/shared-core';
import { ChangePasswordDto } from '../dto/change-password.dto';
import { CreateSubscriberDto } from '../dto/create-subscriber.dto';
import { EmailSubscriberService } from '../email-subscriber.service';

@Controller()
export class EmailSubscriberRabbitController {
  private readonly logger = new Logger(EmailSubscriberRabbitController.name);

  constructor(
    private readonly emailSubscriberService: EmailSubscriberService
  ) {}

  @RabbitSubscribe({
    exchange: RabbitExchange.Default,
    routingKey: RabbitRouting.AddSubscriber,
    queue: RabbitQueue.NewSubscriber,
  })
  public async processNewSubscriber(subscriber: CreateSubscriberDto): Promise<void> {
    this.logger.log(`Received RabbitMQ message to add new subscriber: ${subscriber.email}`);
    await this.emailSubscriberService.processNewSubscriber(subscriber);
  }

  @RabbitSubscribe({
    exchange: RabbitExchange.Default,
    routingKey: RabbitRouting.ChangePassword,
    queue: RabbitQueue.PasswordChange,
  })
  public async processChangePasswordEmail(subscriber: ChangePasswordDto): Promise<void> {
    this.logger.log(`Received RabbitMQ message to change password for: ${subscriber.email}`);
    await this.emailSubscriberService.processChangePassword(subscriber);
  }
}
