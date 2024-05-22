import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException
} from '@nestjs/common';
import { QuotePostEntity, QuotePostRepository } from '@project/content-core';
import { PostService } from '@project/post';
import { PostType } from '@project/shared-core';
import { CreateQuotePostDto } from './dto/create-quote-post.dto';
import { UpdateQuotePostDto } from './dto/update-quote-post.dto';
import {
  QUOTE_POST_DELETE_PERMISSION,
  QUOTE_POST_DIFFERENT_TYPE,
  QUOTE_POST_MODIFY_PERMISSION,
  QUOTE_POST_NOT_FOUND,
  QUOTE_POST_REPOST_AUTHOR,
  QUOTE_POST_REPOST_EXISTS
} from './quote-post.constant';

@Injectable()
export class QuotePostService {
  private readonly logger = new Logger(QuotePostService.name);

  constructor(
    @Inject('QuotePostRepository') private readonly quotePostRepository: QuotePostRepository,
    private readonly postService: PostService,
  ) {}

  public async createPost(userId: string, dto: CreateQuotePostDto, originalPostId?: string): Promise<QuotePostEntity> {
    this.logger.log(`Creating quote post for user ${userId}`);
    const quotePostData = {
      authorId: userId,
      postType: PostType.QUOTE,
      tags: dto.tags ? [...new Set(dto.tags.map(tag => tag.toLowerCase()))] : [],
      originalPostId: originalPostId ?? '',
      text: dto.text,
      author: dto.author,
    };

    const quotePostEntity = new QuotePostEntity(quotePostData);
    const savedQuotePost = await this.quotePostRepository.save(quotePostEntity);
    this.logger.log(`Quote post created with ID ${savedQuotePost.id}`);
    await this.postService.incrementUserPostCount(userId);

    return savedQuotePost;
  }

  public async findPostById(postId: string): Promise<QuotePostEntity> {
    this.logger.log(`Finding quote post by ID ${postId}`);
    const foundQuotePost = await this.quotePostRepository.findById(postId);
    if (!foundQuotePost) {
      this.logger.warn(`Quote post not found: ${postId}`);
      throw new NotFoundException(QUOTE_POST_NOT_FOUND);
    }
    if (foundQuotePost.postType !== PostType.QUOTE) {
      this.logger.warn(`Incorrect post type for quote post: ${postId}`);
      throw new BadRequestException(QUOTE_POST_DIFFERENT_TYPE);
    }

    return foundQuotePost;
  }

  public async exists(postId: string): Promise<boolean> {
    return this.quotePostRepository.exists(postId);
  }

  public async updatePostById(userId: string, postId: string, dto: UpdateQuotePostDto): Promise<QuotePostEntity> {
    this.logger.log(`Updating quote post ID ${postId} by user ${userId}`);
    const updatedQuotePost = await this.findPostById(postId);
    if (updatedQuotePost.postType !== PostType.QUOTE) {
      this.logger.warn(`Incorrect post type for quote post: ${postId}`);
      throw new BadRequestException(QUOTE_POST_DIFFERENT_TYPE);
    }
    if (updatedQuotePost.authorId !== userId) {
      this.logger.warn(`Unauthorized attempt to modify post by user ${userId}`);
      throw new UnauthorizedException(QUOTE_POST_MODIFY_PERMISSION);
    }

    if (dto.tags !== undefined) updatedQuotePost.tags = dto.tags;
    if (dto.postStatus !== undefined) updatedQuotePost.postStatus = dto.postStatus;
    if (dto.postedAt !== undefined) updatedQuotePost.postedAt = dto.postedAt;
    if (dto.text !== undefined) updatedQuotePost.text = dto.text;
    if (dto.author !== undefined) updatedQuotePost.author = dto.author;

    const savedUpdatedQuotePost = await this.quotePostRepository.update(postId, updatedQuotePost);
    this.logger.log(`Quote post updated ID: '${savedUpdatedQuotePost.id}'`);

    return savedUpdatedQuotePost;
  }

  public async deletePostById(userId: string, postId: string): Promise<QuotePostEntity> {
    this.logger.log(`Deleting quote post ID '${postId}' by user '${userId}'`);
    const deletedQuotePost = await this.findPostById(postId);
    if (deletedQuotePost.authorId !== userId) {
      this.logger.warn(`Unauthorized attempt to delete post by user '${userId}'`);
      throw new UnauthorizedException(QUOTE_POST_DELETE_PERMISSION);
    }

    const deletedPost = await this.quotePostRepository.deleteById(postId);
    this.logger.log(`Quote post deleted ID: '${deletedPost.id}'`);
    await this.postService.decrementUserPostCount(userId);

    return deletedPost;
  }

  public async repostPostById(userId: string, postId: string): Promise<QuotePostEntity> {
    this.logger.log(`Reposting quote post ID '${postId}' by user '${userId}'`);
    const repostQuotePost = await this.findPostById(postId);
    if (repostQuotePost.postType !== PostType.QUOTE) {
      this.logger.warn(`Incorrect post type for quote post: '${postId}'`);
      throw new BadRequestException(QUOTE_POST_DIFFERENT_TYPE);
    }
    if (repostQuotePost.authorId === userId) {
      this.logger.warn(`User '${userId}' attempted to repost own post`);
      throw new UnauthorizedException(QUOTE_POST_REPOST_AUTHOR);
    }

    if (await this.postService.existsRepostByUser(postId, userId)) {
      this.logger.warn(`Repost already exists for user '${userId}' and post '${postId}'`);
      throw new ConflictException(QUOTE_POST_REPOST_EXISTS);
    }

    const createQuotePostDto: CreateQuotePostDto = {
      tags: repostQuotePost.tags,
      author: repostQuotePost.author,
      text: repostQuotePost.text,
    }

    const repostedQuotePost = await this.createPost(userId, createQuotePostDto, repostQuotePost.id);
    await this.postService.incrementRepostCount(postId);
    this.logger.log(`Post reposted successfully ID: '${repostedQuotePost.id}'`);

    return repostedQuotePost;
  }
}
