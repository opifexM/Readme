import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class UploadedFileRdo {
  @Expose()
  @ApiProperty({
    description: 'Unique identifier for the file',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  public id: string;

  @Expose()
  @ApiProperty({
    description: 'The original name of the file as uploaded by the user',
    example: 'example.png'
  })
  public originalName: string;

  @Expose()
  @ApiProperty({
    description: 'Hashed name of the file to ensure uniqueness',
    example: 'hashed_name_example.png'
  })
  public hashName: string;

  @Expose()
  @ApiProperty({
    description: 'Subdirectory under the main storage directory where the file is stored',
    example: 'uploads/images'
  })
  public subDirectory: string;

  @Expose()
  @ApiProperty({
    description: 'MIME type of the file',
    example: 'image/png'
  })
  public mimetype: string;

  @Expose()
  @ApiProperty({
    description: 'Size of the file in bytes',
    example: 2048
  })
  public size: number;
}
