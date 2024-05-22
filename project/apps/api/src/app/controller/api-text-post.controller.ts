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
import { CreateTextPostDto } from './dto/create-text-post.dto';
import { UpdateTextPostDto } from './dto/update-text-post.dto';
import { TextPostRdo } from './rdo/text-post.rdo';

@ApiTags('Api-Text-Post')
@Controller('post/text')
@UseFilters(AxiosExceptionFilter)
export class ApiTextPostController {
  private readonly logger = new Logger(ApiTextPostController.name);

  constructor(
    private readonly httpService: HttpService,
    @Inject(ApplicationConfig.KEY) private readonly applicationConfig: ConfigType<typeof ApplicationConfig>
  ) {
  }

  @Post('/')
  @UseGuards(CheckAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a Text-Post' })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Text-Post created', type: CreateTextPostDto })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'User unauthorized' })
  public async createTextPost(
    @Body() dto: CreateTextPostDto,
    @GetUser() userId: string
  ): Promise<TextPostRdo> {
    this.logger.log(`Attempting to create a Text-Post for user ID: '${userId}'`);
    const { data } = await this.httpService.axiosRef
      .post(`${this.applicationConfig.serviceUrlPostText}`, dto, { params: { userId } });
    this.logger.log(`Text-Post created successfully for user ID: '${userId}'`);

    return fillDto(TextPostRdo, data);
  }

  @Get(':postId')
  @ApiOperation({ summary: 'Retrieve a Text-Post by ID' })
  @ApiParam({ name: 'postId', description: 'Unique identifier of the post', type: String })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Text-Post not found' })
  public async getTextPost(
    @Param('postId', ParseUUIDPipe) postId: string
  ): Promise<TextPostRdo> {
    this.logger.log(`Retrieving Text-Post with ID:' ${postId}'`);
    const { data } = await this.httpService.axiosRef.get(`${this.applicationConfig.serviceUrlPostText}/${postId}`);
    this.logger.log(`Text-Post with ID: '${postId}' retrieved successfully`);

    return fillDto(TextPostRdo, data);
  }

  @Patch(':postId')
  @UseGuards(CheckAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a Text-Post' })
  @ApiParam({ name: 'postId', description: 'Unique identifier of the post', type: String })
  @ApiResponse({ status: HttpStatus.OK, description: 'Text-Post updated', type: UpdateTextPostDto })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'User unauthorized' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Text-Post not found' })
  public async updateTextPost(
    @Param('postId', ParseUUIDPipe) postId: string,
    @Body() dto: UpdateTextPostDto,
    @GetUser() userId: string
  ): Promise<TextPostRdo> {
    this.logger.log(`Attempting to update Text-Post with ID: '${postId}' by user ID: '${userId}'`);
    const { data } = await this.httpService.axiosRef
      .patch(`${this.applicationConfig.serviceUrlPostText}/${postId}`, dto, { params: { userId } });
    this.logger.log(`Text-Post with ID: '${postId}' updated successfully`);

    return fillDto(TextPostRdo, data);
  }

  @Delete(':postId')
  @UseGuards(CheckAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a Text-Post' })
  @ApiParam({ name: 'postId', description: 'Unique identifier of the post', type: String })
  @ApiResponse({ status: HttpStatus.OK, description: 'Text-Post deleted', type: TextPostRdo })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'User unauthorized' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Text-Post not found' })
  public async deleteTextPost(
    @Param('postId', ParseUUIDPipe) postId: string,
    @GetUser() userId: string
  ): Promise<TextPostRdo> {
    this.logger.log(`Attempting to delete Text-Post with ID: '${postId}' by user ID: '${userId}'`);
    const { data } = await this.httpService.axiosRef
      .delete(`${this.applicationConfig.serviceUrlPostText}/${postId}`, { params: { userId } });
    this.logger.log(`Text-Post with ID: '${postId}' deleted successfully`);

    return fillDto(TextPostRdo, data);
  }

  @Post(':postId/repost')
  @UseGuards(CheckAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Repost a Text-Post' })
  @ApiParam({ name: 'postId', description: 'Unique identifier of the post', type: String })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Text-Post reposted', type: TextPostRdo })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'User unauthorized' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Text-Post not found' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Text-Post has already been reposted' })
  public async repostTextPost(
    @Param('postId', ParseUUIDPipe) postId: string,
    @GetUser() userId: string
  ): Promise<TextPostRdo> {
    this.logger.log(`Attempting to repost Text-Post with ID: '${postId}' by user ID: '${userId}'`);
    const { data } = await this.httpService.axiosRef
      .post(`${this.applicationConfig.serviceUrlPostText}/${postId}/repost`, {}, { params: { userId } });
    this.logger.log(`Text-Post with ID: '${postId}' reposted successfully`);

    return fillDto(TextPostRdo, data);
  }
}
