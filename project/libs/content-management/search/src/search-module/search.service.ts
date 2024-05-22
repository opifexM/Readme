import { HttpService } from '@nestjs/axios';
import { BadRequestException, Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { ApplicationConfig } from '@project/content-config';
import { SearchRepository } from '@project/content-core';
import { AggregatePostRdo } from '@project/search';
import { PaginationResult, PostStatus, SortDirection, SortType } from '@project/shared-core';
import { PostSearchQuery } from './post-search.query';
import { DATE_FOR_POST_SEARCH_NOT_FOUND, SUBSCRIPTION_NOT_FOUND } from './search.constant';

@Injectable()
export class SearchService {
  private readonly logger = new Logger(SearchService.name);
  private readonly defaultPage = 1;

  constructor(
    private readonly httpService: HttpService,
    @Inject('SearchRepository') private readonly postRepository: SearchRepository,
    @Inject(ApplicationConfig.KEY) private readonly applicationConfig: ConfigType<typeof ApplicationConfig>
  ) {
  }

  public async findNewPostsByDate(searchQuery?: PostSearchQuery): Promise<PaginationResult<AggregatePostRdo>> {
    if (!searchQuery?.postDate) {
      throw new BadRequestException(DATE_FOR_POST_SEARCH_NOT_FOUND);
    }
    this.logger.log(`Searching for new posts on date ${searchQuery.postDate}`);
    searchQuery.authorIds = [];
    searchQuery.postStatus = PostStatus.PUBLISHED;

    return this.findPosts(searchQuery);
  }

  public async findPersonalFeedPosts(userId: string, searchQuery?: PostSearchQuery): Promise<PaginationResult<AggregatePostRdo>> {
    this.logger.log(`Loading subscriptionIds for user: '${userId}'`);
    const { data } = await this.httpService.axiosRef
      .get(`${this.applicationConfig.serviceUrlUser}/subscription`, { params: { userId } });
    const subscriptionIds = data?.subscriptionIds;

    this.logger.log(`Searching personal feed posts for subscriptionIds: ${subscriptionIds.join(', ')}`);
    if (!subscriptionIds) {
      this.logger.warn('Subscription not found');
      throw new NotFoundException(SUBSCRIPTION_NOT_FOUND);
    }
    if (!searchQuery) {
      searchQuery = new PostSearchQuery();
    }

    searchQuery.authorIds = subscriptionIds;
    searchQuery.postStatus = PostStatus.PUBLISHED;

    return this.findPosts(searchQuery);
  }

  public async findUserSearchPosts(userId: string, searchQuery?: PostSearchQuery): Promise<PaginationResult<AggregatePostRdo>> {
    this.logger.log(`Searching posts by user id ${userId}`);
    if (!searchQuery) {
      searchQuery = new PostSearchQuery();
    }
    searchQuery.authorIds = searchQuery?.authorIds ?? [userId];
    if (searchQuery.authorIds.length > 1 || searchQuery.authorIds[0] !== userId) {
      searchQuery.postStatus = PostStatus.PUBLISHED;
    }

    return this.findPosts(searchQuery);
  }

  public async findPublicPosts(searchQuery?: PostSearchQuery): Promise<PaginationResult<AggregatePostRdo>> {
    this.logger.log('Searching public posts');
    if (!searchQuery) {
      searchQuery = new PostSearchQuery();
    }
    searchQuery.authorIds = [];
    searchQuery.postStatus = PostStatus.PUBLISHED;

    return this.findPosts(searchQuery);
  }

  private async findPosts(searchQuery?: PostSearchQuery): Promise<PaginationResult<AggregatePostRdo>> {
    this.logger.log(`Finding posts with query parameters: ${JSON.stringify(searchQuery)}`);
    const limit = Math.min(searchQuery?.limit ?? Number.MAX_VALUE, this.applicationConfig.defaultPostCountLimit);
    const page = searchQuery?.page ?? this.defaultPage;
    const sortDirection = searchQuery?.sortDirection ?? SortDirection.DESC;
    const sortType = searchQuery?.sortType ?? SortType.BY_DATE;
    const authorIds = searchQuery?.authorIds;
    const postStatus = searchQuery?.postStatus;
    const postType = searchQuery?.postType;
    const tags = (searchQuery?.tags ?? []).map(tag => tag.toLowerCase());
    const title = searchQuery?.title ? searchQuery.title.toLowerCase(): undefined;
    const postDate = searchQuery?.postDate;

    const searchResults = await this.postRepository.searchPosts({
      page, limit, title, authorIds, postType, tags, sortDirection, sortType, postStatus, postDate
    });
    this.logger.log(`Posts found: ${searchResults.entities.length} for query ${JSON.stringify(searchQuery)}`);

    return searchResults;
  }
}
