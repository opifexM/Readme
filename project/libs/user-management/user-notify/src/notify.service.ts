import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { RabbitRouting } from '@project/shared-core';
import { RabbitConfig } from '@project/user-config';
import { ChangePasswordDto } from './dto/change-password.dto';
import { CreateSubscriberDto } from './dto/create-subscriber.dto';

@Injectable()
export class NotifyService {
  private readonly logger = new Logger(NotifyService.name);

  constructor(
    private readonly rabbitClient: AmqpConnection,
    @Inject(RabbitConfig.KEY) private readonly rabbiOptions: ConfigType<typeof RabbitConfig>,
  ) {}

  public async publishSubscriberRegistration(dto: CreateSubscriberDto) {
    this.logger.log(`Publishing new subscriber registration message for: ${dto.email}`);
    try {
      await this.rabbitClient.publish<CreateSubscriberDto>(
        this.rabbiOptions.exchange,
        RabbitRouting.AddSubscriber,
        { ...dto }
      );
      this.logger.log(`Successfully published registration message for: ${dto.email}`);
    } catch (error) {
      this.logger.error(`Failed to publish subscriber registration message for: ${dto.email}`, error.stack);
    }
  }

  public async publishChangePassword(dto: ChangePasswordDto) {
    this.logger.log(`Publishing change password message for: ${dto.email}`);
    try {
      await this.rabbitClient.publish<ChangePasswordDto>(
        this.rabbiOptions.exchange,
        RabbitRouting.ChangePassword,
        { ...dto }
      );
      this.logger.log(`Successfully published change password message for: ${dto.email}`);
    } catch (error) {
      this.logger.error(`Failed to publish change password message for: ${dto.email}`, error.stack);
    }
  }
}
