import { CommentQuery } from '@project/comment';
import { Repository } from '@project/data-access';
import { PaginationResult } from '@project/shared-core';
import { CommentEntity } from '../../entity/comment/comment.entity';

export interface CommentRepository extends Repository<CommentEntity> {
  findAllByPostId(
    postId: string,
    { limit, sortDirection, page }: CommentQuery
  ): Promise<PaginationResult<CommentEntity>>;
}
