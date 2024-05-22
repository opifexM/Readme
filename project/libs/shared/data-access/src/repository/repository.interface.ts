import { Entity } from '@project/shared-core';

export interface Repository<T extends Entity> {
  findById(id: T['id']): Promise<T | null>;

  save(entity: T): Promise<T>;

  update(id: T['id'], entity: T): Promise<T>;

  deleteById(id: T['id']): Promise<T>;

  exists(id: T['id']): Promise<boolean>;
}
