import { Restaurant } from '../../../../ordering/domain/entities/restaurant.entity';
import type { IAdminRestaurantRepository } from '../../ports/admin-restaurant.repository.port';

export class InMemoryAdminRestaurantRepository implements IAdminRestaurantRepository {
  private restaurants: Restaurant[] = [];
  private nextId = 1;

  constructor(initialData: Restaurant[] = []) {
    this.restaurants = [...initialData];
    if (initialData.length > 0) {
      this.nextId = Math.max(...initialData.map((r) => r.id)) + 1;
    }
  }

  findAll(): Promise<Restaurant[]> {
    return Promise.resolve([...this.restaurants]);
  }

  findById(id: number): Promise<Restaurant | null> {
    const found = this.restaurants.find((r) => r.id === id) ?? null;
    return Promise.resolve(found);
  }

  create(data: Omit<Restaurant, 'id'>): Promise<Restaurant> {
    const restaurant = new Restaurant();
    restaurant.id = this.nextId++;
    restaurant.name = data.name;
    restaurant.type = data.type;
    restaurant.stars = data.stars;
    this.restaurants.push(restaurant);
    return Promise.resolve(restaurant);
  }

  update(
    id: number,
    data: Partial<Omit<Restaurant, 'id'>>,
  ): Promise<Restaurant | null> {
    const index = this.restaurants.findIndex((r) => r.id === id);
    if (index === -1) return Promise.resolve(null);

    const existing = this.restaurants[index];
    if (data.name !== undefined) existing.name = data.name;
    if (data.type !== undefined) existing.type = data.type;
    if (data.stars !== undefined) existing.stars = data.stars;

    return Promise.resolve(existing);
  }

  delete(id: number): Promise<boolean> {
    const index = this.restaurants.findIndex((r) => r.id === id);
    if (index === -1) return Promise.resolve(false);
    this.restaurants.splice(index, 1);
    return Promise.resolve(true);
  }
}
