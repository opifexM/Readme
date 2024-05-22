import { Injectable } from '@nestjs/common';
import { EntityFactory, QuotePost } from '@project/shared-core';
import { QuotePostEntity } from './quote-post.entity';

@Injectable()
export class QuotePostFactory implements EntityFactory<QuotePostEntity> {
  public create(entityPlainData: QuotePost): QuotePostEntity {
    return new QuotePostEntity(entityPlainData)
  }
}
