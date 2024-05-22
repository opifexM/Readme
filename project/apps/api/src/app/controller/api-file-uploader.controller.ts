import { HttpService } from '@nestjs/axios';
import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Inject,
  Logger,
  Param,
  Post,
  UploadedFile,
  UseFilters,
  UseInterceptors
} from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiConsumes, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ApplicationConfig } from '@project/api-config';
import { MongoIdValidationPipe } from '@project/pipes';
import { fillDto } from '@project/shared-helpers';
import FormData from 'form-data';
import { AxiosExceptionFilter } from '../filter/axios-exception.filter';
import { UploadedFileRdo } from './rdo/uploaded-file.rdo';
import 'multer';

@ApiTags('Api-File-Uploader')
@Controller('files')
@UseFilters(AxiosExceptionFilter)
export class ApiFileUploaderController {
  private readonly logger = new Logger(ApiFileUploaderController.name);

  constructor(
    private readonly httpService: HttpService,
    @Inject(ApplicationConfig.KEY) private readonly applicationConfig: ConfigType<typeof ApplicationConfig>
  ) {}

  @Get(':fileId')
  @ApiOperation({ summary: 'Get file details' })
  @ApiResponse({ status: 200, description: 'File details retrieved successfully.', type: UploadedFileRdo })
  @ApiResponse({ status: 404, description: 'File not found.' })
  public async show(@Param('fileId', MongoIdValidationPipe) fileId: string): Promise<UploadedFileRdo> {
    this.logger.log(`Retrieving file details for fileId: '${fileId}'`);
    const { data } = await this.httpService.axiosRef.get(`${this.applicationConfig.serviceUrlFiles}/${fileId}`);
    this.logger.log(`File details retrieved for fileId: '${fileId}'`);

    return fillDto(UploadedFileRdo, data);
  }



  @Post('/upload')
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: 'Upload a file' })
  @ApiResponse({ status: 201, description: 'The file has been successfully uploaded.', type: UploadedFileRdo })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  @ApiConsumes('multipart/form-data')
  public async uploadFile(@UploadedFile() file: Express.Multer.File): Promise<UploadedFileRdo> {
    this.logger.log(`Starting file upload for file: '${file.originalname}'`);
    const formData = new FormData();
    formData.append('file', file.buffer, file.originalname);

    try {
      const { data } = await this.httpService.axiosRef.post(
        `${this.applicationConfig.serviceUrlFiles}/upload`,
        formData,
        {
          headers: {
            ...formData.getHeaders(),
          },
        }
      );
      this.logger.log(`File uploaded successfully. File Id: '${data.id}'`);
      return fillDto(UploadedFileRdo, data);
    } catch (error) {
      this.logger.error(`Error uploading file: ${error}`);
      throw new HttpException('Failed to upload file', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
