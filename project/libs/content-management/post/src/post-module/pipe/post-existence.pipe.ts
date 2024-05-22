import { ArgumentMetadata, Injectable, Logger, NotFoundException, PipeTransform } from '@nestjs/common';
import { PostService } from '../post.service';

@Injectable()
export class PostExistencePipe implements PipeTransform {
  private readonly logger = new Logger(PostExistencePipe.name);

  constructor(
    private readonly postService: PostService
  ) {
  }

  public async transform(postId: string, metadata: ArgumentMetadata): Promise<string> {
    this.logger.log(`Starting existence check for post with ID: ${postId}`);

    const foundPost = await this.postService.findPostById(postId);
    if (!foundPost) {
      this.logger.warn(`Post with ID ${postId} not found`);
      throw new NotFoundException(`Post with ID ${postId} not found`);
    }
    this.logger.log(`Post with ID ${postId} exists`);

    return postId;
  }
}
