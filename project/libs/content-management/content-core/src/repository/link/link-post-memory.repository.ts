import { Injectable } from '@nestjs/common';
import { LinkPostEntity } from '../../entity/link/link-post.entity';
import { LinkPostFactory } from '../../entity/link/link-post.factory';
import { PostMemoryRepository } from '../post/post-memory.repository';
import { LinkPostWithDetails } from './link-post-postgres.repository';
import { LinkPostRepository } from './link-post.repository.interface';

@Injectable()
export class LinkPostMemoryRepository extends PostMemoryRepository<LinkPostEntity> implements LinkPostRepository {
  constructor(entityFactory: LinkPostFactory) {
    super(entityFactory);
  }

  public convertToLinkPostEntity(createdLinkPost: LinkPostWithDetails | null): LinkPostEntity {
    throw new Error('Not implemented');
  }
}
