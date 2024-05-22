import { QuotePost } from '@project/shared-core';
import { PostEntity } from '../post/post.entity';

export class QuotePostEntity extends PostEntity  {
  public text: string;
  public author: string;

  constructor(quotePost?: QuotePost) {
    super();
    this.populate(quotePost);
  }

  public populate(quotePost?: QuotePost): void {
    super.populate(quotePost);

    if (!quotePost) {
      return;
    }

    this.text = quotePost.text;
    this.author = quotePost.author;
  }

  public toPOJO() {
    return {
      ...super.toPOJO(),
      text: this.text,
      author: this.author,
    };
  }
}
