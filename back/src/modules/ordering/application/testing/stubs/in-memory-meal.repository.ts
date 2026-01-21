import { Meal } from '../../../domain/entities/meal.entity';
import type {
  IMealRepository,
  MealFilters,
} from '../../ports/meal.repository.port';

export class InMemoryMealRepository implements IMealRepository {
  private meals: Meal[] = [];

  constructor(initialData: Meal[] = []) {
    this.meals = [...initialData];
  }

  findByFilters(filters: MealFilters): Promise<Meal[]> {
    const results = this.meals.filter((m) => {
      if (m.restaurantId !== filters.restaurantId) return false;
      if (filters.type !== undefined && m.type !== filters.type) return false;
      return true;
    });
    return Promise.resolve(results);
  }
}
