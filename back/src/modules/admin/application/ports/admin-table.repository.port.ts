import { Table } from '../../../ordering/domain/entities/table.entity';

export const ADMIN_TABLE_REPOSITORY = Symbol('ADMIN_TABLE_REPOSITORY');

export interface IAdminTableRepository {
  findByRestaurantId(restaurantId: number): Promise<Table[]>;
  findById(id: number): Promise<Table | null>;
  create(table: Omit<Table, 'id'>): Promise<Table>;
  update(id: number, table: Partial<Omit<Table, 'id'>>): Promise<Table | null>;
  delete(id: number): Promise<boolean>;
}
