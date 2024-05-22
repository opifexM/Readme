import { Entity, EntityFactory, StorableEntity } from '@project/shared-core';
import * as crypto from 'node:crypto';
import { Repository } from './repository.interface';

export abstract class BaseMemoryRepository<
  T extends Entity & StorableEntity<ReturnType<T['toPOJO']>>
> implements Repository<T> {

  protected entities: Map<T['id'], ReturnType<T['toPOJO']>> = new Map();

  protected constructor(
    protected readonly entityFactory: EntityFactory<T>
  ) {}

  public async findById(id: T['id']): Promise<T> {
    const foundEntity = this.entities.get(id) || null;
    if (!foundEntity) {
      return null;
    }

    return this.entityFactory.create(foundEntity);
  }

  public async save(entity: T): Promise<T> {
    if (!entity.id) {
      entity.id = crypto.randomUUID();
    }

    const entityPOJO = entity.toPOJO();
    this.entities.set(entity.id, entityPOJO);

    return this.entityFactory.create(entityPOJO);
  }

  public async update(id: T['id'], entity: T): Promise<T> {
    const entityToUpdate = this.entities.get(id) || null;
    if (!entityToUpdate) {
      throw new Error('Entity not found');
    }

    Object.entries(entity).forEach(([key, value]) => {
      (entityToUpdate)[key] = value;
    });

    this.entities.set(id, entityToUpdate);

    return this.entityFactory.create(entityToUpdate);
  }

  public async deleteById(id: T['id']): Promise<T> {
    const foundEntity = this.entities.get(id) || null;
    if (!foundEntity) {
      throw new Error('Entity not found');
    }

    this.entities.delete(id);
    return this.entityFactory.create(foundEntity);
  }

  public async exists(id: T["id"]): Promise<boolean> {
    return this.entities.has(id);
  }
}
