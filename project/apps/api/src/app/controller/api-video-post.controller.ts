import { HttpService } from '@nestjs/axios';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Inject,
  Logger,
  Param,
  ParseUUIDPipe,
  Patch,
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
import { CreateVideoPostDto } from './dto/create-video-post.dto';
import { UpdateVideoPostDto } from './dto/update-video-post.dto';
import { VideoPostRdo } from './rdo/video-post.rdo';

@ApiTags('Api-Video-Post')
@Controller('post/video')
@UseFilters(AxiosExceptionFilter)
export class ApiVideoPostController {
  private readonly logger = new Logger(ApiVideoPostController.name);

  constructor(
    private readonly httpService: HttpService,
    @Inject(ApplicationConfig.KEY) private readonly applicationConfig: ConfigType<typeof ApplicationConfig>
  ) {
  }

  @Post('/')
  @UseGuards(CheckAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a Video-Post' })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Video-Post created', type: CreateVideoPostDto })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'User unauthorized' })
  public async createVideoPost(
    @Body() dto: CreateVideoPostDto,
    @GetUser() userId: string
  ): Promise<VideoPostRdo> {
    this.logger.log(`Attempting to create a Video-Post for user ID: '${userId}'`);
    const { data } = await this.httpService.axiosRef
      .post(`${this.applicationConfig.serviceUrlPostVideo}`, dto, { params: { userId } });
    this.logger.log(`Video-Post created successfully for user ID: '${userId}'`);

    return fillDto(VideoPostRdo, data);
  }

  @Get(':postId')
  @ApiOperation({ summary: 'Retrieve a Video-Post by ID' })
  @ApiParam({ name: 'postId', description: 'Unique identifier of the post', type: String })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Video-Post not found' })
  public async getVideoPost(
    @Param('postId', ParseUUIDPipe) postId: string
  ): Promise<VideoPostRdo> {
    this.logger.log(`Retrieving Video-Post with ID:' ${postId}'`);
    const { data } = await this.httpService.axiosRef.get(`${this.applicationConfig.serviceUrlPostVideo}/${postId}`);
    this.logger.log(`Video-Post with ID: '${postId}' retrieved successfully`);

    return fillDto(VideoPostRdo, data);
  }

  @Patch(':postId')
  @UseGuards(CheckAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a Video-Post' })
  @ApiParam({ name: 'postId', description: 'Unique identifier of the post', type: String })
  @ApiResponse({ status: HttpStatus.OK, description: 'Video-Post updated', type: UpdateVideoPostDto })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'User unauthorized' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Video-Post not found' })
  public async updateVideoPost(
    @Param('postId', ParseUUIDPipe) postId: string,
    @Body() dto: UpdateVideoPostDto,
    @GetUser() userId: string
  ): Promise<VideoPostRdo> {
    this.logger.log(`Attempting to update Video-Post with ID: '${postId}' by user ID: '${userId}'`);
    const { data } = await this.httpService.axiosRef
      .patch(`${this.applicationConfig.serviceUrlPostVideo}/${postId}`, dto, { params: { userId } });
    this.logger.log(`Video-Post with ID: '${postId}' updated successfully`);

    return fillDto(VideoPostRdo, data);
  }

  @Delete(':postId')
  @UseGuards(CheckAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a Video-Post' })
  @ApiParam({ name: 'postId', description: 'Unique identifier of the post', type: String })
  @ApiResponse({ status: HttpStatus.OK, description: 'Video-Post deleted', type: VideoPostRdo })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'User unauthorized' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Video-Post not found' })
  public async deleteVideoPost(
    @Param('postId', ParseUUIDPipe) postId: string,
    @GetUser() userId: string
  ): Promise<VideoPostRdo> {
    this.logger.log(`Attempting to delete Video-Post with ID: '${postId}' by user ID: '${userId}'`);
    const { data } = await this.httpService.axiosRef
      .delete(`${this.applicationConfig.serviceUrlPostVideo}/${postId}`, { params: { userId } });
    this.logger.log(`Video-Post with ID: '${postId}' deleted successfully`);

    return fillDto(VideoPostRdo, data);
  }

  @Post(':postId/repost')
  @UseGuards(CheckAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Repost a Video-Post' })
  @ApiParam({ name: 'postId', description: 'Unique identifier of the post', type: String })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Video-Post reposted', type: VideoPostRdo })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'User unauthorized' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Video-Post not found' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Video-Post has already been reposted' })
  public async repostVideoPost(
    @Param('postId', ParseUUIDPipe) postId: string,
    @GetUser() userId: string
  ): Promise<VideoPostRdo> {
    this.logger.log(`Attempting to repost Video-Post with ID: '${postId}' by user ID: '${userId}'`);
    const { data } = await this.httpService.axiosRef
      .post(`${this.applicationConfig.serviceUrlPostVideo}/${postId}/repost`, {}, { params: { userId } });
    this.logger.log(`Video-Post with ID: '${postId}' reposted successfully`);

    return fillDto(VideoPostRdo, data);
  }
}
