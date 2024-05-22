import { LinkPost } from '@project/shared-core';
import { PostEntity } from '../post/post.entity';

export class LinkPostEntity extends PostEntity  {
  public url: string;
  public description: string;

  constructor(linkPost?: LinkPost) {
    super();
    this.populate(linkPost);
  }

  public populate(linkPost?: LinkPost): void {
    super.populate(linkPost);

    if (!linkPost) {
      return;
    }

    this.url = linkPost.url;
    this.description = linkPost.description;
  }

  public toPOJO() {
    return {
      ...super.toPOJO(),
      url: this.url,
      description: this.description,
    };
  }
}
