import { Restaurant } from '../../../domain/entities/restaurant.entity';
import type { IRestaurantRepository } from '../../ports/restaurant.repository.port';

export class InMemoryRestaurantRepository implements IRestaurantRepository {
  private restaurants: Restaurant[] = [];

  constructor(initialData: Restaurant[] = []) {
    this.restaurants = [...initialData];
  }

  findAll(): Promise<Restaurant[]> {
    return Promise.resolve([...this.restaurants]);
  }

  findById(id: number): Promise<Restaurant | null> {
    const found = this.restaurants.find((r) => r.id === id) ?? null;
    return Promise.resolve(found);
  }
}
