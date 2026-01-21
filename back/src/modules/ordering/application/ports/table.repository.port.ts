import { Table } from '../../domain/entities/table.entity';

export const TABLE_REPOSITORY = Symbol('TABLE_REPOSITORY');

export interface ITableRepository {
  findByRestaurantId(restaurantId: string): Promise<Table[]>;
  findById(id: string): Promise<Table | null>;
}
