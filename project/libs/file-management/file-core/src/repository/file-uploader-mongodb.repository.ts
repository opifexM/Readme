import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { BaseMongoRepository } from '@project/data-access';
import { Model } from 'mongoose';
import { FileUploaderEntity } from '../entity/file-uploader.entity';
import { FileUploaderFactory } from '../entity/file-uploader.factory';
import { FileModel } from '../entity/file.model';
import { FileUploaderRepository } from './file-uploader.repository.interface';

@Injectable()
export class FileUploaderMongodbRepository extends BaseMongoRepository<FileUploaderEntity, FileModel> implements FileUploaderRepository {
  constructor(
    entityFactory: FileUploaderFactory,
    @InjectModel(FileModel.name) fileModel: Model<FileModel>
  ) {
    super(entityFactory, fileModel);
  }
}
