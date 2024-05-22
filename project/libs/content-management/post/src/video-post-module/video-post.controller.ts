import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Logger,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query
} from '@nestjs/common';
import { ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { fillDto } from '@project/shared-helpers';
import { CreateVideoPostDto } from './dto/create-video-post.dto';
import { UpdateVideoPostDto } from './dto/update-video-post.dto';
import { VideoPostRdo } from './rdo/video-post.rdo';
import { VideoPostService } from './video-post.service';

@ApiTags('Video-Posts')
@Controller('post/video')
export class VideoPostController {
  private readonly logger = new Logger(VideoPostController.name);

  constructor(
    private readonly videoPostService: VideoPostService,
  ) {}

  @Post('/')
  @ApiOperation({ summary: 'Create a Video-Post' })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Video-Post successfully created', type: VideoPostRdo })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized access' })
  @ApiQuery({ name: 'userId', type: 'string', required: true, description: 'Current authorized User ID' })
  public async createVideoPost(
    @Body() dto: CreateVideoPostDto,
    @Query('userId') userId: string
  ): Promise<VideoPostRdo> {
    this.logger.log(`Creating video post for user ${userId}`);
    const createdVideoPost = await this.videoPostService.createPost(userId, dto);

    return fillDto(VideoPostRdo, createdVideoPost.toPOJO());
  }

  @Get(':postId')
  @ApiOperation({ summary: 'Retrieve a Video-Post by ID' })
  @ApiParam({ name: 'postId', description: 'Unique identifier of the post', type: String })
  @ApiResponse({ status: HttpStatus.OK, description: 'Video-Post retrieved successfully', type: VideoPostRdo })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Video-Post not found' })
  public async getVideoPost(
    @Param('postId', ParseUUIDPipe) postId: string
  ): Promise<VideoPostRdo> {
    this.logger.log(`Retrieving video post ID ${postId}`);
    const foundPost = await this.videoPostService.findPostById(postId);

    return fillDto(VideoPostRdo, foundPost.toPOJO());
  }

  @Patch(':postId')
  @ApiOperation({ summary: 'Update a Video-Post' })
  @ApiParam({ name: 'postId', description: 'Unique identifier of the post', type: String })
  @ApiResponse({ status: HttpStatus.OK, description: 'Video-Post updated successfully', type: VideoPostRdo })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized access' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Video-Post not found' })
  @ApiQuery({ name: 'userId', type: 'string', required: true, description: 'Current authorized User ID' })
  public async updateVideoPost(
    @Param('postId', ParseUUIDPipe) postId: string,
    @Body() dto: UpdateVideoPostDto,
    @Query('userId') userId: string
  ): Promise<VideoPostRdo> {
    this.logger.log(`Updating video post ID ${postId} by user ${userId}`);
    const updatedPost = await this.videoPostService.updatePostById(userId, postId, dto);

    return fillDto(VideoPostRdo, updatedPost.toPOJO());
  }

  @Delete(':postId')
  @ApiOperation({ summary: 'Delete a Video-Post' })
  @ApiParam({ name: 'postId', description: 'Unique identifier of the post', type: String })
  @ApiResponse({ status: HttpStatus.OK, description: 'Video-Post successfully deleted', type: VideoPostRdo })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized access' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Video-Post not found' })
  @ApiQuery({ name: 'userId', type: 'string', required: true, description: 'Current authorized User ID' })
  public async deleteVideoPost(
    @Param('postId', ParseUUIDPipe) postId: string,
    @Query('userId') userId: string
  ): Promise<VideoPostRdo> {
    this.logger.log(`Deleting video post ID ${postId} by user ${userId}`);
    const deletedPost = await this.videoPostService.deletePostById(userId, postId);

    return fillDto(VideoPostRdo, deletedPost.toPOJO());
  }

  @Post(':postId/repost')
  @ApiOperation({ summary: 'Repost a Video-Post' })
  @ApiParam({ name: 'postId', description: 'Unique identifier of the post', type: String })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Video-Post successfully reposted', type: VideoPostRdo })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized access' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Original Video-Post not found' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Video-Post has already been reposted' })
  @ApiQuery({ name: 'userId', type: 'string', required: true, description: 'Current authorized User ID' })
  public async repostVideoPost(
    @Param('postId', ParseUUIDPipe) postId: string,
    @Query('userId') userId: string
  ): Promise<VideoPostRdo> {
    this.logger.log(`Reposting video post ID ${postId} by user ${userId}`);
    const repostedPost = await this.videoPostService.repostPostById(userId, postId);

    return fillDto(VideoPostRdo, repostedPost.toPOJO());
  }
}
