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
  Query,
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
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { CommentQuery } from './query/comment.query';
import { CommentPaginationRdo } from './rdo/comment-pagination.rdo';
import { CommentRdo } from './rdo/comment.rdo';

@ApiTags('Api-Comment')
@Controller('comment')
@UseFilters(AxiosExceptionFilter)
export class ApiCommentController {
  private readonly logger = new Logger(ApiCommentController.name);

  constructor(
    private readonly httpService: HttpService,
    @Inject(ApplicationConfig.KEY) private readonly applicationConfig: ConfigType<typeof ApplicationConfig>
  ) {
  }

  @Post('post/:postId')
  @UseGuards(CheckAuthGuard)
  @ApiBearerAuth()
  @ApiParam({ name: 'postId', description: 'Unique identifier of the post', type: String })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Comment created', type: CreateCommentDto })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'User unauthorized' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Post for comment not found' })
  public async createComment(
    @Param('postId', ParseUUIDPipe) postId: string,
    @Body() dto: CreateCommentDto,
    @GetUser() userId: string
  ): Promise<CommentRdo> {
    this.logger.log(`Creating comment for post ID: ${postId} by user ID: ${userId}`);
    console.log(dto);
    const { data } = await this.httpService.axiosRef
      .post(`${this.applicationConfig.serviceUrlComment}/post/${postId}`, dto, { params: { userId } });
    this.logger.log(`Comment created successfully for post ID: ${postId}`);

    return fillDto(CommentRdo, data);
  }

  @Patch(':commentId')
  @UseGuards(CheckAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a comment' })
  @ApiParam({ name: 'commentId', description: 'Unique identifier of the comment', type: String })
  @ApiResponse({ status: HttpStatus.OK, description: 'Comment updated', type: UpdateCommentDto })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'User unauthorized' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Post for comment not found' })
  public async updateComment(
    @Param('commentId', ParseUUIDPipe) commentId: string,
    @Body() dto: UpdateCommentDto,
    @GetUser() userId: string
  ): Promise<CommentRdo> {
    this.logger.log(`Updating comment ID: ${commentId} by user ID: ${userId}`);
    const { data } = await this.httpService.axiosRef
      .patch(`${this.applicationConfig.serviceUrlComment}/${commentId}`, dto, { params: { userId } });
    this.logger.log(`Comment ID: ${commentId} updated successfully`);

    return fillDto(CommentRdo, data);
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
    this.logger.log(`Retrieving all comments with query: ${JSON.stringify(query)} for post ID: ${postId}`);
    const { data } = await this.httpService.axiosRef
      .get(`${this.applicationConfig.serviceUrlComment}/post/${postId}`, { params: query });
    this.logger.log(`All comments retrieved successfully for post ID: ${postId}`);

    return fillDto(CommentPaginationRdo, data);
  }

  @Get(':commentId')
  @ApiOperation({ summary: 'Retrieve a comment by ID' })
  @ApiParam({ name: 'commentId', description: 'Unique identifier of the comment', type: String })
  @ApiResponse({ status: HttpStatus.OK, description: 'Comment retrieved successfully', type: CommentRdo })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Post for comment not found' })
  public async getComment(
    @Param('commentId', ParseUUIDPipe) commentId: string
  ): Promise<CommentRdo> {
    this.logger.log(`Retrieving comment ID: ${commentId}`);
    const { data } = await this.httpService.axiosRef
      .get(`${this.applicationConfig.serviceUrlComment}/${commentId}`);
    this.logger.log(`Comment ID: ${commentId} retrieved successfully`);

    return fillDto(CommentRdo, data);
  }

  @Delete(':commentId')
  @UseGuards(CheckAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a comment' })
  @ApiParam({ name: 'commentId', description: 'Unique identifier of the comment', type: String })
  @ApiResponse({ status: HttpStatus.OK, description: 'Comment deleted', type: CommentRdo })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'User unauthorized' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Post for comment not found' })
  public async deleteComment(
    @Param('commentId', ParseUUIDPipe) commentId: string,
    @GetUser() userId: string
  ): Promise<CommentRdo> {
    this.logger.log(`Deleting comment ID: ${commentId} by user ID: ${userId}`);
    const { data } = await this.httpService.axiosRef
      .delete(`${this.applicationConfig.serviceUrlComment}/${commentId}`, { params: { userId } });
    this.logger.log(`Comment ID: ${commentId} deleted successfully`);

    return fillDto(CommentRdo, data);
  }
}
