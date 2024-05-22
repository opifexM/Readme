import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException
} from '@nestjs/common';
import { VideoPostEntity, VideoPostRepository } from '@project/content-core';
import { PostService } from '@project/post';
import { PostType } from '@project/shared-core';
import { CreateVideoPostDto } from './dto/create-video-post.dto';
import { UpdateVideoPostDto } from './dto/update-video-post.dto';
import {
  VIDEO_POST_DELETE_PERMISSION,
  VIDEO_POST_DIFFERENT_TYPE,
  VIDEO_POST_MODIFY_PERMISSION,
  VIDEO_POST_NOT_FOUND,
  VIDEO_POST_REPOST_AUTHOR,
  VIDEO_POST_REPOST_EXISTS
} from './video-post.constant';

@Injectable()
export class VideoPostService {
  private readonly logger = new Logger(VideoPostService.name);

  constructor(
    @Inject('VideoPostRepository') private readonly videoPostRepository: VideoPostRepository,
    private readonly postService: PostService
  ) {
  }

  public async createPost(userId: string, dto: CreateVideoPostDto, originalPostId?: string): Promise<VideoPostEntity> {
    this.logger.log(`Creating video post for user ${userId}`);
    const videoPostData = {
      authorId: userId,
      postType: PostType.VIDEO,
      tags: dto.tags ? [...new Set(dto.tags.map(tag => tag.toLowerCase()))] : [],
      originalPostId: originalPostId ?? '',
      title: dto.title,
      url: dto.url
    };

    const videoPostEntity = new VideoPostEntity(videoPostData);
    const savedVideoPost = await this.videoPostRepository.save(videoPostEntity);
    this.logger.log(`Video post created with ID ${savedVideoPost.id}`);
    await this.postService.incrementUserPostCount(userId);

    return savedVideoPost;
  }

  public async findPostById(postId: string): Promise<VideoPostEntity> {
    this.logger.log(`Finding video post by ID ${postId}`);
    const foundVidePost = await this.videoPostRepository.findById(postId);
    if (!foundVidePost) {
      this.logger.warn(`Video post not found: ${postId}`);
      throw new NotFoundException(VIDEO_POST_NOT_FOUND);
    }
    if (foundVidePost.postType !== PostType.VIDEO) {
      this.logger.warn(`Incorrect post type for video post: ${postId}`);
      throw new BadRequestException(VIDEO_POST_DIFFERENT_TYPE);
    }

    return foundVidePost;
  }

  public async exists(postId: string): Promise<boolean> {
    return this.videoPostRepository.exists(postId);
  }

  public async updatePostById(userId: string, postId: string, dto: UpdateVideoPostDto): Promise<VideoPostEntity> {
    this.logger.log(`Updating video post ID ${postId} by user ${userId}`);
    const updatedVideoPost = await this.findPostById(postId);
    if (updatedVideoPost.postType !== PostType.VIDEO) {
      this.logger.warn(`Incorrect post type for video post: ${postId}`);
      throw new BadRequestException(VIDEO_POST_DIFFERENT_TYPE);
    }
    if (updatedVideoPost.authorId !== userId) {
      this.logger.warn(`Unauthorized attempt to modify post by user ${userId}`);
      throw new UnauthorizedException(VIDEO_POST_MODIFY_PERMISSION);
    }

    if (dto.tags !== undefined) updatedVideoPost.tags = dto.tags;
    if (dto.postStatus !== undefined) updatedVideoPost.postStatus = dto.postStatus;
    if (dto.postedAt !== undefined) updatedVideoPost.postedAt = dto.postedAt;
    if (dto.title !== undefined) updatedVideoPost.title = dto.title;
    if (dto.url !== undefined) updatedVideoPost.url = dto.url;

    const savedUpdatedVideoPost = await this.videoPostRepository.update(postId, updatedVideoPost);
    this.logger.log(`Video post updated ID: '${savedUpdatedVideoPost.id}'`);

    return savedUpdatedVideoPost;
  }

  public async deletePostById(userId: string, postId: string): Promise<VideoPostEntity> {
    this.logger.log(`Deleting video post ID '${postId}' by user '${userId}'`);
    const deletedVideoPost = await this.findPostById(postId);
    if (deletedVideoPost.authorId !== userId) {
      this.logger.warn(`Unauthorized attempt to delete post by user '${userId}'`);
      throw new UnauthorizedException(VIDEO_POST_DELETE_PERMISSION);
    }

    const deletedPost = await this.videoPostRepository.deleteById(postId);
    this.logger.log(`Video post deleted ID: '${deletedPost.id}'`);
    await this.postService.decrementUserPostCount(userId);

    return deletedPost;
  }

  public async repostPostById(userId: string, postId: string): Promise<VideoPostEntity> {
    this.logger.log(`Reposting video post ID '${postId}' by user '${userId}'`);
    const repostVideoPost = await this.findPostById(postId);
    if (repostVideoPost.postType !== PostType.VIDEO) {
      this.logger.warn(`Incorrect post type for video post: '${postId}'`);
      throw new BadRequestException(VIDEO_POST_DIFFERENT_TYPE);
    }
    if (repostVideoPost.authorId === userId) {
      this.logger.warn(`User '${userId}' attempted to repost own post`);
      throw new UnauthorizedException(VIDEO_POST_REPOST_AUTHOR);
    }

    if (await this.postService.existsRepostByUser(postId, userId)) {
      this.logger.warn(`Repost already exists for user '${userId}' and post '${postId}'`);
      throw new ConflictException(VIDEO_POST_REPOST_EXISTS);
    }

    const createVideoPostDto: CreateVideoPostDto = {
      tags: repostVideoPost.tags,
      title: repostVideoPost.title,
      url: repostVideoPost.url
    };

    const repostedVideoPost = await this.createPost(userId, createVideoPostDto, repostVideoPost.id);
    await this.postService.incrementRepostCount(postId);
    this.logger.log(`Video post reposted successfully ID: '${repostedVideoPost.id}'`);

    return repostedVideoPost;
  }
}
