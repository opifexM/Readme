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
import { CreatePhotoPostDto } from './dto/create-photo-post.dto';
import { UpdatePhotoPostDto } from './dto/update-photo-post.dto';
import { PhotoPostService } from './photo-post.service';
import { PhotoPostRdo } from './rdo/photo-post.rdo';

@ApiTags('Photo-Post')
@Controller('post/photo')
export class PhotoPostController {
  private readonly logger = new Logger(PhotoPostController.name);

  constructor(
    private readonly photoPostService: PhotoPostService,
  ) {}

  @Post('/')
  @ApiOperation({ summary: 'Create a Photo-Post' })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Photo-Post successfully created', type: PhotoPostRdo })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized access' })
  @ApiQuery({ name: 'userId', type: 'string', required: true, description: 'Current authorized User ID' })
  public async createPhotoPost(
    @Body() dto: CreatePhotoPostDto,
    @Query('userId') userId: string
  ): Promise<PhotoPostRdo> {
    this.logger.log(`Creating photo post for user ${userId}`);
    const createdPhotoPost = await this.photoPostService.createPost(userId, dto);

    return fillDto(PhotoPostRdo, createdPhotoPost.toPOJO());
  }

  @Get(':postId')
  @ApiOperation({ summary: 'Retrieve a Photo-Post by ID' })
  @ApiParam({ name: 'postId', description: 'Unique identifier of the post', type: String })
  @ApiResponse({ status: HttpStatus.OK, description: 'Photo-Post retrieved successfully', type: PhotoPostRdo })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Photo-Post not found' })
  public async getPhotoPost(
    @Param('postId', ParseUUIDPipe) postId: string
  ): Promise<PhotoPostRdo> {
    this.logger.log(`Retrieving photo post ID ${postId}`);
    const foundPost = await this.photoPostService.findPostById(postId);

    return fillDto(PhotoPostRdo, foundPost.toPOJO());
  }

  @Patch(':postId')
  @ApiOperation({ summary: 'Update a Photo-Post' })
  @ApiParam({ name: 'postId', description: 'Unique identifier of the post', type: String })
  @ApiResponse({ status: HttpStatus.OK, description: 'Photo-Post updated successfully', type: PhotoPostRdo })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized access' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Photo-Post not found' })
  @ApiQuery({ name: 'userId', type: 'string', required: true, description: 'Current authorized User ID' })
  public async updatePhotoPost(
    @Param('postId', ParseUUIDPipe) postId: string,
    @Body() dto: UpdatePhotoPostDto,
    @Query('userId') userId: string
  ): Promise<PhotoPostRdo> {
    this.logger.log(`Updating photo post ID ${postId} by user ${userId}`);
    const updatedPost = await this.photoPostService.updatePostById(userId, postId, dto);

    return fillDto(PhotoPostRdo, updatedPost.toPOJO());
  }

  @Delete(':postId')
  @ApiOperation({ summary: 'Delete a Photo-Post' })
  @ApiParam({ name: 'postId', description: 'Unique identifier of the post', type: String })
  @ApiResponse({ status: HttpStatus.OK, description: 'Photo-Post successfully deleted', type: PhotoPostRdo })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized access' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Photo-Post not found' })
  @ApiQuery({ name: 'userId', type: 'string', required: true, description: 'Current authorized User ID' })
  public async deletePhotoPost(
    @Param('postId', ParseUUIDPipe) postId: string,
    @Query('userId') userId: string
  ): Promise<PhotoPostRdo> {
    this.logger.log(`Deleting photo post ID ${postId} by user ${userId}`);
    const deletedPost = await this.photoPostService.deletePostById(userId, postId);

    return fillDto(PhotoPostRdo, deletedPost.toPOJO());
  }

  @Post(':postId/repost')
  @ApiOperation({ summary: 'Repost a Photo-Post' })
  @ApiParam({ name: 'postId', description: 'Unique identifier of the post', type: String })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Photo-Post successfully reposted', type: PhotoPostRdo })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized access' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Original Photo-Post not found' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Photo-Post has already been reposted' })
  @ApiQuery({ name: 'userId', type: 'string', required: true, description: 'Current authorized User ID' })
  public async repostPhotoPost(
    @Param('postId', ParseUUIDPipe) postId: string,
    @Query('userId') userId: string
  ): Promise<PhotoPostRdo> {
    this.logger.log(`Reposting photo post ID ${postId} by user ${userId}`);
    const repostedPost = await this.photoPostService.repostPostById(userId, postId);

    return fillDto(PhotoPostRdo, repostedPost.toPOJO());
  }
}
