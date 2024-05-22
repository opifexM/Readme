import { MailerService } from '@nestjs-modules/mailer';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { EmailConfig } from '@project/notification-config';
import { EmailSubscriberEntity } from '@project/notification-core';
import { AggregatePostRdo } from '@project/search';
import { Subscriber } from '@project/shared-core';
import {
  EMAIL_ADD_SUBSCRIBER_SUBJECT,
  EMAIL_CHANGE_PASSWORD_SUBJECT,
  EMAIL_NEW_POST_LIST_SUBJECT
} from './email.constant';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);

  constructor(
    private readonly mailerService: MailerService,
    @Inject(EmailConfig.KEY) private readonly emailConfig: ConfigType<typeof EmailConfig>,
  ) {
  }

  public async sendNotifyNewSubscriberEmail(subscriber: Subscriber) {
    this.logger.log(`Starting to send notification email to new subscriber: ${subscriber.email}`);
    try {
      await this.mailerService.sendMail({
        from: this.emailConfig.from,
        to: subscriber.email,
        subject: EMAIL_ADD_SUBSCRIBER_SUBJECT,
        template: './add-subscriber',
        context: {
          user: `${subscriber.firstName} ${subscriber.lastName}`,
          email: `${subscriber.email}`,
        }
      });
      this.logger.log(`Email notification sent successfully to: ${subscriber.email}`);
    } catch (error) {
      this.logger.error(`Failed to send email to: ${subscriber.email}`, error.stack);
    }
  }

  public async sendChangePasswordEmail(subscriber: Subscriber) {
    this.logger.log(`Starting to send change password email to: ${subscriber.email}`);
    try {
      await this.mailerService.sendMail({
        from: this.emailConfig.from,
        to: subscriber.email,
        subject: EMAIL_CHANGE_PASSWORD_SUBJECT,
        template: './change-password',
        context: {
          user: `${subscriber.firstName} ${subscriber.lastName}`,
          email: `${subscriber.email}`,
        }
      });
      this.logger.log(`Change password email sent successfully to: ${subscriber.email}`);
    } catch (error) {
      this.logger.error(`Failed to send change password email to: ${subscriber.email}`, error.stack);
    }
  }

  public async sendNewPostListEmail(subscribers: EmailSubscriberEntity[], foundPosts: AggregatePostRdo[], postDate: Date) {
    this.logger.log(`Starting to send [${foundPosts.length}] new post list emails for [${subscribers.length}] users`);
    for (const subscriber of subscribers) {
      try {
        await this.mailerService.sendMail({
          from: this.emailConfig.from,
          to: subscriber.email,
          subject: EMAIL_NEW_POST_LIST_SUBJECT,
          template: './new-post-list.hbs',
          context: {
            date: postDate.toISOString().slice(0, 10),
            posts: foundPosts.map(post => ({
              title: post.title,
              announcement: post.announcement,
              author: post.author,
              url: post.url,
              description: post.description,
              text: post.text,
              id: post.id,
              postedAt: post.postedAt,
              tags: post.tags.join(", "),
              postStatus: post.postStatus,
              likeCount: post.likeCount,
              commentCount: post.commentCount,
              repostCount: post.repostCount
            }))
          }
        });
        this.logger.log(`New-post-list send successfully by email to: ${subscriber.email}`);
      } catch (error) {
        this.logger.error(`Failed to send new-post-list email to: ${subscriber.email}`, error.stack);
      }
    }
    this.logger.log(`All [${foundPosts.length}] new-post-lists send successfully to [${subscribers.length}] users`);
  }
}
