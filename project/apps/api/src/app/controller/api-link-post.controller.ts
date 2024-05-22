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
import { CreateLinkPostDto } from './dto/create-link-post.dto';
import { UpdateLinkPostDto } from './dto/update-link-post.dto';
import { LinkPostRdo } from './rdo/link-post.rdo';

@ApiTags('Api-Link-Post')
@Controller('post/link')
@UseFilters(AxiosExceptionFilter)
export class ApiLinkPostController {
  private readonly logger = new Logger(ApiLinkPostController.name);

  constructor(
    private readonly httpService: HttpService,
    @Inject(ApplicationConfig.KEY) private readonly applicationConfig: ConfigType<typeof ApplicationConfig>
  ) {
  }

  @Post('/')
  @UseGuards(CheckAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a Link-Post' })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Link-Post created', type: CreateLinkPostDto })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'User unauthorized' })
  public async createLinkPost(
    @Body() dto: CreateLinkPostDto,
    @GetUser() userId: string
  ): Promise<LinkPostRdo> {
    this.logger.log(`Attempting to create a Link-Post for user ID: '${userId}'`);
    const { data } = await this.httpService.axiosRef
      .post(`${this.applicationConfig.serviceUrlPostLink}`, dto, { params: { userId } });
    this.logger.log(`Link-Post created successfully for user ID: '${userId}'`);

    return fillDto(LinkPostRdo, data);
  }

  @Get(':postId')
  @ApiOperation({ summary: 'Retrieve a Link-Post by ID' })
  @ApiParam({ name: 'postId', description: 'Unique identifier of the post', type: String })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Link-Post not found' })
  public async getLinkPost(
    @Param('postId', ParseUUIDPipe) postId: string
  ): Promise<LinkPostRdo> {
    this.logger.log(`Retrieving Link-Post with ID:' ${postId}'`);
    const { data } = await this.httpService.axiosRef.get(`${this.applicationConfig.serviceUrlPostLink}/${postId}`);
    this.logger.log(`Link-Post with ID: '${postId}' retrieved successfully`);

    return fillDto(LinkPostRdo, data);
  }

  @Patch(':postId')
  @UseGuards(CheckAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a Link-Post' })
  @ApiParam({ name: 'postId', description: 'Unique identifier of the post', type: String })
  @ApiResponse({ status: HttpStatus.OK, description: 'Link-Post updated', type: UpdateLinkPostDto })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'User unauthorized' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Link-Post not found' })
  public async updateLinkPost(
    @Param('postId', ParseUUIDPipe) postId: string,
    @Body() dto: UpdateLinkPostDto,
    @GetUser() userId: string
  ): Promise<LinkPostRdo> {
    this.logger.log(`Attempting to update Link-Post with ID: '${postId}' by user ID: '${userId}'`);
    const { data } = await this.httpService.axiosRef
      .patch(`${this.applicationConfig.serviceUrlPostLink}/${postId}`, dto, { params: { userId } });
    this.logger.log(`Link-Post with ID: '${postId}' updated successfully`);

    return fillDto(LinkPostRdo, data);
  }

  @Delete(':postId')
  @UseGuards(CheckAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a Link-Post' })
  @ApiParam({ name: 'postId', description: 'Unique identifier of the post', type: String })
  @ApiResponse({ status: HttpStatus.OK, description: 'Link-Post deleted', type: LinkPostRdo })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'User unauthorized' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Link-Post not found' })
  public async deleteLinkPost(
    @Param('postId', ParseUUIDPipe) postId: string,
    @GetUser() userId: string
  ): Promise<LinkPostRdo> {
    this.logger.log(`Attempting to delete Link-Post with ID: '${postId}' by user ID: '${userId}'`);
    const { data } = await this.httpService.axiosRef
      .delete(`${this.applicationConfig.serviceUrlPostLink}/${postId}`, { params: { userId } });
    this.logger.log(`Link-Post with ID: '${postId}' deleted successfully`);

    return fillDto(LinkPostRdo, data);
  }

  @Post(':postId/repost')
  @UseGuards(CheckAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Repost a Link-Post' })
  @ApiParam({ name: 'postId', description: 'Unique identifier of the post', type: String })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Link-Post reposted', type: LinkPostRdo })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'User unauthorized' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Link-Post not found' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Link-Post has already been reposted' })
  public async repostLinkPost(
    @Param('postId', ParseUUIDPipe) postId: string,
    @GetUser() userId: string
  ): Promise<LinkPostRdo> {
    this.logger.log(`Attempting to repost Link-Post with ID: '${postId}' by user ID: '${userId}'`);
    const { data } = await this.httpService.axiosRef
      .post(`${this.applicationConfig.serviceUrlPostLink}/${postId}/repost`, {}, { params: { userId } });
    this.logger.log(`Link-Post with ID: '${postId}' reposted successfully`);

    return fillDto(LinkPostRdo, data);
  }
}
