import { Meal } from '../../domain/entities/meal.entity';
import { MealType } from '../../domain/enums/meal-type.enum';

export const MEAL_REPOSITORY = Symbol('MEAL_REPOSITORY');

export interface MealFilters {
  restaurantId: number;
  type?: MealType;
}

export interface IMealRepository {
  findByFilters(filters: MealFilters): Promise<Meal[]>;
  findByIds(ids: number[]): Promise<Meal[]>;
}
