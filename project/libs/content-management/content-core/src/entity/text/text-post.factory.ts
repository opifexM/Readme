import { Injectable } from '@nestjs/common';
import { EntityFactory, TextPost } from '@project/shared-core';
import { TextPostEntity } from './text-post.entity';

@Injectable()
export class TextPostFactory implements EntityFactory<TextPostEntity> {
  public create(entityPlainData: TextPost): TextPostEntity {
    return new TextPostEntity(entityPlainData)
  }
}
