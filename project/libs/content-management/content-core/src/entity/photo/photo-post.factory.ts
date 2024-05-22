import { Injectable } from '@nestjs/common';
import { EntityFactory, PhotoPost } from '@project/shared-core';
import { PhotoPostEntity } from './photo-post.entity';

@Injectable()
export class PhotoPostFactory implements EntityFactory<PhotoPostEntity> {
  public create(entityPlainData: PhotoPost): PhotoPostEntity {
    return new PhotoPostEntity(entityPlainData)
  }
}
