import { Injectable } from '@nestjs/common';
import { QuotePostEntity } from '../../entity/quote/quote-post.entity';
import { QuotePostFactory } from '../../entity/quote/quote-post.factory';
import { PostMemoryRepository } from '../post/post-memory.repository';
import { QuotePostWithDetails } from './quote-post-postgres.repository';
import { QuotePostRepository } from './quote-post.repository.interface';

@Injectable()
export class QuotePostMemoryRepository extends PostMemoryRepository<QuotePostEntity> implements QuotePostRepository {
  constructor(entityFactory: QuotePostFactory) {
    super(entityFactory);
  }

  public convertToQuotePostEntity(createdQuotePost: QuotePostWithDetails | null): QuotePostEntity {
    throw new Error('Not implemented');
  }
}
