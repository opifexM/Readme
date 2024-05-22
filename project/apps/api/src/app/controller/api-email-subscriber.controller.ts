import { HttpService } from '@nestjs/axios';
import { Controller, HttpStatus, Inject, Logger, Post, UseFilters, UseGuards } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ApplicationConfig } from '@project/api-config';
import { fillDto } from '@project/shared-helpers';
import { GetUser } from '../decorator/get-user.decorator';
import { AxiosExceptionFilter } from '../filter/axios-exception.filter';
import { CheckAuthGuard } from '../guard/check-auth.guard';
import { PostNotificationRdo } from './rdo/post-notification.rdo';

@ApiTags('Api-Notifications')
@Controller('notifications')
@UseFilters(AxiosExceptionFilter)
export class ApiEmailSubscriberController {
  private readonly logger = new Logger(ApiEmailSubscriberController.name);

  constructor(
    private readonly httpService: HttpService,
    @Inject(ApplicationConfig.KEY) private readonly applicationConfig: ConfigType<typeof ApplicationConfig>
  ) {
  }

  @Post('new-posts-emails')
  @UseGuards(CheckAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Send emails about new posts to all users' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Emails about new posts have been sent successfully', type: PostNotificationRdo })
  public async sendEmailsForNewPosts(
    @GetUser() userId: string
  ): Promise<PostNotificationRdo> {
    this.logger.log(`Initiating new post notification emails by user ID: '${userId}'`);
    const { data } = await this.httpService.axiosRef
      .post(`${this.applicationConfig.serviceUrlNotificationNewPost}/new-posts-emails`, {}, { params: { userId } });
    this.logger.log(`Completed sending new post notification emails initiated by user ID: '${userId}'`);

    return fillDto(PostNotificationRdo, data);
  }
}
