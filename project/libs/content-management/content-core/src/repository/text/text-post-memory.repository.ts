import { Injectable } from '@nestjs/common';
import { TextPostEntity } from '../../entity/text/text-post.entity';
import { TextPostFactory } from '../../entity/text/text-post.factory';
import { PostMemoryRepository } from '../post/post-memory.repository';
import { TextPostWithDetails } from './text-post-postgres.repository';
import { TextPostRepository } from './text-post.repository.interface';

@Injectable()
export class TextPostMemoryRepository extends PostMemoryRepository<TextPostEntity> implements TextPostRepository {
  constructor(entityFactory: TextPostFactory) {
    super(entityFactory);
  }

  public convertToTextPostEntity(createdTextPost: TextPostWithDetails | null): TextPostEntity {
    throw new Error('Not implemented');
  }
}
