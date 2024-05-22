import { HttpService } from '@nestjs/axios';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Inject,
  Logger,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  UseFilters,
  UseGuards
} from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ApplicationConfig } from '@project/api-config';
import { fillDto } from '@project/shared-helpers';
import { GetUser } from '../decorator/get-user.decorator';
import { AxiosExceptionFilter } from '../filter/axios-exception.filter';
import { CheckAuthGuard } from '../guard/check-auth.guard';
import { CreateQuotePostDto } from './dto/create-quote-post.dto';
import { UpdateQuotePostDto } from './dto/update-quote-post.dto';
import { QuotePostRdo } from './rdo/quote-post.rdo';

@ApiTags('Api-Quote-Post')
@Controller('post/quote')
@UseFilters(AxiosExceptionFilter)
export class ApiQuotePostController {
  private readonly logger = new Logger(ApiQuotePostController.name);

  constructor(
    private readonly httpService: HttpService,
    @Inject(ApplicationConfig.KEY) private readonly applicationConfig: ConfigType<typeof ApplicationConfig>
  ) {
  }

  @Post('/')
  @UseGuards(CheckAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a Quote-Post' })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Quote-Post created', type: CreateQuotePostDto })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'User unauthorized' })
  public async createQuotePost(
    @Body() dto: CreateQuotePostDto,
    @GetUser() userId: string
  ): Promise<QuotePostRdo> {
    this.logger.log(`Attempting to create a Quote-Post for user ID: '${userId}'`);
    const { data } = await this.httpService.axiosRef
      .post(`${this.applicationConfig.serviceUrlPostQuote}`, dto, { params: { userId } });
    this.logger.log(`Quote-Post created successfully for user ID: '${userId}'`);

    return fillDto(QuotePostRdo, data);
  }

  @Get(':postId')
  @ApiOperation({ summary: 'Retrieve a Quote-Post by ID' })
  @ApiParam({ name: 'postId', description: 'Unique identifier of the post', type: String })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Quote-Post not found' })
  public async getQuotePost(
    @Param('postId', ParseUUIDPipe) postId: string
  ): Promise<QuotePostRdo> {
    this.logger.log(`Retrieving Quote-Post with ID:' ${postId}'`);
    const { data } = await this.httpService.axiosRef.get(`${this.applicationConfig.serviceUrlPostQuote}/${postId}`);
    this.logger.log(`Quote-Post with ID: '${postId}' retrieved successfully`);

    return fillDto(QuotePostRdo, data);
  }

  @Patch(':postId')
  @UseGuards(CheckAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a Quote-Post' })
  @ApiParam({ name: 'postId', description: 'Unique identifier of the post', type: String })
  @ApiResponse({ status: HttpStatus.OK, description: 'Quote-Post updated', type: UpdateQuotePostDto })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'User unauthorized' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Quote-Post not found' })
  public async updateQuotePost(
    @Param('postId', ParseUUIDPipe) postId: string,
    @Body() dto: UpdateQuotePostDto,
    @GetUser() userId: string
  ): Promise<QuotePostRdo> {
    this.logger.log(`Attempting to update Quote-Post with ID: '${postId}' by user ID: '${userId}'`);
    const { data } = await this.httpService.axiosRef
      .patch(`${this.applicationConfig.serviceUrlPostQuote}/${postId}`, dto, { params: { userId } });
    this.logger.log(`Quote-Post with ID: '${postId}' updated successfully`);

    return fillDto(QuotePostRdo, data);
  }

  @Delete(':postId')
  @UseGuards(CheckAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a Quote-Post' })
  @ApiParam({ name: 'postId', description: 'Unique identifier of the post', type: String })
  @ApiResponse({ status: HttpStatus.OK, description: 'Quote-Post deleted', type: QuotePostRdo })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'User unauthorized' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Quote-Post not found' })
  public async deleteQuotePost(
    @Param('postId', ParseUUIDPipe) postId: string,
    @GetUser() userId: string
  ): Promise<QuotePostRdo> {
    this.logger.log(`Attempting to delete Quote-Post with ID: '${postId}' by user ID: '${userId}'`);
    const { data } = await this.httpService.axiosRef
      .delete(`${this.applicationConfig.serviceUrlPostQuote}/${postId}`, { params: { userId } });
    this.logger.log(`Quote-Post with ID: '${postId}' deleted successfully`);

    return fillDto(QuotePostRdo, data);
  }

  @Post(':postId/repost')
  @UseGuards(CheckAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Repost a Quote-Post' })
  @ApiParam({ name: 'postId', description: 'Unique identifier of the post', type: String })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Quote-Post reposted', type: QuotePostRdo })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'User unauthorized' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Quote-Post not found' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Quote-Post has already been reposted' })
  public async repostQuotePost(
    @Param('postId', ParseUUIDPipe) postId: string,
    @GetUser() userId: string
  ): Promise<QuotePostRdo> {
    this.logger.log(`Attempting to repost Quote-Post with ID: '${postId}' by user ID: '${userId}'`);
    const { data } = await this.httpService.axiosRef
      .post(`${this.applicationConfig.serviceUrlPostQuote}/${postId}/repost`, {}, { params: { userId } });
    this.logger.log(`Quote-Post with ID: '${postId}' reposted successfully`);

    return fillDto(QuotePostRdo, data);
  }
}
