import { Controller, HttpStatus, Logger, Post, Query } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { EmailSubscriberService } from '../email-subscriber.service';
import { PostNotificationRdo } from '../rdo/post-notification.rdo';

@ApiTags('Notifications')
@Controller('notifications')
export class EmailSubscriberRestController {
  private readonly logger = new Logger(EmailSubscriberRestController.name);

  constructor(
    private readonly emailSubscriberService: EmailSubscriberService
  ) {}

  @Post('new-posts-emails')
  @ApiOperation({ summary: 'Send emails about new posts to all users' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Emails about new posts have been sent successfully', type: PostNotificationRdo })
  @ApiQuery({ name: 'userId', type: 'string', required: true, description: 'Current authorized User ID' })
  public async getPersonalFeedPosts(
    @Query('userId') userId: string
  ): Promise<PostNotificationRdo> {
    this.logger.log(`Starting the process to send email notifications for new posts, initiated by user ID: '${userId}'`);

    return await this.emailSubscriberService.findPostsForNotification(userId);
  }
}
