import { Repository } from '@project/data-access';
import { VideoPostEntity } from '../../entity/video/video-post.entity';
import { VideoPostWithDetails } from './video-post-postgres.repository';

export interface VideoPostRepository extends Repository<VideoPostEntity> {
  convertToVideoPostEntity(createdVideoPost: VideoPostWithDetails | null): VideoPostEntity;
}
