import { Table } from '../../../domain/entities/table.entity';
import type { ITableRepository } from '../../ports/table.repository.port';

export class InMemoryTableRepository implements ITableRepository {
  private tables: Table[] = [];

  constructor(initialData: Table[] = []) {
    this.tables = [...initialData];
  }

  findByRestaurantId(restaurantId: string): Promise<Table[]> {
    const results = this.tables.filter((t) => t.restaurantId === restaurantId);
    return Promise.resolve(results);
  }

  findById(id: string): Promise<Table | null> {
    const found = this.tables.find((t) => t.id === id) ?? null;
    return Promise.resolve(found);
  }
}
