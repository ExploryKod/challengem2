import { Table } from '../../../../ordering/domain/entities/table.entity';
import type { IAdminTableRepository } from '../../ports/admin-table.repository.port';

export class InMemoryAdminTableRepository implements IAdminTableRepository {
  private tables: Table[] = [];
  private nextId = 1;

  constructor(initialData: Table[] = []) {
    this.tables = [...initialData];
    if (initialData.length > 0) {
      this.nextId = Math.max(...initialData.map((t) => t.id)) + 1;
    }
  }

  findByRestaurantId(restaurantId: number): Promise<Table[]> {
    const found = this.tables.filter((t) => t.restaurantId === restaurantId);
    return Promise.resolve([...found]);
  }

  findById(id: number): Promise<Table | null> {
    const found = this.tables.find((t) => t.id === id) ?? null;
    return Promise.resolve(found);
  }

  create(data: Omit<Table, 'id'>): Promise<Table> {
    const table = new Table();
    table.id = this.nextId++;
    table.restaurantId = data.restaurantId;
    table.title = data.title;
    table.capacity = data.capacity;
    this.tables.push(table);
    return Promise.resolve(table);
  }

  update(id: number, data: Partial<Omit<Table, 'id'>>): Promise<Table | null> {
    const index = this.tables.findIndex((t) => t.id === id);
    if (index === -1) return Promise.resolve(null);

    const existing = this.tables[index];
    if (data.restaurantId !== undefined)
      existing.restaurantId = data.restaurantId;
    if (data.title !== undefined) existing.title = data.title;
    if (data.capacity !== undefined) existing.capacity = data.capacity;

    return Promise.resolve(existing);
  }

  delete(id: number): Promise<boolean> {
    const index = this.tables.findIndex((t) => t.id === id);
    if (index === -1) return Promise.resolve(false);
    this.tables.splice(index, 1);
    return Promise.resolve(true);
  }
}
