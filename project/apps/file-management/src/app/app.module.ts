import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FileConfigModule } from '@project/file-config';
import { FileUploaderModule } from '@project/file-uploader';
import { getMongooseOptions } from '@project/user-config';

@Module({
  imports: [
    FileUploaderModule,
    FileConfigModule,
    MongooseModule.forRootAsync(
      getMongooseOptions()
    )
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
