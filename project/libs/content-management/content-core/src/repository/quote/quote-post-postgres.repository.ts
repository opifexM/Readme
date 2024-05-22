import { Injectable, Logger } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaClientService } from '@project/prisma-client';
import { EntityFactory, PostStatus, PostType } from '@project/shared-core';
import { QuotePostEntity } from '../../entity/quote/quote-post.entity';
import { PostPostgresRepository } from '../post/post-postgres.repository';
import { QuotePostRepository } from './quote-post.repository.interface';

export type QuotePostWithDetails = Prisma.PostGetPayload<{
  include: { quoteDetails: true };
}>;

@Injectable()
export class QuotePostPostgresRepository extends PostPostgresRepository<QuotePostEntity> implements QuotePostRepository {
  private readonly logger = new Logger(QuotePostPostgresRepository.name);

  constructor(
    entityFactory: EntityFactory<QuotePostEntity>,
    client: PrismaClientService
  ) {
    super(entityFactory, client);
  }

  private formatPostForPrisma(quotePostEntity: QuotePostEntity) {
    return {
      ...quotePostEntity,
      _id: undefined,
      id: undefined,
      text: undefined,
      author: undefined,
    };
  }

  public convertToQuotePostEntity(createdQuotePost: QuotePostWithDetails | null): QuotePostEntity {
    if (!createdQuotePost) {
      return null;
    }

    const quotePostEntityData = {
      ...createdQuotePost,
      postStatus: createdQuotePost.postStatus as PostStatus,
      postType: createdQuotePost.postType as PostType,
      text: createdQuotePost.quoteDetails?.text,
      author: createdQuotePost.quoteDetails?.author
    };

    return this.createEntityFromDocument(quotePostEntityData);
  }

  public async save(quotePostEntity: QuotePostEntity): Promise<QuotePostEntity> {
    this.logger.log('Attempting to save new quote post');
    const quotePostData = this.formatPostForPrisma(quotePostEntity);

    const createdQuotePost = await this.client.post.create({
      data: {
        ...quotePostData,
        quoteDetails: {
          create: {
            text: quotePostEntity.text,
            author: quotePostEntity.author
          }
        }
      },
      include: { quoteDetails: true }
    });
    this.logger.log(`Quote post saved with ID: '${createdQuotePost.id}'`);

    return this.convertToQuotePostEntity(createdQuotePost);
  }

  public async update(postId: QuotePostEntity['id'], quotePostEntity: QuotePostEntity): Promise<QuotePostEntity> {
    this.logger.log(`Updating quote post ID: '${postId}'`);
    const quotePostData = this.formatPostForPrisma(quotePostEntity);

    const updatedQuotePost = await this.client.post.update({
      where: { id: postId },
      data: {
        ...quotePostData,
        quoteDetails: {
          update: {
            text: quotePostEntity.text,
            author: quotePostEntity.author
          }
        }
      },
      include: { quoteDetails: true }
    });
    this.logger.log(`Quote post updated with ID: '${updatedQuotePost.id}'`);

    return this.convertToQuotePostEntity(updatedQuotePost);
  }

  public async findById(postId: QuotePostEntity['id']): Promise<QuotePostEntity | null> {
    this.logger.log(`Finding quote post by ID: '${postId}'`);
    const quotePostData = await this.client.post.findUnique({
      where: { id: postId },
      include: { quoteDetails: true }
    });

    return this.convertToQuotePostEntity(quotePostData);
  }

  public async deleteById(id: QuotePostEntity['id']): Promise<QuotePostEntity> {
    this.logger.log(`Deleting quote post ID: '${id}'`);
    const deletedPost = await this.client.post.delete({
      where: { id },
      include: { quoteDetails: true }
    });
    this.logger.log(`Quote post deleted with ID: '${deletedPost.id}'`);

    return this.convertToQuotePostEntity(deletedPost);
  }

  public async exists(quotePostId: QuotePostEntity['id']): Promise<boolean> {
    this.logger.log(`Checking existence of quote post ID: '${quotePostId}'`);
    const quotePost = await this.client.quotePost.findUnique({
      where: { id: quotePostId },
      select: { id: true }
    });

    return quotePost !== null;
  }
}
