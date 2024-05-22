import { Repository } from '@project/data-access';
import { PhotoPostEntity } from '../../entity/photo/photo-post.entity';
import { PhotoPostWithDetails } from './photo-post-postgres.repository';

export interface PhotoPostRepository extends Repository<PhotoPostEntity> {
  convertToPhotoPostEntity(createdPhotoPost: PhotoPostWithDetails | null): PhotoPostEntity;
}
