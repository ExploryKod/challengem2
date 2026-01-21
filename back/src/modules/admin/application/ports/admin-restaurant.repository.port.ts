import { Restaurant } from '../../../ordering/domain/entities/restaurant.entity';

export const ADMIN_RESTAURANT_REPOSITORY = Symbol('ADMIN_RESTAURANT_REPOSITORY');

export interface IAdminRestaurantRepository {
  findAll(): Promise<Restaurant[]>;
  findById(id: number): Promise<Restaurant | null>;
  create(restaurant: Omit<Restaurant, 'id'>): Promise<Restaurant>;
  update(id: number, restaurant: Partial<Omit<Restaurant, 'id'>>): Promise<Restaurant | null>;
  delete(id: number): Promise<boolean>;
}
