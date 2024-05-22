import { Controller, Get, Logger, Param, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiConsumes, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { MongoIdValidationPipe } from '@project/pipes';
import { fillDto } from '@project/shared-helpers';
import { FileUploaderService } from './file-uploader.service';
import { UploadedFileRdo } from './rdo/uploaded-file.rdo';
import 'multer';

@ApiTags('File-Uploader')
@Controller('files')
export class FileUploaderController {
  private readonly logger = new Logger(FileUploaderController.name);

  constructor(
    private readonly fileUploaderService: FileUploaderService,
  ) {}

  @Get(':fileId')
  @ApiOperation({ summary: 'Get file details' })
  @ApiResponse({ status: 200, description: 'File details retrieved successfully.', type: UploadedFileRdo })
  @ApiResponse({ status: 404, description: 'File not found.' })
  public async show(@Param('fileId', MongoIdValidationPipe) fileId: string): Promise<UploadedFileRdo> {
    this.logger.log(`Retrieving file with ID: '${fileId}'`);
    const foundFile = await this.fileUploaderService.getFile(fileId);

    return fillDto(UploadedFileRdo, foundFile.toPOJO());
  }

  @Post('/upload')
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: 'Upload a file' })
  @ApiResponse({ status: 201, description: 'The file has been successfully uploaded.', type: UploadedFileRdo })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  @ApiConsumes('multipart/form-data')
  public async uploadFile(@UploadedFile() file: Express.Multer.File): Promise<UploadedFileRdo> {
    this.logger.log(`Starting file upload for file: '${file.originalname}'`);
    const createdFile = await this.fileUploaderService.saveFile(file);

    return fillDto(UploadedFileRdo, createdFile.toPOJO());
  }
}
