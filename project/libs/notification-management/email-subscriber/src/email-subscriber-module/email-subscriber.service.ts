import { HttpService } from '@nestjs/axios';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { ApplicationConfig } from '@project/notification-config';
import { EmailScheduleRepository, EmailSubscriberEntity, EmailSubscriberRepository } from '@project/notification-core';
import { EmailService } from '../email-module/email.service';
import { ChangePasswordDto } from './dto/change-password.dto';
import { CreateSubscriberDto } from './dto/create-subscriber.dto';
import { PostNotificationRdo } from './rdo/post-notification.rdo';

@Injectable()
export class EmailSubscriberService {
  private readonly logger = new Logger(EmailSubscriberService.name);

  constructor(
    private readonly httpService: HttpService,
    @Inject(ApplicationConfig.KEY) private readonly applicationConfig: ConfigType<typeof ApplicationConfig>,
    @Inject('EmailSubscriberRepository') private readonly emailSubscriberRepository: EmailSubscriberRepository,
    @Inject('EmailScheduleRepository') private readonly emailScheduleRepository: EmailScheduleRepository,
    private readonly emailService: EmailService
  ) {
  }

  private async addSubscriber(subscriber: CreateSubscriberDto): Promise<EmailSubscriberEntity> {
    this.logger.log(`Creating new subscriber with email: ${subscriber.email}`);

    const existSubscriber = await this.emailSubscriberRepository.findByEmail(subscriber.email);
    if (existSubscriber) {
      this.logger.log(`Subscriber already exists with email: ${subscriber.email}`);
      return existSubscriber;
    }

    try {
      const emailSubscriber = new EmailSubscriberEntity(subscriber);
      const savedSubscriber = await this.emailSubscriberRepository.save(emailSubscriber);
      this.logger.log(`New subscriber created successfully with email: ${subscriber.email}`);
      return savedSubscriber;
    } catch (error) {
      this.logger.error(`Failed to create subscriber with email: ${subscriber.email}`, error.stack);
      throw error;
    }
  }

  public async processNewSubscriber(subscriber: CreateSubscriberDto): Promise<void> {
    try {
      await this.addSubscriber(subscriber);
      await this.emailService.sendNotifyNewSubscriberEmail(subscriber);
      this.logger.log(`Processed new subscriber email for: ${subscriber.email} successfully`);
    } catch (error) {
      this.logger.error(`Failed to process new subscriber email for: ${subscriber.email}`, error.stack);
    }
  }

  public async processChangePassword(subscriber: ChangePasswordDto): Promise<void> {
    try {
      await this.emailService.sendChangePasswordEmail(subscriber);
      this.logger.log(`Processed change password email for: ${subscriber.email} successfully`);
    } catch (error) {
      this.logger.error(`Failed to process change password email for: ${subscriber.email}`, error.stack);
    }
  }

  public async findPostsForNotification(userId: string): Promise<PostNotificationRdo> {
    try {
      this.logger.log(`Starting to find posts for notification initiated by user ID: '${userId}'`);

      let lastPostDate = await this.emailScheduleRepository.getLastSubscriptionPostDate();
      if (!lastPostDate) {
        lastPostDate = new Date(0);
      }
      this.logger.log(`Processed new post notifications for '${lastPostDate}' date`);

      const { data } = await this.httpService.axiosRef
        .get(`${this.applicationConfig.serviceUrlSearch}/new-posts`, { params: { postDate: lastPostDate } });
      const foundPosts = data.entities;
      this.logger.log(`Found [${foundPosts.length}] new posts since '${lastPostDate}'`);

      const subscribers = await this.emailSubscriberRepository.getAllSubscribers();
      this.logger.log(`Found [${subscribers.length}] subscribers to notify about new posts`);

      await this.emailService.sendNewPostListEmail(subscribers, foundPosts, lastPostDate);
      this.logger.log(`Emails sent successfully to all [${subscribers.length}] subscribers`);

      await this.emailScheduleRepository.updateLastSubscriptionPostDate(new Date());
      this.logger.log(`Updated last subscription post date to current date '${new Date()}'`);

      return {
        postCount: foundPosts.length,
        userCount: subscribers.length,
        lastPostDate: lastPostDate
      };
    } catch (error) {
      this.logger.error(`Failed to process new post notifications`, error.stack);
    }
  }
}
