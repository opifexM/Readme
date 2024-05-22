import { Comment, Entity, StorableEntity } from '@project/shared-core';

export class CommentEntity extends Entity implements StorableEntity<Comment> {
  public text: string;
  public postId: string;
  public authorId: string;
  public createdAt: Date;

  constructor(comment?: Comment) {
    super();
    this.populate(comment);
  }

  public populate(comment?: Comment): void {
    if (!comment) {
      return;
    }

    this.id = comment.id ?? '';
    this.text = comment.text;
    this.postId = comment.postId;
    this.authorId = comment.authorId;
    this.createdAt = comment.createdAt ?? new Date();
  }

  public toPOJO() {
    return {
      id: this.id,
      text: this.text,
      postId: this.postId,
      authorId: this.authorId,
      createdAt: this.createdAt
    };
  }
}
