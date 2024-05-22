import { Repository } from '@project/data-access';
import { QuotePostEntity } from '../../entity/quote/quote-post.entity';
import { QuotePostWithDetails } from './quote-post-postgres.repository';

export interface QuotePostRepository extends Repository<QuotePostEntity> {
  convertToQuotePostEntity(createdQuotePost: QuotePostWithDetails | null): QuotePostEntity;
}
