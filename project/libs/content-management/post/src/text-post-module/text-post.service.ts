import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException
} from '@nestjs/common';
import { TextPostEntity, TextPostRepository } from '@project/content-core';
import { PostService } from '@project/post';
import { PostType } from '@project/shared-core';
import { CreateTextPostDto } from './dto/create-text-post.dto';
import { UpdateTextPostDto } from './dto/update-text-post.dto';
import {
  TEXT_POST_DELETE_PERMISSION,
  TEXT_POST_DIFFERENT_TYPE,
  TEXT_POST_MODIFY_PERMISSION,
  TEXT_POST_NOT_FOUND,
  TEXT_POST_REPOST_AUTHOR,
  TEXT_POST_REPOST_EXISTS
} from './text-post.constant';

@Injectable()
export class TextPostService {
  private readonly logger = new Logger(TextPostService.name);

  constructor(
    @Inject('TextPostRepository') private readonly textPostRepository: TextPostRepository,
    private readonly postService: PostService,
  ) {}

  public async createPost(userId: string, dto: CreateTextPostDto, originalPostId?: string): Promise<TextPostEntity> {
    this.logger.log(`Creating text post for user ${userId}`);
    const textPostData = {
      authorId: userId,
      postType: PostType.TEXT,
      tags: dto.tags ? [...new Set(dto.tags.map(tag => tag.toLowerCase()))] : [],
      originalPostId: originalPostId ?? '',
      title: dto.title,
      announcement: dto.announcement,
      text: dto.text,
    };

    const textPostEntity = new TextPostEntity(textPostData);
    const savedTextPost = await this.textPostRepository.save(textPostEntity);
    this.logger.log(`Text post created with ID ${savedTextPost.id}`);
    await this.postService.incrementUserPostCount(userId);

    return savedTextPost;
  }

  public async findPostById(postId: string): Promise<TextPostEntity> {
    this.logger.log(`Finding text post by ID ${postId}`);
    const foundTextPost = await this.textPostRepository.findById(postId);
    if (!foundTextPost) {
      this.logger.warn(`Text post not found: ${postId}`);
      throw new NotFoundException(TEXT_POST_NOT_FOUND);
    }
    if (foundTextPost.postType !== PostType.TEXT) {
      this.logger.warn(`Incorrect post type for text post: ${postId}`);
      throw new BadRequestException(TEXT_POST_DIFFERENT_TYPE);
    }

    return foundTextPost;
  }

  public async exists(postId: string): Promise<boolean> {
    return this.textPostRepository.exists(postId);
  }

  public async updatePostById(userId: string, postId: string, dto: UpdateTextPostDto): Promise<TextPostEntity> {
    this.logger.log(`Updating text post ID ${postId} by user ${userId}`);
    const updatedTextPost = await this.findPostById(postId);
    if (updatedTextPost.postType !== PostType.TEXT) {
      this.logger.warn(`Incorrect post type for text post: ${postId}`);
      throw new BadRequestException(TEXT_POST_DIFFERENT_TYPE);
    }
    if (updatedTextPost.authorId !== userId) {
      this.logger.warn(`Unauthorized attempt to modify post by user ${userId}`);
      throw new UnauthorizedException(TEXT_POST_MODIFY_PERMISSION);
    }

    if (dto.tags !== undefined) updatedTextPost.tags = dto.tags;
    if (dto.postStatus !== undefined) updatedTextPost.postStatus = dto.postStatus;
    if (dto.postedAt !== undefined) updatedTextPost.postedAt = dto.postedAt;
    if (dto.title !== undefined) updatedTextPost.title = dto.title;
    if (dto.announcement !== undefined) updatedTextPost.announcement = dto.announcement;
    if (dto.text !== undefined) updatedTextPost.text = dto.text;

    const savedUpdatedTextPost = await this.textPostRepository.update(postId, updatedTextPost);
    this.logger.log(`Text post updated ID: '${savedUpdatedTextPost.id}'`);

    return savedUpdatedTextPost;
  }

  public async deletePostById(userId: string, postId: string): Promise<TextPostEntity> {
    this.logger.log(`Deleting text post ID '${postId}' by user '${userId}'`);
    const deletedTextPost = await this.findPostById(postId);
    if (deletedTextPost.authorId !== userId) {
      this.logger.warn(`Unauthorized attempt to delete post by user '${userId}'`);
      throw new UnauthorizedException(TEXT_POST_DELETE_PERMISSION);
    }

    const deletedPost = await this.textPostRepository.deleteById(postId);
    this.logger.log(`Text post deleted ID: '${deletedPost.id}'`);
    await this.postService.decrementUserPostCount(userId);

    return deletedPost;
  }

  public async repostPostById(userId: string, postId: string): Promise<TextPostEntity> {
    this.logger.log(`Reposting text post ID '${postId}' by user '${userId}'`);
    const repostTextPost = await this.findPostById(postId);
    if (repostTextPost.postType !== PostType.TEXT) {
      this.logger.warn(`Incorrect post type for text post: '${postId}'`);
      throw new BadRequestException(TEXT_POST_DIFFERENT_TYPE);
    }
    if (repostTextPost.authorId === userId) {
      this.logger.warn(`User '${userId}' attempted to repost own post`);
      throw new UnauthorizedException(TEXT_POST_REPOST_AUTHOR);
    }

    if (await this.postService.existsRepostByUser(postId, userId)) {
      this.logger.warn(`Repost already exists for user '${userId}' and post '${postId}'`);
      throw new ConflictException(TEXT_POST_REPOST_EXISTS);
    }

    const createTextPostDto: CreateTextPostDto = {
      tags: repostTextPost.tags,
      title: repostTextPost.title,
      announcement: repostTextPost.announcement,
      text: repostTextPost.text,
    }

    const repostedTextPost = await this.createPost(userId, createTextPostDto, repostTextPost.id);
    await this.postService.incrementRepostCount(postId);
    this.logger.log(`Text post reposted successfully ID: '${repostedTextPost.id}'`);

    return repostedTextPost;
  }
}
