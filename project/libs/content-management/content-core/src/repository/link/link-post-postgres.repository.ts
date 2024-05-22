import { Injectable, Logger } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaClientService } from '@project/prisma-client';
import { EntityFactory, PostStatus, PostType } from '@project/shared-core';
import { LinkPostEntity } from '../../entity/link/link-post.entity';
import { PostPostgresRepository } from '../post/post-postgres.repository';
import { LinkPostRepository } from './link-post.repository.interface';

export type LinkPostWithDetails = Prisma.PostGetPayload<{
  include: { linkDetails: true };
}>;

@Injectable()
export class LinkPostPostgresRepository extends PostPostgresRepository<LinkPostEntity> implements LinkPostRepository {
  private readonly logger = new Logger(LinkPostPostgresRepository.name);

  constructor(
    entityFactory: EntityFactory<LinkPostEntity>,
    client: PrismaClientService
  ) {
    super(entityFactory, client);
  }

  private formatPostForPrisma(linkPostEntity: LinkPostEntity) {
    return {
      ...linkPostEntity,
      _id: undefined,
      id: undefined,
      url: undefined,
      description: undefined,
    };
  }

  public convertToLinkPostEntity(createdLinkPost: LinkPostWithDetails | null): LinkPostEntity {
    if (!createdLinkPost) {
      return null;
    }

    const linkPostEntityData = {
      ...createdLinkPost,
      postStatus: createdLinkPost.postStatus as PostStatus,
      postType: createdLinkPost.postType as PostType,
      url: createdLinkPost.linkDetails?.url,
      description: createdLinkPost.linkDetails?.description
    };

    return this.createEntityFromDocument(linkPostEntityData);
  }

  public async save(linkPostEntity: LinkPostEntity): Promise<LinkPostEntity> {
    this.logger.log(`Attempting to save new link post`);
    const linkPostData = this.formatPostForPrisma(linkPostEntity);

    const createdLinkPost = await this.client.post.create({
      data: {
        ...linkPostData,
        linkDetails: {
          create: {
            url: linkPostEntity.url,
            description: linkPostEntity.description
          }
        }
      },
      include: { linkDetails: true }
    });
    this.logger.log(`New link post saved with ID: '${createdLinkPost.id}'`);

    return this.convertToLinkPostEntity(createdLinkPost);
  }

  public async update(postId: LinkPostEntity['id'], linkPostEntity: LinkPostEntity): Promise<LinkPostEntity> {
    this.logger.log(`Updating link post ID: '${postId}'`);
    const linkPostData = this.formatPostForPrisma(linkPostEntity);

    const updatedLinkPost = await this.client.post.update({
      where: { id: postId },
      data: {
        ...linkPostData,
        linkDetails: {
          update: {
            url: linkPostEntity.url,
            description: linkPostEntity.description
          }
        }
      },
      include: { linkDetails: true }
    });
    this.logger.log(`Link post updated with ID: '${updatedLinkPost.id}'`);

    return this.convertToLinkPostEntity(updatedLinkPost);
  }

  public async findById(postId: LinkPostEntity['id']): Promise<LinkPostEntity | null> {
    this.logger.log(`Finding link post by ID: '${postId}'`);
    const linkPostData = await this.client.post.findUnique({
      where: { id: postId },
      include: { linkDetails: true }
    });

    return this.convertToLinkPostEntity(linkPostData);
  }

  public async deleteById(id: LinkPostEntity['id']): Promise<LinkPostEntity> {
    this.logger.log(`Deleting link post ID: '${id}'`);
    const deletedPost = await this.client.post.delete({
      where: { id },
      include: { linkDetails: true }
    });
    this.logger.log(`Link post deleted with ID: '${deletedPost.id}'`);

    return this.convertToLinkPostEntity(deletedPost);
  }

  public async exists(linkPostId: LinkPostEntity['id']): Promise<boolean> {
    this.logger.log(`Checking existence of link post ID: '${linkPostId}'`);
    const linkPost = await this.client.linkPost.findUnique({
      where: { id: linkPostId },
      select: { id: true }
    });

    return linkPost !== null;
  }
}
