import { Injectable } from '@nestjs/common';
import { VideoPostEntity } from '../../entity/video/video-post.entity';
import { VideoPostFactory } from '../../entity/video/video-post.factory';
import { PostMemoryRepository } from '../post/post-memory.repository';
import { VideoPostWithDetails } from './video-post-postgres.repository';
import { VideoPostRepository } from './video-post.repository.interface';

@Injectable()
export class VideoPostMemoryRepository extends PostMemoryRepository<VideoPostEntity> implements VideoPostRepository {
  constructor(entityFactory: VideoPostFactory) {
    super(entityFactory);
  }

  public convertToVideoPostEntity(createdVideoPost: VideoPostWithDetails | null): VideoPostEntity {
    throw new Error('Not implemented');
  }
}
