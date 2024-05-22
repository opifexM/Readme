import { Controller, Get, HttpStatus, Logger, Query } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PaginationResult } from '@project/shared-core';
import { fillDto } from '@project/shared-helpers';
import { PersonaFeedQuery } from './persona-feed-search.query';
import { PostSearchQuery } from './post-search.query';
import { AggregatePostPaginationRdo } from './rdo/aggregate-post-pagination.rdo';
import { AggregatePostRdo } from './rdo/aggregate-post.rdo';
import { SearchService } from './search.service';

@ApiTags('Search')
@Controller('search')
export class SearchController {
  private readonly logger = new Logger(SearchController.name);

  constructor(
    private readonly searchService: SearchService
  ) {
  }

  @Get('')
  @ApiOperation({ summary: 'Find user search posts' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Posts retrieved successfully', type: [AggregatePostPaginationRdo] })
  @ApiQuery({ name: 'userId', type: 'string', required: true, description: 'Current authorized User ID' })
  public async getUserSearchPosts(
    @Query() query: PostSearchQuery,
    @Query('userId') userId: string
  ): Promise<AggregatePostPaginationRdo> {
    this.logger.log(`Starting search for user posts with query: ${JSON.stringify(query)} for user ID: ${userId}`);
    const postPagination = await this.searchService.findUserSearchPosts(userId, query);
    const transformedPostPagination = this.transformPostPagination(postPagination);

    return fillDto(AggregatePostPaginationRdo, transformedPostPagination);
  }

  @Get('public')
  @ApiOperation({ summary: 'Find public posts' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Posts retrieved successfully', type: [AggregatePostPaginationRdo] })
  public async getPublicPosts(
    @Query() query: PostSearchQuery,
  ): Promise<AggregatePostPaginationRdo> {
    this.logger.log(`Starting public posts search with query: ${JSON.stringify(query)}`);
    const postPagination = await this.searchService.findPublicPosts(query);
    const transformedPostPagination = this.transformPostPagination(postPagination);

    return fillDto(AggregatePostPaginationRdo, transformedPostPagination);
  }

  @Get('new-posts')
  @ApiOperation({ summary: 'Find new posts by date' })
  @ApiResponse({ status: HttpStatus.OK, description: 'New posts retrieved successfully', type: [AggregatePostPaginationRdo] })
  public async getNewPosts(
    @Query() query: PostSearchQuery,
  ): Promise<AggregatePostPaginationRdo> {
    this.logger.log(`Starting search new post with query: ${JSON.stringify(query)}`);
    const postPagination = await this.searchService.findNewPostsByDate(query);
    const transformedPostPagination = this.transformPostPagination(postPagination);

    return fillDto(AggregatePostPaginationRdo, transformedPostPagination);
  }

  @Get('personal-feed')
  @ApiOperation({ summary: 'Search personal feed posts' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Personal feed Posts retrieved successfully', type: [AggregatePostPaginationRdo] })
  @ApiQuery({ name: 'userId', type: 'string', required: true, description: 'Current authorized User ID' })
  public async getPersonalFeedPosts(
    @Query() query: PersonaFeedQuery,
    @Query('userId') userId: string
  ): Promise<AggregatePostPaginationRdo> {
    this.logger.log(`Starting search for personal feed posts with query: ${JSON.stringify(query)} for user: '${userId}'`);
    const postPagination = await this.searchService.findPersonalFeedPosts(userId, query);
    const transformedPostPagination = this.transformPostPagination(postPagination);

    return fillDto(AggregatePostPaginationRdo, transformedPostPagination);
  }

  private transformPostPagination(postPagination: PaginationResult<AggregatePostRdo>) {
    return {
      ...postPagination,
      entities: postPagination.entities.map((post) => post.toPOJO())
    };
  }
}
