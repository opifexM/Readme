import { Inject, Injectable, Logger, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { ApplicationConfig } from '@project/content-config';
import { CommentEntity, CommentRepository } from '@project/content-core';
import { PostService } from '@project/post';
import { PaginationResult, SortDirection } from '@project/shared-core';
import {
  COMMENT_DELETE_PERMISSION,
  COMMENT_MODIFY_PERMISSION,
  COMMENT_NOT_FOUND,
  COMMENT_POST_NOT_FOUND
} from './comment.constant';
import { CommentQuery } from './comment.query';
import { UpdateCommentDto } from './dto/update-comment.dto';

@Injectable()
export class CommentService {
  private readonly logger = new Logger(CommentService.name);
  private readonly defaultPage = 1;

  constructor(
    @Inject('CommentRepository') private readonly commentRepository: CommentRepository,
    private readonly postService: PostService,
    @Inject(ApplicationConfig.KEY) private readonly applicationConfig: ConfigType<typeof ApplicationConfig>
  ) {
  }

  public async createComment(userId: string, postId: string, dto: UpdateCommentDto): Promise<CommentEntity> {
    this.logger.log(`Creating comment for post ${postId} by user ${userId}`);
    const commentData = {
      authorId: userId,
      postId: postId,
      text: dto.text
    };

    if (!await this.postService.exists(postId)) {
      this.logger.warn(`Post not found with ID: '${postId}'`);
      throw new NotFoundException(COMMENT_POST_NOT_FOUND);
    }

    const commentEntity = new CommentEntity(commentData);
    const createdComment = await this.commentRepository.save(commentEntity);
    await this.postService.incrementCommentCount(createdComment.postId);
    this.logger.log(`Comment created with ID: '${createdComment.id}'`);

    return createdComment;
  }

  public async findCommentById(commentId: string): Promise<CommentEntity> {
    this.logger.log(`Finding comment by ID: '${commentId}'`);
    const foundComment = await this.commentRepository.findById(commentId);
    if (!foundComment) {
      this.logger.warn(`Comment not found with ID: '${commentId}'`);
      throw new NotFoundException(COMMENT_NOT_FOUND);
    }

    return foundComment;
  }

  public async findCommentsByPostId(postId: string, commentQuery?: CommentQuery): Promise<PaginationResult<CommentEntity>> {
    this.logger.log(`Finding comments for post ID: '${postId}'`);
    if (!await this.postService.exists(postId)) {
      this.logger.warn(`Post not found with ID: '${postId}'`);
      throw new NotFoundException(COMMENT_POST_NOT_FOUND);
    }

    const limit = Math.min(commentQuery?.limit ?? Number.MAX_VALUE, this.applicationConfig.defaultCommentCountLimit);
    const sortDirection = commentQuery?.sortDirection ?? SortDirection.DESC;
    const page = commentQuery?.page ?? this.defaultPage;

    const commentsPagination = await this.commentRepository
      .findAllByPostId(postId, { limit, sortDirection, page });

    if (!commentsPagination.entities) {
      this.logger.warn(`No comments found for post ID: '${postId}'`);
      throw new NotFoundException(COMMENT_NOT_FOUND);
    }

    return commentsPagination;
  }

  public async exists(commentId: string): Promise<boolean> {
    return this.commentRepository.exists(commentId);
  }

  public async updateCommentById(userId: string, commentId: string, dto: UpdateCommentDto): Promise<CommentEntity> {
    this.logger.log(`Updating comment ID: '${commentId}' by user ID: '${userId}'`);
    const updatedComment = await this.commentRepository.findById(commentId);
    if (updatedComment.authorId !== userId) {
      this.logger.warn(`Unauthorized update attempt by user ID: '${userId}' on comment ID: '${commentId}'`);
      throw new UnauthorizedException(COMMENT_MODIFY_PERMISSION);
    }

    if (dto.text !== undefined) updatedComment.text = dto.text;

    return this.commentRepository.update(commentId, updatedComment);
  }

  public async deleteCommentById(userId: string, commentId: string): Promise<CommentEntity> {
    this.logger.log(`Deleting comment ID: '${commentId}' by user ID: '${userId}'`);
    const foundComment = await this.commentRepository.findById(commentId);

    if (foundComment.authorId !== userId) {
      this.logger.warn(`Unauthorized delete attempt by user ID: '${userId}' on comment ID: '${commentId}'`);
      throw new UnauthorizedException(COMMENT_DELETE_PERMISSION);
    }

    const deletedComment = await this.commentRepository.deleteById(commentId);
    await this.postService.decrementCommentCount(deletedComment.postId);
    this.logger.log(`Comment deleted ID: '${commentId}'`);

    return deletedComment;
  }
}
