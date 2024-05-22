import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException
} from '@nestjs/common';
import { LinkPostEntity, LinkPostRepository } from '@project/content-core';
import { PostService } from '@project/post';
import { PostType } from '@project/shared-core';
import { CreateLinkPostDto } from './dto/create-link-post.dto';
import { UpdateLinkPostDto } from './dto/update-link-post.dto';
import {
  LINK_POST_DELETE_PERMISSION,
  LINK_POST_DIFFERENT_TYPE,
  LINK_POST_MODIFY_PERMISSION,
  LINK_POST_NOT_FOUND,
  LINK_POST_REPOST_AUTHOR,
  LINK_POST_REPOST_EXISTS
} from './link-post.constant';

@Injectable()
export class LinkPostService {
  private readonly logger = new Logger(LinkPostService.name);

  constructor(
    @Inject('LinkPostRepository') private readonly linkPostRepository: LinkPostRepository,
    private readonly postService: PostService,
  ) {}

  public async createPost(userId: string, dto: CreateLinkPostDto, originalPostId?: string): Promise<LinkPostEntity> {
    this.logger.log(`Creating link post for user ${userId}`);
    const linkPostData = {
      authorId: userId,
      postType: PostType.LINK,
      tags: dto.tags ? [...new Set(dto.tags.map(tag => tag.toLowerCase()))] : [],
      originalPostId: originalPostId ?? '',
      url: dto.url,
      description: dto.description,
    };
    dto.tags.map((tag) => tag.toLowerCase())

    const linkPostEntity = new LinkPostEntity(linkPostData);
    const savedPost = await this.linkPostRepository.save(linkPostEntity);
    this.logger.log(`Link post created with ID ${savedPost.id}`);
    await this.postService.incrementUserPostCount(userId);

    return savedPost;
  }

  public async findPostById(postId: string): Promise<LinkPostEntity> {
    this.logger.log(`Finding link post by ID ${postId}`);
    const foundLinkPost = await this.linkPostRepository.findById(postId);
    if (!foundLinkPost) {
      this.logger.warn(`Link post not found: ${postId}`);
      throw new NotFoundException(LINK_POST_NOT_FOUND);
    }
    if (foundLinkPost.postType !== PostType.LINK) {
      this.logger.warn(`Incorrect post type for link post: ${postId}`);
      throw new BadRequestException(LINK_POST_DIFFERENT_TYPE);
    }

    return foundLinkPost;
  }

  public async exists(postId: string): Promise<boolean> {
    return this.linkPostRepository.exists(postId);
  }

  public async updatePostById(userId: string, postId: string, dto: UpdateLinkPostDto): Promise<LinkPostEntity> {
    this.logger.log(`Updating link post ID ${postId} by user ${userId}`);
    const updatedLinkPost = await this.findPostById(postId);
    if (updatedLinkPost.postType !== PostType.LINK) {
      this.logger.warn(`Incorrect post type for link post: ${postId}`);
      throw new BadRequestException(LINK_POST_DIFFERENT_TYPE);
    }
    if (updatedLinkPost.authorId !== userId) {
      this.logger.warn(`Unauthorized attempt to modify post by user ${userId}`);
      throw new UnauthorizedException(LINK_POST_MODIFY_PERMISSION);
    }

    if (dto.tags !== undefined) updatedLinkPost.tags = dto.tags;
    if (dto.postStatus !== undefined) updatedLinkPost.postStatus = dto.postStatus;
    if (dto.postedAt !== undefined) updatedLinkPost.postedAt = dto.postedAt;
    if (dto.url !== undefined) updatedLinkPost.url = dto.url;
    if (dto.description !== undefined) updatedLinkPost.description = dto.description;

    const savedUpdatedPost = await this.linkPostRepository.update(postId, updatedLinkPost);
    this.logger.log(`Link post updated ID: '${savedUpdatedPost.id}'`);

    return savedUpdatedPost;
  }

  public async deletePostById(userId: string, postId: string): Promise<LinkPostEntity> {
    this.logger.log(`Deleting link post ID '${postId}' by user '${userId}'`);
    const deletedLinkPost = await this.findPostById(postId);
    if (deletedLinkPost.authorId !== userId) {
      this.logger.warn(`Unauthorized attempt to delete post by user '${userId}'`);
      throw new UnauthorizedException(LINK_POST_DELETE_PERMISSION);
    }

    const deletedPost = await this.linkPostRepository.deleteById(postId);
    this.logger.log(`Link post deleted ID: '${deletedPost.id}'`);
    await this.postService.decrementUserPostCount(userId);

    return deletedPost;
  }

  public async repostPostById(userId: string, postId: string): Promise<LinkPostEntity> {
    this.logger.log(`Reposting link post ID '${postId}' by user '${userId}'`);
    const repostLinkPost = await this.findPostById(postId);
    if (repostLinkPost.postType !== PostType.LINK) {
      this.logger.warn(`Incorrect post type for link post: '${postId}'`);
      throw new BadRequestException(LINK_POST_DIFFERENT_TYPE);
    }
    if (repostLinkPost.authorId === userId) {
      this.logger.warn(`User '${userId}' attempted to repost own post`);
      throw new UnauthorizedException(LINK_POST_REPOST_AUTHOR);
    }

    if (await this.postService.existsRepostByUser(postId, userId)) {
      this.logger.warn(`Repost already exists for user '${userId}' and post '${postId}'`);
      throw new ConflictException(LINK_POST_REPOST_EXISTS);
    }

    const createLinkPostDto: CreateLinkPostDto = {
      tags: repostLinkPost.tags,
      url: repostLinkPost.url,
      description: repostLinkPost.description,
    }

    const repostedLinkPost = await this.createPost(userId, createLinkPostDto, repostLinkPost.id);
    await this.postService.incrementRepostCount(postId);
    this.logger.log(`Link post reposted successfully ID: '${repostedLinkPost.id}'`);

    return repostedLinkPost;
  }
}
