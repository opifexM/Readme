import { PostStatus } from './post-status.enum';
import { PostType } from './post-type.enum';

export interface Post {
  id?: string;
  tags?: string[];
  authorId?: string;
  postedAt?: Date;
  createdAt?: Date;
  postStatus?: PostStatus;
  originalPostId?: string;
  postType: PostType;
  userLikeIds?: string[];
  likeCount?: number;
  commentCount?: number;
  repostCount?: number;
}
