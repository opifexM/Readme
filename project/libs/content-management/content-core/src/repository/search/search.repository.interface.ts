import { AggregatePostRdo, PostSearchQuery } from '@project/search';
import { PaginationResult } from '@project/shared-core';

export interface SearchRepository {
  searchPosts(postQuery: PostSearchQuery): Promise<PaginationResult<AggregatePostRdo>>;
}
