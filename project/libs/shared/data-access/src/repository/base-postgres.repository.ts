import { PrismaClientService } from '@project/prisma-client';
import { Entity, EntityFactory, StorableEntity } from '@project/shared-core';

export abstract class BasePostgresRepository<
  T extends Entity & StorableEntity<ReturnType<T['toPOJO']>>
> {
  protected constructor(
    protected readonly entityFactory: EntityFactory<T>,
    protected readonly client: PrismaClientService
  ) {}

  protected createEntityFromDocument(entityDocument): T | null {
    if (!entityDocument) {
      return null;
    }

    return this.entityFactory.create(entityDocument as ReturnType<T['toPOJO']>);
  }
}
