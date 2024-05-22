import { Repository } from '@project/data-access';
import { FileUploaderEntity } from '../entity/file-uploader.entity';

export interface FileUploaderRepository extends Repository<FileUploaderEntity> {
}
