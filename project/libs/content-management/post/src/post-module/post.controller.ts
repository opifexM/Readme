import { Controller, Delete, Get, HttpStatus, Logger, Param, ParseUUIDPipe, Post, Query } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { fillDto } from '@project/shared-helpers';
import { PostExistencePipe } from './pipe/post-existence.pipe';
import { PostPublishedStatusPipe } from './pipe/post-publish.pipe';
import { PostService } from './post.service';
import { PostRdo } from './rdo/post.rdo';

@ApiTags('General-Post')
@Controller('post/general')
export class PostController {
  private readonly logger = new Logger(PostController.name);

  constructor(
    private readonly postService: PostService,
  ) {}

  @Get(':postId')
  @ApiOperation({ summary: 'Retrieve a Post by ID' })
  @ApiParam({ name: 'postId', description: 'Unique identifier of the post', type: String })
  @ApiResponse({ status: HttpStatus.OK, description: 'Post retrieved successfully', type: PostRdo })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Post not found' })
  public async getPost(
    @Param('postId', ParseUUIDPipe) postId: string
  ): Promise<PostRdo> {
    this.logger.log(`Retrieving post by ID: '${postId}'`);
    const foundPost = await this.postService.findPostById(postId);

    return fillDto(PostRdo, foundPost.toPOJO());
  }

  @Delete(':postId')
  @ApiOperation({ summary: 'Delete a Post' })
  @ApiParam({ name: 'postId', description: 'Unique identifier of the post', type: String })
  @ApiResponse({ status: HttpStatus.OK, description: 'Post deleted', type: PostRdo })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'User unauthorized' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Post not found' })
  @ApiQuery({ name: 'userId', type: 'string', required: true, description: 'Current authorized User ID' })
  public async deletePost(
    @Param('postId', ParseUUIDPipe, PostExistencePipe) postId: string,
    @Query('userId') userId: string
  ): Promise<PostRdo> {
    this.logger.log(`Deleting post ID: '${postId}' by user ID: '${userId}'`);
    const deletedPost = await this.postService.deletePostById(userId, postId);

    return fillDto(PostRdo, deletedPost.toPOJO());
  }

  @Post(':postId/like')
  @ApiOperation({ summary: 'Like a Post' })
  @ApiParam({ name: 'postId', description: 'Unique identifier of the post', type: String })
  @ApiResponse({ status: HttpStatus.OK, description: 'Post liked', type: PostRdo })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'User unauthorized' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Post not found' })
  @ApiQuery({ name: 'userId', type: 'string', required: true, description: 'Current authorized User ID' })
  public async likePost(
    @Param('postId', ParseUUIDPipe, PostExistencePipe, PostPublishedStatusPipe) postId: string,
    @Query('userId') userId: string
  ): Promise<PostRdo> {
    this.logger.log(`Liking post ID: '${postId}' by user ID: '${userId}'`);
    const postAfterLike = await this.postService.likePostById(userId, postId);

    return fillDto(PostRdo, postAfterLike.toPOJO());
  }

  @Delete(':postId/like')
  @ApiOperation({ summary: 'Unlike a Post' })
  @ApiParam({ name: 'postId', description: 'Unique identifier of the post', type: String })
  @ApiResponse({ status: HttpStatus.OK, description: 'Post unliked', type: PostRdo })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'User unauthorized' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Post not found' })
  @ApiQuery({ name: 'userId', type: 'string', required: true, description: 'Current authorized User ID' })
  public async unlikePost(
    @Param('postId', ParseUUIDPipe, PostExistencePipe, PostPublishedStatusPipe) postId: string,
    @Query('userId') userId: string
  ): Promise<PostRdo> {
    this.logger.log(`Unliking post ID: '${postId}' by user ID: '${userId}'`);
    const postAfterUnlike = await this.postService.unlikePostById(userId, postId);

    return fillDto(PostRdo, postAfterUnlike.toPOJO());
  }
}
