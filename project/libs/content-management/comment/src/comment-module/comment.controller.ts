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
import { CommentQuery } from './comment.query';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { CommentPaginationRdo } from './rdo/comment-pagination.rdo';
import { CommentRdo } from './rdo/comment.rdo';

@ApiTags('Comment')
@Controller('comment')
export class CommentController {
  private readonly logger = new Logger(CommentController.name);

  constructor(
    private readonly commentService: CommentService
  ) {
  }

  @Post('post/:postId')
  @ApiOperation({ summary: 'Create a comment' })
  @ApiParam({ name: 'postId', description: 'Unique identifier of the post', type: String })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Comment created', type: CreateCommentDto })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'User unauthorized' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Post for comment not found' })
  @ApiQuery({ name: 'userId', type: 'string', required: true, description: 'Current authorized User ID' })
  public async createComment(
    @Param('postId', ParseUUIDPipe) postId: string,
    @Body() dto: CreateCommentDto,
    @Query('userId') userId: string
  ): Promise<CommentRdo> {
    this.logger.log(`Attempting to create comment for post: ${postId} by user: ${userId}`);
    const createdComment = await this.commentService.createComment(userId, postId, dto);
    this.logger.log(`Comment created with ID: '${createdComment.id}'`);

    return fillDto(CommentRdo, createdComment.toPOJO());
  }

  @Patch(':commentId')
  @ApiOperation({ summary: 'Update a comment' })
  @ApiParam({ name: 'commentId', description: 'Unique identifier of the comment', type: String })
  @ApiResponse({ status: HttpStatus.OK, description: 'Comment updated', type: UpdateCommentDto })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'User unauthorized' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Post for comment not found' })
  @ApiQuery({ name: 'userId', type: 'string', required: true, description: 'Current authorized User ID' })
  public async updateComment(
    @Param('commentId', ParseUUIDPipe) commentId: string,
    @Body() dto: UpdateCommentDto,
    @Query('userId') userId: string
  ): Promise<CommentRdo> {
    this.logger.log(`Attempting to update comment: ${commentId} by user: ${userId}`);
    const updatedComment = await this.commentService.updateCommentById(userId, commentId, dto);
    this.logger.log(`Comment updated with ID: '${updatedComment.id}'`);

    return fillDto(CommentRdo, updatedComment.toPOJO());
  }

  @Get('post/:postId')
  @ApiOperation({ summary: 'Get comments for a post' })
  @ApiParam({ name: 'postId', description: 'Unique identifier of the post', type: String })
  @ApiResponse({ status: HttpStatus.OK, description: 'Comments retrieved successfully', type: [CommentPaginationRdo] })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Post for comment not found' })
  public async getPostComments(
    @Param('postId', ParseUUIDPipe) postId: string,
    @Query() query: CommentQuery
  ): Promise<CommentPaginationRdo> {
    this.logger.log(`Retrieving comments with query: ${JSON.stringify(query)} for post ID: '${postId}'`);
    const commentPagination = await this.commentService.findCommentsByPostId(postId, query);
    this.logger.log(`Comments retrieved for post ID: '${postId}'`);

    const transformedCommentPagination = {
      ...commentPagination,
      entities: commentPagination.entities.map((comment) => comment.toPOJO())
    };

    return fillDto(CommentPaginationRdo, transformedCommentPagination);
  }

  @Get(':commentId')
  @ApiOperation({ summary: 'Retrieve a comment by ID' })
  @ApiParam({ name: 'commentId', description: 'Unique identifier of the comment', type: String })
  @ApiResponse({ status: HttpStatus.OK, description: 'Comment retrieved successfully', type: CommentRdo })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Post for comment not found' })
  public async getComment(
    @Param('commentId', ParseUUIDPipe) commentId: string
  ): Promise<CommentRdo> {
    this.logger.log(`Retrieving comment with ID: '${commentId}'`);
    const foundComment = await this.commentService.findCommentById(commentId);
    this.logger.log(`Comment retrieved with ID: '${foundComment.id}'`);

    return fillDto(CommentRdo, foundComment.toPOJO());
  }

  @Delete(':commentId')
  @ApiOperation({ summary: 'Delete a comment' })
  @ApiParam({ name: 'commentId', description: 'Unique identifier of the comment', type: String })
  @ApiResponse({ status: HttpStatus.OK, description: 'Comment deleted', type: CommentRdo })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'User unauthorized' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Post for comment not found' })
  @ApiQuery({ name: 'userId', type: 'string', required: true, description: 'Current authorized User ID' })
  public async deleteComment(
    @Param('commentId', ParseUUIDPipe) commentId: string,
    @Query('userId') userId: string
  ): Promise<CommentRdo> {
    this.logger.log(`Attempting to delete comment: ${commentId} by user: ${userId}`);
    const deletedComment = await this.commentService.deleteCommentById(userId, commentId);
    this.logger.log(`Comment deleted with ID: '${deletedComment.id}'`);

    return fillDto(CommentRdo, deletedComment.toPOJO());
  }
}
