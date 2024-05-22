import { Injectable, Logger } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaClientService } from '@project/prisma-client';
import { EntityFactory, PostStatus, PostType } from '@project/shared-core';
import { TextPostEntity } from '../../entity/text/text-post.entity';
import { PostPostgresRepository } from '../post/post-postgres.repository';
import { TextPostRepository } from './text-post.repository.interface';

export type TextPostWithDetails = Prisma.PostGetPayload<{
  include: { textDetails: true };
}>;

@Injectable()
export class TextPostPostgresRepository extends PostPostgresRepository<TextPostEntity> implements TextPostRepository {
  private readonly logger = new Logger(TextPostPostgresRepository.name);

  constructor(
    entityFactory: EntityFactory<TextPostEntity>,
    client: PrismaClientService
  ) {
    super(entityFactory, client);
  }

  private formatPostForPrisma(textPostEntity: TextPostEntity) {
    return {
      ...textPostEntity,
      _id: undefined,
      id: undefined,
      title: undefined,
      announcement: undefined,
      text: undefined,
    };
  }

  public convertToTextPostEntity(createdTextPost: TextPostWithDetails | null): TextPostEntity {
    if (!createdTextPost) {
      return null;
    }

    const textPostEntityData = {
      ...createdTextPost,
      postStatus: createdTextPost.postStatus as PostStatus,
      postType: createdTextPost.postType as PostType,
      title: createdTextPost.textDetails?.title,
      announcement: createdTextPost.textDetails?.announcement,
      text: createdTextPost.textDetails?.text
    };

    return this.createEntityFromDocument(textPostEntityData);
  }

  public async save(textPostEntity: TextPostEntity): Promise<TextPostEntity> {
    this.logger.log('Attempting to save new text post');
    const textPostData = this.formatPostForPrisma(textPostEntity);

    const createdTextPost = await this.client.post.create({
      data: {
        ...textPostData,
        textDetails: {
          create: {
            title: textPostEntity.title,
            announcement: textPostEntity.announcement,
            text: textPostEntity.text,
          }
        }
      },
      include: { textDetails: true }
    });
    this.logger.log(`Text post saved with ID: '${createdTextPost.id}'`);

    return this.convertToTextPostEntity(createdTextPost);
  }

  public async update(postId: TextPostEntity['id'], textPostEntity: TextPostEntity): Promise<TextPostEntity> {
    this.logger.log(`Updating text post ID: '${postId}'`);
    const textPostData = this.formatPostForPrisma(textPostEntity);

    const updatedTextPost = await this.client.post.update({
      where: { id: postId },
      data: {
        ...textPostData,
        textDetails: {
          update: {
            title: textPostEntity.title,
            announcement: textPostEntity.announcement,
            text: textPostEntity.text,
          }
        }
      },
      include: { textDetails: true }
    });
    this.logger.log(`Text post updated with ID: '${updatedTextPost.id}'`);

    return this.convertToTextPostEntity(updatedTextPost);
  }

  public async findById(postId: TextPostEntity['id']): Promise<TextPostEntity | null> {
    this.logger.log(`Finding text post by ID: '${postId}'`);
    const textPostData = await this.client.post.findUnique({
      where: { id: postId },
      include: { textDetails: true }
    });

    return this.convertToTextPostEntity(textPostData);
  }

  public async deleteById(id: TextPostEntity['id']): Promise<TextPostEntity> {
    this.logger.log(`Deleting text post ID: '${id}'`);
    const deletedPost = await this.client.post.delete({
      where: { id },
      include: { textDetails: true }
    });
    this.logger.log(`Text post deleted with ID: '${deletedPost.id}'`);

    return this.convertToTextPostEntity(deletedPost);
  }

  public async exists(textPostId: TextPostEntity['id']): Promise<boolean> {
    this.logger.log(`Checking existence of text post ID: '${textPostId}'`);
    const textPost = await this.client.textPost.findUnique({
      where: { id: textPostId },
      select: { id: true }
    });

    return textPost !== null;
  }
}
