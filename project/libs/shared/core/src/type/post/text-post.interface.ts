import { Post } from './post.interface';

export interface TextPost extends Post {
  title: string;
  announcement: string;
  text: string;
}
