import { Meal } from '../../../../ordering/domain/entities/meal.entity';
import type { IAdminMealRepository } from '../../ports/admin-meal.repository.port';

export class InMemoryAdminMealRepository implements IAdminMealRepository {
  private meals: Meal[] = [];
  private nextId = 1;

  constructor(initialData: Meal[] = []) {
    this.meals = [...initialData];
    if (initialData.length > 0) {
      this.nextId = Math.max(...initialData.map((m) => m.id)) + 1;
    }
  }

  findByRestaurantId(restaurantId: number): Promise<Meal[]> {
    const found = this.meals.filter((m) => m.restaurantId === restaurantId);
    return Promise.resolve([...found]);
  }

  findById(id: number): Promise<Meal | null> {
    const found = this.meals.find((m) => m.id === id) ?? null;
    return Promise.resolve(found);
  }

  create(data: Omit<Meal, 'id'>): Promise<Meal> {
    const meal = new Meal();
    meal.id = this.nextId++;
    meal.restaurantId = data.restaurantId;
    meal.title = data.title;
    meal.type = data.type;
    meal.price = data.price;
    meal.requiredAge = data.requiredAge;
    meal.imageUrl = data.imageUrl;
    this.meals.push(meal);
    return Promise.resolve(meal);
  }

  update(
    id: number,
    data: Partial<Omit<Meal, 'id'>>,
  ): Promise<Meal | null> {
    const index = this.meals.findIndex((m) => m.id === id);
    if (index === -1) return Promise.resolve(null);

    const existing = this.meals[index];
    if (data.restaurantId !== undefined) existing.restaurantId = data.restaurantId;
    if (data.title !== undefined) existing.title = data.title;
    if (data.type !== undefined) existing.type = data.type;
    if (data.price !== undefined) existing.price = data.price;
    if (data.requiredAge !== undefined) existing.requiredAge = data.requiredAge;
    if (data.imageUrl !== undefined) existing.imageUrl = data.imageUrl;

    return Promise.resolve(existing);
  }

  delete(id: number): Promise<boolean> {
    const index = this.meals.findIndex((m) => m.id === id);
    if (index === -1) return Promise.resolve(false);
    this.meals.splice(index, 1);
    return Promise.resolve(true);
  }
}
