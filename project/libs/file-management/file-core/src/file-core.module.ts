import { Module } from '@nestjs/common';
import { getModelToken, MongooseModule } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { FileUploaderFactory } from './entity/file-uploader.factory';
import { FileModel, FileSchema } from './entity/file.model';
import { FileUploaderMongodbRepository } from './repository/file-uploader-mongodb.repository';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: FileModel.name, schema: FileSchema }])
  ],
  providers: [
    {
      provide: 'FileUploaderRepository',
      useFactory: (fileUploaderFactory: FileUploaderFactory, fileModel: Model<FileModel>) => new FileUploaderMongodbRepository(fileUploaderFactory, fileModel),
      inject: [FileUploaderFactory, getModelToken(FileModel.name)]
    },
    FileUploaderFactory
  ],
  exports: ['FileUploaderRepository']
})

export class FileCoreModule {
}
