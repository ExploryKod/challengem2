import { Restaurant } from '../../domain/entities/restaurant.entity';

export const RESTAURANT_REPOSITORY = Symbol('RESTAURANT_REPOSITORY');

export interface IRestaurantRepository {
  findAll(): Promise<Restaurant[]>;
  findById(id: number): Promise<Restaurant | null>;
}
