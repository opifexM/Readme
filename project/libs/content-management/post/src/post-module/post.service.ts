import {HttpService} from '@nestjs/axios';
import {ConflictException, Inject, Injectable, Logger, NotFoundException, UnauthorizedException} from '@nestjs/common';
import {ConfigType} from '@nestjs/config';
import {ApplicationConfig} from '@project/content-config';
import {PostEntity, PostRepository} from '@project/content-core';
import {POST_ALREADY_LIKED, POST_ALREADY_UNLIKED, POST_DELETE_PERMISSION, POST_NOT_FOUND} from './post.constant';

@Injectable()
export class PostService {
  private readonly logger = new Logger(PostService.name);

  constructor(
    private readonly httpService: HttpService,
    @Inject('PostRepository') private readonly postRepository: PostRepository,
    @Inject(ApplicationConfig.KEY) private readonly applicationConfig: ConfigType<typeof ApplicationConfig>
  ) {}

  public async findPostById(postId: string): Promise<PostEntity> {
    this.logger.log(`Searching for post by ID: '${postId}'`);
    const foundPost = await this.postRepository.findById(postId);
    if (!foundPost) {
      this.logger.warn(`Post not found: ID '${postId}'`);
      throw new NotFoundException(POST_NOT_FOUND);
    }

    return foundPost;
  }

  public async deletePostById(userId: string, postId: string): Promise<PostEntity> {
    this.logger.log(`Attempting to delete post ID: '${postId}' by user ID: '${userId}'`);
    const deletedPost = await this.postRepository.findById(postId);
    if (deletedPost.authorId !== userId) {
      this.logger.warn(`Unauthorized delete attempt or post not found for ID '${postId}'`);
      throw new UnauthorizedException(POST_DELETE_PERMISSION);
    }

    const postToDelete = await this.postRepository.deleteById(postId);
    this.logger.log(`Post deleted: ID '${postId}'`);
    return postToDelete;
  }

  public async exists(postId: string): Promise<boolean> {
    return this.postRepository.exists(postId);
  }

  public async existsRepostByUser(originalPostId: string, authorId: string): Promise<boolean> {
    return this.postRepository.existsRepostByUser(originalPostId, authorId);
  }

  public async incrementRepostCount(postId: string): Promise<boolean> {
    const isRepostCountUpdated = await this.postRepository.incrementRepostCount(postId);
    if (!isRepostCountUpdated) {
      this.logger.error(`Failed to increment 'repostCount' for Post ID '${postId}'`);
    }

    return isRepostCountUpdated;
  }

  public async incrementCommentCount(postId: string): Promise<boolean> {
    const isCommentCountUpdated = await this.postRepository.incrementCommentCount(postId);
    if (!isCommentCountUpdated) {
      this.logger.error(`Failed to increment 'commentCount' for Post ID '${postId}'`);
    }

    return isCommentCountUpdated;
  }

  public async decrementCommentCount(postId: string): Promise<boolean> {
    const isCommentCountUpdated = await this.postRepository.decrementCommentCount(postId);
    if (!isCommentCountUpdated) {
      this.logger.error(`Failed to decrement 'commentCount' for Post ID '${postId}'`);
    }

    return isCommentCountUpdated;
  }

  public async likePostById(userId: string, postId: string): Promise<PostEntity> {
    this.logger.log(`User ${userId} attempting to like post ID: '${postId}'`);
    const foundPost = await this.findPostById(postId);
    const userLikeIds = foundPost.userLikeIds;
    if (userLikeIds.includes(userId)) {
      throw new ConflictException(POST_ALREADY_LIKED);
    }

    userLikeIds.push(userId);
    const updatedPost = await this.postRepository.likePost(postId, userLikeIds);
    this.logger.log(`Post liked: ID ${postId}`);

    return updatedPost;
  }

  public async unlikePostById(userId: string, postId: string): Promise<PostEntity> {
    this.logger.log(`User ${userId} attempting to unlike post ID: '${postId}'`);
    const foundPost = await this.findPostById(postId);
    const userLikeIds = foundPost.userLikeIds;
    if (!userLikeIds.includes(userId)) {
      throw new ConflictException(POST_ALREADY_UNLIKED);
    }

    const updatedUserLikeIds = userLikeIds.filter(uid => uid !== userId);
    const updatedPost = await this.postRepository.unlikePost(postId, updatedUserLikeIds);
    this.logger.log(`Post unliked: ID '${postId}'`);

    return updatedPost;
  }

  public async incrementUserPostCount(userId: string): Promise<boolean> {
    this.logger.log(`Attempting to increment post count for user ID: '${userId}'`);
    const { data } = await this.httpService.axiosRef
      .post(`${this.applicationConfig.serviceUrlUser}/post-count`, {}, { params: { userId } });
    if (data.success === undefined) {
      this.logger.error(`No success field in response while incrementing post count for user ID: '${userId}'`);
      return false;
    }

    return true;
  }

  public async decrementUserPostCount(userId: string): Promise<boolean> {
    this.logger.log(`Attempting to decrement post count for user ID: '${userId}'`);
    const { data } = await this.httpService.axiosRef
      .delete(`${this.applicationConfig.serviceUrlUser}/post-count`, { params: { userId } });
    if (data.success === undefined) {
      this.logger.error(`No success field in response while decrementing post count for user ID: '${userId}'`);
      return false;
    }

    return true;
  }
}

