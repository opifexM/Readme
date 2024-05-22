import { Repository } from '@project/data-access';
import { LinkPostEntity } from '../../entity/link/link-post.entity';
import { LinkPostWithDetails } from './link-post-postgres.repository';

export interface LinkPostRepository extends Repository<LinkPostEntity> {
  convertToLinkPostEntity(createdLinkPost: LinkPostWithDetails | null): LinkPostEntity;
}
