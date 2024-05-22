import { HttpService } from '@nestjs/axios';
import {
  Controller,
  Delete,
  Get,
  HttpStatus,
  Inject,
  Logger,
  Param,
  ParseUUIDPipe,
  Post,
  UseFilters,
  UseGuards
} from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ApplicationConfig } from '@project/api-config';
import { fillDto } from '@project/shared-helpers';
import { GetUser } from '../decorator/get-user.decorator';
import { AxiosExceptionFilter } from '../filter/axios-exception.filter';
import { CheckAuthGuard } from '../guard/check-auth.guard';
import { PostRdo } from './rdo/post.rdo';

@ApiTags('Api-General-Post')
@Controller('post/general')
@UseFilters(AxiosExceptionFilter)
export class ApiPostController {
  private readonly logger = new Logger(ApiPostController.name);

  constructor(
    private readonly httpService: HttpService,
    @Inject(ApplicationConfig.KEY) private readonly applicationConfig: ConfigType<typeof ApplicationConfig>
  ) {
  }

  @Get(':postId')
  @ApiOperation({ summary: 'Retrieve a Post by ID' })
  @ApiParam({ name: 'postId', description: 'Unique identifier of the post', type: String })
  @ApiResponse({ status: HttpStatus.OK, description: 'Post retrieved successfully', type: PostRdo })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Post not found' })
  public async getPost(
    @Param('postId', ParseUUIDPipe) postId: string
  ): Promise<PostRdo> {
    this.logger.log(`Retrieving Post with ID:' ${postId}'`);
    const { data } = await this.httpService.axiosRef.get(`${this.applicationConfig.serviceUrlPost}/${postId}`);
    this.logger.log(`ost with ID: '${postId}' retrieved successfully`);

    return fillDto(PostRdo, data);
  }

  @Delete(':postId')
  @UseGuards(CheckAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a Post' })
  @ApiParam({ name: 'postId', description: 'Unique identifier of the post', type: String })
  @ApiResponse({ status: HttpStatus.OK, description: 'Post deleted', type: PostRdo })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'User unauthorized' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Post not found' })
  public async deletePost(
    @Param('postId', ParseUUIDPipe) postId: string,
    @GetUser() userId: string
  ): Promise<PostRdo> {
    this.logger.log(`Attempting to delete Post with ID: '${postId}' by user ID: '${userId}'`);
    const { data } = await this.httpService.axiosRef
      .delete(`${this.applicationConfig.serviceUrlPost}/${postId}`, { params: { userId } });
    this.logger.log(`Post with ID: '${postId}' deleted successfully`);

    return fillDto(PostRdo, data);
  }

  @Post(':postId/like')
  @UseGuards(CheckAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Like a Post' })
  @ApiParam({ name: 'postId', description: 'Unique identifier of the post', type: String })
  @ApiResponse({ status: HttpStatus.OK, description: 'Post liked', type: PostRdo })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'User unauthorized' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Post not found' })
  public async likePost(
    @Param('postId', ParseUUIDPipe) postId: string,
    @GetUser() userId: string
  ): Promise<PostRdo> {
    this.logger.log(`Liking post ID: '${postId}' by user ID: '${userId}'`);
    const { data } = await this.httpService.axiosRef
      .post(`${this.applicationConfig.serviceUrlPost}/${postId}/like`, {}, { params: { userId } });
    this.logger.log(`Post with ID: '${postId}' liked successfully`);

    return fillDto(PostRdo, data);
  }

  @Delete(':postId/like')
  @UseGuards(CheckAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Unlike a Post' })
  @ApiParam({ name: 'postId', description: 'Unique identifier of the post', type: String })
  @ApiResponse({ status: HttpStatus.OK, description: 'Post unliked', type: PostRdo })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'User unauthorized' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Post not found' })
  public async unlikePost(
    @Param('postId', ParseUUIDPipe) postId: string,
    @GetUser() userId: string
  ): Promise<PostRdo> {
    this.logger.log(`Unliking post ID: '${postId}' by user ID: '${userId}'`);
    const { data } = await this.httpService.axiosRef
      .delete(`${this.applicationConfig.serviceUrlPost}/${postId}/like`, { params: { userId } });
    this.logger.log(`Post with ID: '${postId}' unliked successfully`);

    return fillDto(PostRdo, data);
  }
}
