import { Table } from '../../domain/entities/table.entity';

export const TABLE_REPOSITORY = Symbol('TABLE_REPOSITORY');

export interface ITableRepository {
  findByRestaurantId(restaurantId: number): Promise<Table[]>;
  findById(id: number): Promise<Table | null>;
}
