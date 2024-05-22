import { TextPost } from '@project/shared-core';
import { PostEntity } from '../post/post.entity';

export class TextPostEntity extends PostEntity  {
  public title: string;
  public announcement: string;
  public text: string;

  constructor(textPost?: TextPost) {
    super();
    this.populate(textPost);
  }

  public populate(textPost?: TextPost): void {
    super.populate(textPost);

    if (!textPost) {
      return;
    }

    this.title = textPost.title;
    this.announcement = textPost.announcement;
    this.text = textPost.text;
  }

  public toPOJO() {
    return {
      ...super.toPOJO(),
      title: this.title,
      announcement: this.announcement,
      text: this.text,
    };
  }
}
