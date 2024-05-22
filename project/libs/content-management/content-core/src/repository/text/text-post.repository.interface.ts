import { Repository } from '@project/data-access';
import { TextPostEntity } from '../../entity/text/text-post.entity';
import { TextPostWithDetails } from './text-post-postgres.repository';

export interface TextPostRepository extends Repository<TextPostEntity> {
  convertToTextPostEntity(createdTextPost: TextPostWithDetails | null): TextPostEntity;
}
