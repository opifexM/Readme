import { Injectable } from '@nestjs/common';
import { EntityFactory, LinkPost } from '@project/shared-core';
import { LinkPostEntity } from './link-post.entity';

@Injectable()
export class LinkPostFactory implements EntityFactory<LinkPostEntity> {
  public create(entityPlainData: LinkPost): LinkPostEntity {
    return new LinkPostEntity(entityPlainData)
  }
}
