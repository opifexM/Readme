import { BadRequestException, Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { ApplicationConfig } from '@project/file-config';
import 'multer';
import { FileUploaderEntity, FileUploaderFactory, FileUploaderRepository } from '@project/file-core';
import { StoredFile } from '@project/shared-core';
import dayjs from 'dayjs';
import { ensureDir } from 'fs-extra';
import { randomUUID } from 'node:crypto';
import { writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { extname } from 'path';
import {
  FILE_ALLOWED_EXTENSIONS,
  FILE_DATE_FORMAT,
  FILE_UNKNOWN_TYPE,
  FILE_UNSUPPORTED_TYPE
} from './file-uploader.constant';

@Injectable()
export class FileUploaderService {
  private readonly logger = new Logger(FileUploaderService.name);

  constructor(
    @Inject('FileUploaderRepository') private readonly fileUploaderRepository: FileUploaderRepository,
    @Inject(ApplicationConfig.KEY) private readonly applicationConfig: ConfigType<typeof ApplicationConfig>
  ) {
  }

  private getUploadDirectoryPath(): string {
    return this.applicationConfig.uploadDirectoryPath;
  }

  private getSubUploadDirectoryPath(): string {
    const [year, month] = dayjs().format(FILE_DATE_FORMAT).split(' ');
    return join(year, month);
  }

  private getDestinationFilePath(filename: string): string {
    return join(this.getUploadDirectoryPath(), this.getSubUploadDirectoryPath(), filename);
  }

  public async writeFile(file: Express.Multer.File): Promise<StoredFile> {
    const fileExtension = extname(file.originalname);
    if (!fileExtension) {
      this.logger.warn(`Unknown file type received: ${file.mimetype}`);
      throw new BadRequestException(FILE_UNKNOWN_TYPE);
    }
    if (!FILE_ALLOWED_EXTENSIONS.includes(fileExtension)) {
      this.logger.warn(`Unsupported file type attempt: ${fileExtension}`);
      throw new BadRequestException(FILE_UNSUPPORTED_TYPE);
    }

    try {
      const uploadDirectoryPath = this.getUploadDirectoryPath();
      const subDirectory = this.getSubUploadDirectoryPath();
      const filename = `${randomUUID()}.${fileExtension}`;
      const path = this.getDestinationFilePath(filename);
      await ensureDir(join(uploadDirectoryPath, subDirectory));
      await writeFile(path, file.buffer);
      this.logger.log(`File written successfully at ${path}`);

      return {
        fileExtension,
        filename,
        path,
        subDirectory,
      };
    } catch (error) {
      this.logger.error(`Error while saving file: ${error.message}`);
      throw new BadRequestException(`Can't save file`);
    }
  }

  public async saveFile(file: Express.Multer.File): Promise<FileUploaderEntity> {
    const storedFile = await this.writeFile(file);
    if (!storedFile) {
      throw new BadRequestException(`Can't save file`);
    }

    const fileEntity = new FileUploaderFactory().create({
      hashName: storedFile.filename,
      mimetype: file.mimetype,
      originalName: file.originalname,
      path: storedFile.path,
      size: file.size,
      subDirectory: storedFile.subDirectory,
      createdAt: undefined,
      updatedAt: undefined,
    });
    const savedFile = await this.fileUploaderRepository.save(fileEntity);
    this.logger.log(`File saved in database with ID: '${savedFile.id}'`);

    return savedFile
  }

  public async getFile(fileId: string): Promise<FileUploaderEntity> {
    this.logger.log(`Retrieving file with ID: '${fileId}'`);
    const existFile = await this.fileUploaderRepository.findById(fileId);
    if (!existFile) {
      this.logger.warn(`File not found with ID: '${fileId}'`);
      throw new NotFoundException(`File with '${fileId}' not found.`);
    }

    return existFile;
  }
}
