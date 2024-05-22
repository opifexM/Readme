import { Injectable } from '@nestjs/common';
import { Comment, EntityFactory } from '@project/shared-core';
import { CommentEntity } from './comment.entity';

@Injectable()
export class CommentFactory implements EntityFactory<CommentEntity> {
  public create(entityPlainData: Comment): CommentEntity {
    return new CommentEntity(entityPlainData)
  }
}
