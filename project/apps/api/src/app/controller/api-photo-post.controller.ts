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
import { CreatePhotoPostDto } from './dto/create-photo-post.dto';
import { UpdatePhotoPostDto } from './dto/update-photo-post.dto';
import { PhotoPostRdo } from './rdo/photo-post.rdo';

@ApiTags('Api-Photo-Post')
@Controller('post/photo')
@UseFilters(AxiosExceptionFilter)
export class ApiPhotoPostController {
  private readonly logger = new Logger(ApiPhotoPostController.name);

  constructor(
    private readonly httpService: HttpService,
    @Inject(ApplicationConfig.KEY) private readonly applicationConfig: ConfigType<typeof ApplicationConfig>
  ) {
  }

  @Post('/')
  @UseGuards(CheckAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a Photo-Post' })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Photo-Post created', type: CreatePhotoPostDto })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'User unauthorized' })
  public async createPhotoPost(
    @Body() dto: CreatePhotoPostDto,
    @GetUser() userId: string
  ): Promise<PhotoPostRdo> {
    this.logger.log(`Attempting to create a Photo-Post for user ID: '${userId}'`);
    const { data } = await this.httpService.axiosRef
      .post(`${this.applicationConfig.serviceUrlPostPhoto}`, dto, { params: { userId } });
    this.logger.log(`Photo-Post created successfully for user ID: '${userId}'`);

    return fillDto(PhotoPostRdo, data);
  }

  @Get(':postId')
  @ApiOperation({ summary: 'Retrieve a Photo-Post by ID' })
  @ApiParam({ name: 'postId', description: 'Unique identifier of the post', type: String })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Photo-Post not found' })
  public async getPhotoPost(
    @Param('postId', ParseUUIDPipe) postId: string
  ): Promise<PhotoPostRdo> {
    this.logger.log(`Retrieving Photo-Post with ID:' ${postId}'`);
    const { data } = await this.httpService.axiosRef.get(`${this.applicationConfig.serviceUrlPostPhoto}/${postId}`);
    this.logger.log(`Photo-Post with ID: '${postId}' retrieved successfully`);

    return fillDto(PhotoPostRdo, data);
  }

  @Patch(':postId')
  @UseGuards(CheckAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a Photo-Post' })
  @ApiParam({ name: 'postId', description: 'Unique identifier of the post', type: String })
  @ApiResponse({ status: HttpStatus.OK, description: 'Photo-Post updated', type: UpdatePhotoPostDto })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'User unauthorized' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Photo-Post not found' })
  public async updatePhotoPost(
    @Param('postId', ParseUUIDPipe) postId: string,
    @Body() dto: UpdatePhotoPostDto,
    @GetUser() userId: string
  ): Promise<PhotoPostRdo> {
    this.logger.log(`Attempting to update Photo-Post with ID: '${postId}' by user ID: '${userId}'`);
    const { data } = await this.httpService.axiosRef
      .patch(`${this.applicationConfig.serviceUrlPostPhoto}/${postId}`, dto, { params: { userId } });
    this.logger.log(`Photo-Post with ID: '${postId}' updated successfully`);

    return fillDto(PhotoPostRdo, data);
  }

  @Delete(':postId')
  @UseGuards(CheckAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a Photo-Post' })
  @ApiParam({ name: 'postId', description: 'Unique identifier of the post', type: String })
  @ApiResponse({ status: HttpStatus.OK, description: 'Photo-Post deleted', type: PhotoPostRdo })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'User unauthorized' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Photo-Post not found' })
  public async deletePhotoPost(
    @Param('postId', ParseUUIDPipe) postId: string,
    @GetUser() userId: string
  ): Promise<PhotoPostRdo> {
    this.logger.log(`Attempting to delete Photo-Post with ID: '${postId}' by user ID: '${userId}'`);
    const { data } = await this.httpService.axiosRef
      .delete(`${this.applicationConfig.serviceUrlPostPhoto}/${postId}`, { params: { userId } });
    this.logger.log(`Photo-Post with ID: '${postId}' deleted successfully`);

    return fillDto(PhotoPostRdo, data);
  }

  @Post(':postId/repost')
  @UseGuards(CheckAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Repost a Photo-Post' })
  @ApiParam({ name: 'postId', description: 'Unique identifier of the post', type: String })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Photo-Post reposted', type: PhotoPostRdo })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'User unauthorized' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Photo-Post not found' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Photo-Post has already been reposted' })
  public async repostPhotoPost(
    @Param('postId', ParseUUIDPipe) postId: string,
    @GetUser() userId: string
  ): Promise<PhotoPostRdo> {
    this.logger.log(`Attempting to repost Photo-Post with ID: '${postId}' by user ID: '${userId}'`);
    const { data } = await this.httpService.axiosRef
      .post(`${this.applicationConfig.serviceUrlPostPhoto}/${postId}/repost`, {}, { params: { userId } });
    this.logger.log(`Photo-Post with ID: '${postId}' reposted successfully`);

    return fillDto(PhotoPostRdo, data);
  }
}
