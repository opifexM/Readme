import { Injectable } from '@nestjs/common';
import { BaseMemoryRepository } from '@project/data-access';
import { EntityFactory, StorableEntity } from '@project/shared-core';
import { PostEntity } from '../../entity/post/post.entity';
import { PostRepository } from './post.repository.interface';

@Injectable()
export abstract class PostMemoryRepository<T extends PostEntity & StorableEntity<ReturnType<T['toPOJO']>>> extends BaseMemoryRepository<T> implements PostRepository {
  protected constructor(entityFactory: EntityFactory<T>) {
    super(entityFactory);
  }

  existsRepostByUser(originalPostId: PostEntity["id"], authorId: PostEntity["id"]): Promise<boolean> {
    throw new Error('Not implemented');
  }

  decrementCommentCount(postId: string): Promise<boolean> {
    throw new Error('Not implemented');
  }

  incrementCommentCount(postId: string): Promise<boolean> {
    throw new Error('Not implemented');
  }

  incrementRepostCount(postId: string): Promise<boolean> {
    throw new Error('Not implemented');
  }

  likePost(postId: string, updatedUserLikeIds: string[]): Promise<PostEntity> {
    throw new Error('Not implemented');
  }

  unlikePost(postId: string, updatedUserLikeIds: string[]): Promise<PostEntity> {
    throw new Error('Not implemented');
  }
}
