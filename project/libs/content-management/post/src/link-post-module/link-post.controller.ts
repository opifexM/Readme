import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Logger,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query
} from '@nestjs/common';
import { ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { fillDto } from '@project/shared-helpers';
import { PhotoPostRdo } from '../photo-post-module/rdo/photo-post.rdo';
import { CreateLinkPostDto } from './dto/create-link-post.dto';
import { UpdateLinkPostDto } from './dto/update-link-post.dto';
import { LinkPostService } from './link-post.service';
import { LinkPostRdo } from './rdo/link-post.rdo';

@ApiTags('Link-Post')
@Controller('post/link')
export class LinkPostController {
  private readonly logger = new Logger(LinkPostController.name);

  constructor(
    private readonly linkPostService: LinkPostService,
  ) {}

  @Post('/')
  @ApiOperation({ summary: 'Create a Link-Post' })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Link-Post created', type: CreateLinkPostDto })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'User unauthorized' })
  @ApiQuery({ name: 'userId', type: 'string', required: true, description: 'Current authorized User ID' })
  public async createLinkPost(
    @Body() dto: CreateLinkPostDto,
    @Query('userId') userId: string
  ): Promise<LinkPostRdo> {
    this.logger.log(`Creating link post for user ${userId}`);
    const createdLinkPost = await this.linkPostService.createPost(userId, dto);

    return fillDto(LinkPostRdo, createdLinkPost.toPOJO());
  }

  @Get(':postId')
  @ApiOperation({ summary: 'Retrieve a Link-Post by ID' })
  @ApiParam({ name: 'postId', description: 'Unique identifier of the post', type: String })
  @ApiResponse({ status: HttpStatus.OK, description: 'Photo-Post retrieved successfully', type: PhotoPostRdo })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Link-Post not found' })
  public async getLinkPost(
    @Param('postId', ParseUUIDPipe) postId: string
  ): Promise<LinkPostRdo> {
    this.logger.log(`Retrieving link post ID ${postId}`);
    const foundPost = await this.linkPostService.findPostById(postId);

    return fillDto(LinkPostRdo, foundPost.toPOJO());
  }

  @Patch(':postId')
  @ApiOperation({ summary: 'Update a Link-Post' })
  @ApiParam({ name: 'postId', description: 'Unique identifier of the post', type: String })
  @ApiResponse({ status: HttpStatus.OK, description: 'Link-Post updated', type: UpdateLinkPostDto })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'User unauthorized' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Link-Post not found' })
  @ApiQuery({ name: 'userId', type: 'string', required: true, description: 'Current authorized User ID' })
  public async updateLinkPost(
    @Param('postId', ParseUUIDPipe) postId: string,
    @Body() dto: UpdateLinkPostDto,
    @Query('userId') userId: string
  ): Promise<LinkPostRdo> {
    this.logger.log(`Updating link post ID ${postId} by user ${userId}`);
    const updatedPost = await this.linkPostService.updatePostById(userId, postId, dto);

    return fillDto(LinkPostRdo, updatedPost.toPOJO());
  }

  @Delete(':postId')
  @ApiOperation({ summary: 'Delete a Link-Post' })
  @ApiParam({ name: 'postId', description: 'Unique identifier of the post', type: String })
  @ApiResponse({ status: HttpStatus.OK, description: 'Link-Post deleted', type: LinkPostRdo })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'User unauthorized' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Link-Post not found' })
  @ApiQuery({ name: 'userId', type: 'string', required: true, description: 'Current authorized User ID' })
  public async deleteLinkPost(
    @Param('postId', ParseUUIDPipe) postId: string,
    @Query('userId') userId: string
  ): Promise<LinkPostRdo> {
    this.logger.log(`Deleting link post ID ${postId} by user ${userId}`);
    const deletedPost = await this.linkPostService.deletePostById(userId, postId);

    return fillDto(LinkPostRdo, deletedPost.toPOJO());
  }

  @Post(':postId/repost')
  @ApiOperation({ summary: 'Repost a Link-Post' })
  @ApiParam({ name: 'postId', description: 'Unique identifier of the post', type: String })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Link-Post reposted', type: LinkPostRdo })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'User unauthorized' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Link-Post not found' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Link-Post has already been reposted' })
  @ApiQuery({ name: 'userId', type: 'string', required: true, description: 'Current authorized User ID' })
  public async repostLinkPost(
     @Param('postId', ParseUUIDPipe) postId: string,
     @Query('userId') userId: string
  ): Promise<LinkPostRdo> {
    this.logger.log(`Reposting link post ID ${postId} by user ${userId}`);
    const repostedPost = await this.linkPostService.repostPostById(userId, postId);

    return fillDto(LinkPostRdo, repostedPost.toPOJO());
  }
}
