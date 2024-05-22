import { Injectable } from '@nestjs/common';
import { EntityFactory, VideoPost } from '@project/shared-core';
import { VideoPostEntity } from './video-post.entity';

@Injectable()
export class VideoPostFactory implements EntityFactory<VideoPostEntity> {
  public create(entityPlainData: VideoPost): VideoPostEntity {
    return new VideoPostEntity(entityPlainData)
  }
}
