import { Injectable, Logger } from '@nestjs/common';
import { BasePostgresRepository } from '@project/data-access';
import { PrismaClientService } from '@project/prisma-client';
import { EntityFactory, StorableEntity } from '@project/shared-core';
import { PostEntity } from '../../entity/post/post.entity';
import { PostRepository } from './post.repository.interface';

@Injectable()
export class PostPostgresRepository<T extends PostEntity & StorableEntity<ReturnType<T['toPOJO']>>> extends BasePostgresRepository<T> implements PostRepository {
  private readonly postLogger = new Logger(PostPostgresRepository.name);

  constructor(
    entityFactory: EntityFactory<T>,
    client: PrismaClientService
  ) {
    super(entityFactory, client);
  }

  public async save(entity: PostEntity): Promise<PostEntity> {
    throw new Error('Not implemented');
  }

  public async findById(postId: PostEntity['id']): Promise<PostEntity | null> {
    this.postLogger.log(`Finding post by ID: '${postId}'`);
    const post = await this.client.post.findFirst({
      where: { id: postId }
    });

    return this.createEntityFromDocument(post);
  }

  public async deleteById(postId: PostEntity['id']): Promise<PostEntity> {
    this.postLogger.log(`Deleting post by ID: '${postId}'`);
    const deletedComment = await this.client.post.delete({
      where: { id: postId }
    });

    return this.createEntityFromDocument(deletedComment);
  }

  public async update(id: PostEntity['id'], entity: PostEntity): Promise<PostEntity> {
    throw new Error('Not implemented');
  }

  public async exists(postId: PostEntity['id']): Promise<boolean> {
    this.postLogger.log(`Checking existence of post by ID: '${postId}'`);
    const post = await this.client.post.findUnique({
      where: { id: postId },
      select: { id: true }
    });

    return post !== null;
  }

  public async existsRepostByUser(originalPostId: PostEntity['id'], authorId: PostEntity['id']): Promise<boolean> {
    this.postLogger.log(`Checking for repost by user ID: '${authorId}' for original post ID: '${originalPostId}'`);
    const post = await this.client.post.findFirst({
      where: {
        originalPostId: originalPostId,
        authorId: authorId
      },
      select: { id: true }
    });

    return post !== null;
  }

  public async incrementRepostCount(postId: string): Promise<boolean> {
    this.postLogger.log(`Incrementing repost count for post ID: '${postId}'`);
    const incrementedPost = await this.client.post.update({
      where: { id: postId },
      data: {
        repostCount: { increment: 1 }
      }
    });

    return incrementedPost !== null;
  }

  public async incrementCommentCount(postId: string): Promise<boolean> {
    this.postLogger.log(`Incrementing comment count for post ID: '${postId}'`);
    const incrementedPost = await this.client.post.update({
      where: { id: postId },
      data: {
        commentCount: { increment: 1 }
      }
    });

    return incrementedPost !== null;
  }

  public async decrementCommentCount(postId: string): Promise<boolean> {
    this.postLogger.log(`Decrementing comment count for post ID: '${postId}'`);
    const incrementedPost = await this.client.post.update({
      where: { id: postId },
      data: {
        commentCount: { decrement: 1 }
      }
    });

    return incrementedPost !== null;
  }

  public async likePost(postId: string, updatedUserLikeIds: string[]): Promise<PostEntity> {
    this.postLogger.log(`Liking post ID: '${postId}'`);
    const likedPost = await this.client.post.update({
      where: { id: postId },
      data: {
        likeCount: { increment: 1 },
        userLikeIds: { set: updatedUserLikeIds }
      }
    });

    return this.createEntityFromDocument(likedPost);
  }

  public async unlikePost(postId: string, updatedUserLikeIds: string[]): Promise<PostEntity> {
    this.postLogger.log(`Unliking post ID: '${postId}'`);
    const unlikedPost = await this.client.post.update({
      where: { id: postId },
      data: {
        likeCount: { decrement: 1 },
        userLikeIds: { set: updatedUserLikeIds }
      }
    });

    return this.createEntityFromDocument(unlikedPost);
  }
}
