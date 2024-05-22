import { ArgumentMetadata, ConflictException, Injectable, Logger, PipeTransform } from '@nestjs/common';
import { PostStatus } from '@project/shared-core';
import { POST_NOT_PUBLISHED } from '../post.constant';
import { PostService } from '../post.service';

@Injectable()
export class PostPublishedStatusPipe implements PipeTransform {
  private readonly logger = new Logger(PostPublishedStatusPipe.name);

  constructor(
    private readonly postService: PostService
  ) {}

  public async transform(postId: string, metadata: ArgumentMetadata): Promise<string> {
    this.logger.log(`Starting published status check for post with ID: ${postId}`);

    const foundPost = await this.postService.findPostById(postId);
    if (foundPost.postStatus !== PostStatus.PUBLISHED) {
      this.logger.warn(`Post with ID ${postId} is not published`);
      throw new ConflictException(POST_NOT_PUBLISHED);
    }
    this.logger.log(`Post with ID ${postId} is published`);

    return postId;
  }
}
