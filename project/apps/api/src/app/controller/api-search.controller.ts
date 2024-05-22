import { HttpService } from '@nestjs/axios';
import { Controller, Get, HttpStatus, Inject, Logger, Query, UseFilters, UseGuards } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ApplicationConfig } from '@project/api-config';
import { fillDto } from '@project/shared-helpers';
import { GetUser } from '../decorator/get-user.decorator';
import { AxiosExceptionFilter } from '../filter/axios-exception.filter';
import { CheckAuthGuard } from '../guard/check-auth.guard';
import { PersonaFeedQuery } from './query/persona-feed-search.query';
import { PostSearchQuery } from './query/post-search.query';
import { AggregatePostPaginationRdo } from './rdo/aggregate-post-pagination.rdo';

@ApiTags('Api-Search')
@Controller('search')
@UseFilters(AxiosExceptionFilter)
export class ApiSearchController {
  private readonly logger = new Logger(ApiSearchController.name);

  constructor(
    private readonly httpService: HttpService,
    @Inject(ApplicationConfig.KEY) private readonly applicationConfig: ConfigType<typeof ApplicationConfig>
  ) {
  }

  @Get('')
  @UseGuards(CheckAuthGuard)
  @ApiOperation({ summary: 'Find user search posts' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Posts retrieved successfully', type: [AggregatePostPaginationRdo] })
  public async getUserSearchPosts(
    @Query() query: PostSearchQuery,
    @GetUser() userId: string
  ): Promise<AggregatePostPaginationRdo> {
    this.logger.log(`Starting user search for posts with query parameters '${JSON.stringify(query)}' for user ID: '${userId}'`);
    const params = { ...query, userId };
    const { data } = await this.httpService.axiosRef
      .get(`${this.applicationConfig.serviceUrlSearch}`, { params });
    this.logger.log(`Completed user search for posts with query parameters for user ID: '${userId}'`);

    return fillDto(AggregatePostPaginationRdo, data);
  }

  @Get('public')
  @ApiOperation({ summary: 'Find public search posts' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Posts retrieved successfully', type: [AggregatePostPaginationRdo] })
  public async getPublicPosts(
    @Query() query: PostSearchQuery,
  ): Promise<AggregatePostPaginationRdo> {
    this.logger.log(`Starting public search for posts with query parameters '${JSON.stringify(query)}'`);
    const { data } = await this.httpService.axiosRef
      .get(`${this.applicationConfig.serviceUrlSearch}/public`, { params: query });
    this.logger.log('Completed public search for posts with query parameters');

    return fillDto(AggregatePostPaginationRdo, data);
  }

  @Get('personal-feed')
  @UseGuards(CheckAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Search personal feed posts' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Personal feed Posts retrieved successfully', type: [AggregatePostPaginationRdo] })
  public async getPersonalFeedPosts(
    @Query() query: PersonaFeedQuery,
    @GetUser() userId: string
  ): Promise<AggregatePostPaginationRdo> {
    this.logger.log(`Starting search for personal feed posts with query: ${JSON.stringify(query)} for user ID: '${userId}'`);
    const { data } = await this.httpService.axiosRef
      .get(`${this.applicationConfig.serviceUrlSearch}/personal-feed`, { params: { userId }});
    this.logger.log(`Completed search for personal feed posts for user ID: '${userId}'`);

    return fillDto(AggregatePostPaginationRdo, data);
  }
}
