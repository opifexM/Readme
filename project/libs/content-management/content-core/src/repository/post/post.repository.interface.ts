import { Repository } from '@project/data-access';
import { PostEntity } from '../../entity/post/post.entity';

export interface PostRepository extends Repository<PostEntity> {
  existsRepostByUser(originalPostId: PostEntity['id'], authorId: PostEntity['id']): Promise<boolean>;

  incrementRepostCount(postId: string): Promise<boolean>;

  incrementCommentCount(postId: string): Promise<boolean>;

  decrementCommentCount(postId: string): Promise<boolean>;

  likePost(postId: string, updatedUserLikeIds: string[]): Promise<PostEntity>;

  unlikePost(postId: string, updatedUserLikeIds: string[]): Promise<PostEntity>;
}
