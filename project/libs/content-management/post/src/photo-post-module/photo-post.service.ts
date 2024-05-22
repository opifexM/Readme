import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException
} from '@nestjs/common';
import { PhotoPostEntity, PhotoPostRepository } from '@project/content-core';
import { PostService } from '@project/post';
import { PostType } from '@project/shared-core';
import { CreatePhotoPostDto } from './dto/create-photo-post.dto';
import { UpdatePhotoPostDto } from './dto/update-photo-post.dto';
import {
  PHOTO_POST_DELETE_PERMISSION,
  PHOTO_POST_DIFFERENT_TYPE,
  PHOTO_POST_MODIFY_PERMISSION,
  PHOTO_POST_NOT_FOUND,
  PHOTO_POST_REPOST_AUTHOR,
  PHOTO_POST_REPOST_EXISTS
} from './photo-post.constant';

@Injectable()
export class PhotoPostService {
  private readonly logger = new Logger(PhotoPostService.name);

  constructor(
    @Inject('PhotoPostRepository') private readonly photoPostRepository: PhotoPostRepository,
    private readonly postService: PostService
  ) {
  }

  public async createPost(userId: string, dto: CreatePhotoPostDto, originalPostId?: string): Promise<PhotoPostEntity> {
    this.logger.log(`Creating photo post for user ${userId}`);
    const photoPostData = {
      authorId: userId,
      postType: PostType.PHOTO,
      tags: dto.tags ? [...new Set(dto.tags.map(tag => tag.toLowerCase()))] : [],
      originalPostId: originalPostId ?? '',
      url: dto.url
    };

    const photoPostEntity = new PhotoPostEntity(photoPostData);
    const savedPhotoPost = await this.photoPostRepository.save(photoPostEntity);
    this.logger.log(`Photo post created with ID ${savedPhotoPost.id}`);
    await this.postService.incrementUserPostCount(userId);

    return savedPhotoPost;
  }

  public async findPostById(postId: string): Promise<PhotoPostEntity> {
    this.logger.log(`Finding photo post by ID ${postId}`);
    const foundPhotoPost = await this.photoPostRepository.findById(postId);
    if (!foundPhotoPost) {
      this.logger.warn(`Photo post not found: ${postId}`);
      throw new NotFoundException(PHOTO_POST_NOT_FOUND);
    }
    if (foundPhotoPost.postType !== PostType.PHOTO) {
      this.logger.warn(`Incorrect post type for photo post: ${postId}`);
      throw new BadRequestException(PHOTO_POST_DIFFERENT_TYPE);
    }

    return foundPhotoPost;
  }

  public async exists(postId: string): Promise<boolean> {
    return this.photoPostRepository.exists(postId);
  }

  public async updatePostById(userId: string, postId: string, dto: UpdatePhotoPostDto): Promise<PhotoPostEntity> {
    this.logger.log(`Updating photo post ID ${postId} by user ${userId}`);
    const updatedPhotoPost = await this.findPostById(postId);
    if (updatedPhotoPost.postType !== PostType.PHOTO) {
      this.logger.warn(`Incorrect post type for photo post: ${postId}`);
      throw new BadRequestException(PHOTO_POST_DIFFERENT_TYPE);
    }
    if (updatedPhotoPost.authorId !== userId) {
      this.logger.warn(`Unauthorized attempt to modify post by user ${userId}`);
      throw new UnauthorizedException(PHOTO_POST_MODIFY_PERMISSION);
    }

    if (dto.tags !== undefined) updatedPhotoPost.tags = dto.tags;
    if (dto.postStatus !== undefined) updatedPhotoPost.postStatus = dto.postStatus;
    if (dto.postedAt !== undefined) updatedPhotoPost.postedAt = dto.postedAt;
    if (dto.url !== undefined) updatedPhotoPost.url = dto.url;

    const savedUpdatedPhotoPost = await this.photoPostRepository.update(postId, updatedPhotoPost);
    this.logger.log(`Photo post updated ID: '${savedUpdatedPhotoPost.id}'`);
    return savedUpdatedPhotoPost;
  }

  public async deletePostById(userId: string, postId: string): Promise<PhotoPostEntity> {
    this.logger.log(`Deleting photo post ID '${postId}' by user '${userId}'`);
    const deletedPhotoPost = await this.findPostById(postId);
    if (deletedPhotoPost.authorId !== userId) {
      this.logger.warn(`Unauthorized attempt to delete post by user '${userId}'`);
      throw new UnauthorizedException(PHOTO_POST_DELETE_PERMISSION);
    }

    const deletedPost = await this.photoPostRepository.deleteById(postId);
    this.logger.log(`Photo post deleted ID: '${deletedPost.id}'`);
    await this.postService.decrementUserPostCount(userId);

    return deletedPost;
  }

  public async repostPostById(userId: string, postId: string): Promise<PhotoPostEntity> {
    this.logger.log(`Reposting photo post ID '${postId}' by user '${userId}'`);
    const repostPhotoPost = await this.findPostById(postId);
    if (repostPhotoPost.postType !== PostType.PHOTO) {
      this.logger.warn(`Incorrect post type for photo post: '${postId}'`);
      throw new BadRequestException(PHOTO_POST_DIFFERENT_TYPE);
    }
    if (repostPhotoPost.authorId === userId) {
      this.logger.warn(`User '${userId}' attempted to repost own post`);
      throw new UnauthorizedException(PHOTO_POST_REPOST_AUTHOR);
    }

    if (await this.postService.existsRepostByUser(postId, userId)) {
      this.logger.warn(`Repost already exists for user '${userId}' and post '${postId}'`);
      throw new ConflictException(PHOTO_POST_REPOST_EXISTS);
    }

    const createPhotoPostDto: CreatePhotoPostDto = {
      tags: repostPhotoPost.tags,
      url: repostPhotoPost.url
    };

    const repostedPhotoPost = await this.createPost(userId, createPhotoPostDto, repostPhotoPost.id);
    await this.postService.incrementRepostCount(postId);
    this.logger.log(`Post reposted successfully ID: '${repostedPhotoPost.id}'`);

    return repostedPhotoPost;
  }
}

