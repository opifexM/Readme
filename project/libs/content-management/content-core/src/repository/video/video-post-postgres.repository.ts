import { Injectable, Logger } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaClientService } from '@project/prisma-client';
import { EntityFactory, PostStatus, PostType } from '@project/shared-core';
import { VideoPostEntity } from '../../entity/video/video-post.entity';
import { PostPostgresRepository } from '../post/post-postgres.repository';
import { VideoPostRepository } from './video-post.repository.interface';

export type VideoPostWithDetails = Prisma.PostGetPayload<{
  include: { videoDetails: true };
}>;

@Injectable()
export class VideoPostPostgresRepository extends PostPostgresRepository<VideoPostEntity> implements VideoPostRepository {
  private readonly logger = new Logger(VideoPostPostgresRepository.name);

  constructor(
    entityFactory: EntityFactory<VideoPostEntity>,
    client: PrismaClientService
  ) {
    super(entityFactory, client);
  }

  private formatPostForPrisma(videoPostEntity: VideoPostEntity) {
    return {
      ...videoPostEntity,
      _id: undefined,
      id: undefined,
      title: undefined,
      url: undefined,
    };
  }

  public convertToVideoPostEntity(createdVideoPost: VideoPostWithDetails | null): VideoPostEntity {
    if (!createdVideoPost) {
      return null;
    }

    const videoPostEntityData = {
      ...createdVideoPost,
      postStatus: createdVideoPost.postStatus as PostStatus,
      postType: createdVideoPost.postType as PostType,
      title: createdVideoPost.videoDetails?.title,
      url: createdVideoPost.videoDetails?.url
    };

    return this.createEntityFromDocument(videoPostEntityData);
  }

  public async save(videoPostEntity: VideoPostEntity): Promise<VideoPostEntity> {
    this.logger.log('Attempting to save new video post');
    const videoPostData = this.formatPostForPrisma(videoPostEntity);

    const createdVideoPost = await this.client.post.create({
      data: {
        ...videoPostData,
        videoDetails: {
          create: {
            title: videoPostEntity.title,
            url: videoPostEntity.url
          }
        }
      },
      include: { videoDetails: true }
    });

    this.logger.log(`Video post saved with ID: '${createdVideoPost.id}'`);
    return this.convertToVideoPostEntity(createdVideoPost);
  }

  public async update(postId: VideoPostEntity['id'], videoPostEntity: VideoPostEntity): Promise<VideoPostEntity> {
    this.logger.log(`Updating video post ID: '${postId}'`);
    const videoPostData = this.formatPostForPrisma(videoPostEntity);

    const updatedVideoPost = await this.client.post.update({
      where: { id: postId },
      data: {
        ...videoPostData,
        videoDetails: {
          update: {
            title: videoPostEntity.title,
            url: videoPostEntity.url
          }
        }
      },
      include: { videoDetails: true }
    });
    this.logger.log(`Video post updated with ID: '${updatedVideoPost.id}'`);

    return this.convertToVideoPostEntity(updatedVideoPost);
  }

  public async findById(postId: VideoPostEntity['id']): Promise<VideoPostEntity | null> {
    this.logger.log(`Finding video post by ID: '${postId}'`);
    const videoPostData = await this.client.post.findUnique({
      where: { id: postId },
      include: { videoDetails: true }
    });

    return this.convertToVideoPostEntity(videoPostData);
  }

  public async deleteById(id: VideoPostEntity['id']): Promise<VideoPostEntity> {
    this.logger.log(`Deleting video post ID: '${id}'`);
    const deletedPost = await this.client.post.delete({
      where: { id },
      include: { videoDetails: true }
    });
    this.logger.log(`Video post deleted with ID: '${deletedPost.id}'`);

    return this.convertToVideoPostEntity(deletedPost);
  }

  public async exists(videoPostId: VideoPostEntity['id']): Promise<boolean> {
    this.logger.log(`Checking existence of video post ID: '${videoPostId}'`);
    const videoPost = await this.client.videoPost.findUnique({
      where: { id: videoPostId },
      select: { id: true }
    });

    return videoPost !== null;
  }
}
