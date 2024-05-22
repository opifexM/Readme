import { Inject, Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaClientService } from '@project/prisma-client';
import { AggregatePostRdo, PostSearchQuery } from '@project/search';
import { PaginationResult, PostType, SortType } from '@project/shared-core';
import { LinkPostRepository } from '../link/link-post.repository.interface';
import { PhotoPostRepository } from '../photo/photo-post.repository.interface';
import { QuotePostRepository } from '../quote/quote-post.repository.interface';
import { TextPostRepository } from '../text/text-post.repository.interface';
import { VideoPostRepository } from '../video/video-post.repository.interface';
import { SearchRepository } from './search.repository.interface';

@Injectable()
export class SearchPostgresRepository implements SearchRepository {
  private readonly logger = new Logger(SearchPostgresRepository.name);

  constructor(
    protected readonly client: PrismaClientService,
    @Inject('LinkPostRepository') private readonly linkPostRepository: LinkPostRepository,
    @Inject('PhotoPostRepository') private readonly photoPostRepository: PhotoPostRepository,
    @Inject('QuotePostRepository') private readonly quotePostRepository: QuotePostRepository,
    @Inject('TextPostRepository') private readonly textPostRepository: TextPostRepository,
    @Inject('VideoPostRepository') private readonly videoPostRepository: VideoPostRepository
  ) {
  }

  public async searchPosts(
    { page, limit, title, authorIds, postType, tags, sortDirection, sortType, postStatus, postDate }: PostSearchQuery
  ): Promise<PaginationResult<AggregatePostRdo>> {

    const where: Prisma.PostWhereInput = {};
    if (authorIds.length > 0) {
      where.authorId = { in: authorIds };
    }
    if (postStatus) {
      where.postStatus = postStatus;
    }
    if (postType) {
      where.postType = postType;
    }
    if (tags.length) {
      where.tags = { hasSome: tags };
    }
    if (title) {
      where.OR = [
        {
          videoDetails: {
            title: {
              contains: title,
              mode: 'insensitive'
            }
          }
        },
        {
          textDetails: {
            title: {
              contains: title,
              mode: 'insensitive'
            }
          }
        }
      ];
    }
    if (postDate) {
      where.postedAt = { gt: postDate };
    }
    this.logger.log(`Starting search with parameters: '${JSON.stringify(where)}'`);

    const orderBy: Prisma.PostOrderByWithRelationInput = {};
    switch (sortType) {
      case SortType.BY_DATE:
        orderBy.createdAt = sortDirection;
        break;
      case SortType.BY_COMMENT:
        orderBy.commentCount = sortDirection;
        break;
      case SortType.BY_LIKE:
        orderBy.likeCount = sortDirection;
        break;
    }
    this.logger.log(`Executing search query on database`);

    const [posts, postsCount] = await Promise.all([
      this.client.post.findMany({
        where: where,
        orderBy: orderBy,
        skip: (page - 1) * limit,
        take: limit,
        include: {
          linkDetails: true,
          quoteDetails: true,
          photoDetails: true,
          textDetails: true,
          videoDetails: true
        }
      }),
      this.client.post.count({ where: where })
    ]);
    this.logger.log(`Search query completed with total found items: ${postsCount}`);

    return {
      entities: posts.map(post => {
        switch (post.postType) {
          case PostType.LINK:
            return this.linkPostRepository.convertToLinkPostEntity(post);
          case PostType.PHOTO:
            return this.photoPostRepository.convertToPhotoPostEntity(post);
          case PostType.QUOTE:
            return this.quotePostRepository.convertToQuotePostEntity(post);
          case PostType.TEXT:
            return this.textPostRepository.convertToTextPostEntity(post);
          case PostType.VIDEO:
            return this.videoPostRepository.convertToVideoPostEntity(post);
          default:
            this.logger.error('Unrecognized post type encountered');
            throw new InternalServerErrorException('Unrecognized post type:', post.postType);
        }
      }),
      totalPages: Math.ceil(postsCount / limit),
      currentPage: page,
      totalItems: postsCount,
      itemsPerPage: limit
    };
  }
}
