import { Injectable } from '@nestjs/common';
import { PhotoPostEntity } from '../../entity/photo/photo-post.entity';
import { PhotoPostFactory } from '../../entity/photo/photo-post.factory';
import { PostMemoryRepository } from '../post/post-memory.repository';
import { PhotoPostWithDetails } from './photo-post-postgres.repository';
import { PhotoPostRepository } from './photo-post.repository.interface';

@Injectable()
export class PhotoPostMemoryRepository extends PostMemoryRepository<PhotoPostEntity> implements PhotoPostRepository {
  constructor(entityFactory: PhotoPostFactory) {
    super(entityFactory);
  }

  public convertToPhotoPostEntity(createdPhotoPost: PhotoPostWithDetails | null): PhotoPostEntity {
    throw new Error('Not implemented');
  }
}
