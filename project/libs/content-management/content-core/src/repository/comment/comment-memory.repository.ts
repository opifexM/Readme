import { Injectable } from '@nestjs/common';
import { CommentQuery } from '@project/comment';
import { BaseMemoryRepository } from '@project/data-access';
import { PaginationResult } from '@project/shared-core';
import { CommentEntity } from '../../entity/comment/comment.entity';
import { CommentFactory } from '../../entity/comment/comment.factory';
import { CommentRepository } from './comment.repository.interface';

@Injectable()
export class CommentMemoryRepository extends BaseMemoryRepository<CommentEntity> implements CommentRepository {
  constructor(entityFactory: CommentFactory) {
    super(entityFactory);
  }

  public async findAllByPostId(postId: string, { limit, sortDirection, page }: CommentQuery): Promise<PaginationResult<CommentEntity>> {
    throw new Error('Not implemented');
  }
}
