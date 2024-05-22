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
import { CreateTextPostDto } from './dto/create-text-post.dto';
import { UpdateTextPostDto } from './dto/update-text-post.dto';
import { TextPostRdo } from './rdo/text-post.rdo';
import { TextPostService } from './text-post.service';

@ApiTags('Text-Posts')
@Controller('post/text')
export class TextPostController {
  private readonly logger = new Logger(TextPostController.name);

  constructor(
    private readonly textPostService: TextPostService,
  ) {}

  @Post('/')
  @ApiOperation({ summary: 'Create a Text-Post' })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Text-Post successfully created', type: TextPostRdo })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized access' })
  @ApiQuery({ name: 'userId', type: 'string', required: true, description: 'Current authorized User ID' })
  public async createTextPost(
    @Body() dto: CreateTextPostDto,
    @Query('userId') userId: string
  ): Promise<TextPostRdo> {
    this.logger.log(`Creating text post for user ${userId}`);
    const createdTextPost = await this.textPostService.createPost(userId, dto);

    return fillDto(TextPostRdo, createdTextPost.toPOJO());
  }

  @Get(':postId')
  @ApiOperation({ summary: 'Retrieve a Text-Post by ID' })
  @ApiParam({ name: 'postId', description: 'Unique identifier of the post', type: String })
  @ApiResponse({ status: HttpStatus.OK, description: 'Text-Post retrieved successfully', type: TextPostRdo })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Text-Post not found' })
  public async getTextPost(
    @Param('postId', ParseUUIDPipe) postId: string
  ): Promise<TextPostRdo> {
    this.logger.log(`Retrieving text post ID ${postId}`);
    const foundPost = await this.textPostService.findPostById(postId);

    return fillDto(TextPostRdo, foundPost.toPOJO());
  }

  @Patch(':postId')
  @ApiOperation({ summary: 'Update a Text-Post' })
  @ApiParam({ name: 'postId', description: 'Unique identifier of the post', type: String })
  @ApiResponse({ status: HttpStatus.OK, description: 'Text-Post updated successfully', type: TextPostRdo })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized access' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Text-Post not found' })
  @ApiQuery({ name: 'userId', type: 'string', required: true, description: 'Current authorized User ID' })
  public async updateTextPost(
    @Param('postId', ParseUUIDPipe) postId: string,
    @Body() dto: UpdateTextPostDto,
    @Query('userId') userId: string
  ): Promise<TextPostRdo> {
    this.logger.log(`Updating text post ID ${postId} by user ${userId}`);
    const updatedPost = await this.textPostService.updatePostById(userId, postId, dto);

    return fillDto(TextPostRdo, updatedPost.toPOJO());
  }

  @Delete(':postId')
  @ApiOperation({ summary: 'Delete a Text-Post' })
  @ApiParam({ name: 'postId', description: 'Unique identifier of the post', type: String })
  @ApiResponse({ status: HttpStatus.OK, description: 'Text-Post successfully deleted', type: TextPostRdo })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized access' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Text-Post not found' })
  @ApiQuery({ name: 'userId', type: 'string', required: true, description: 'Current authorized User ID' })
  public async deleteTextPost(
    @Param('postId', ParseUUIDPipe) postId: string,
    @Query('userId') userId: string
  ): Promise<TextPostRdo> {
    this.logger.log(`Deleting text post ID ${postId} by user ${userId}`);
    const deletedPost = await this.textPostService.deletePostById(userId, postId);

    return fillDto(TextPostRdo, deletedPost.toPOJO());
  }

  @Post(':postId/repost')
  @ApiOperation({ summary: 'Repost a Text-Post' })
  @ApiParam({ name: 'postId', description: 'Unique identifier of the post', type: String })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Text-Post successfully reposted', type: TextPostRdo })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized access' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Original Text-Post not found' })
  @ApiQuery({ name: 'userId', type: 'string', required: true, description: 'Current authorized User ID' })
  public async repostTextPost(
    @Param('postId', ParseUUIDPipe) postId: string,
    @Query('userId') userId: string
  ): Promise<TextPostRdo> {
    this.logger.log(`Reposting text post ID ${postId} by user ${userId}`);
    const repostedPost = await this.textPostService.repostPostById(userId, postId);

    return fillDto(TextPostRdo, repostedPost.toPOJO());
  }
}
