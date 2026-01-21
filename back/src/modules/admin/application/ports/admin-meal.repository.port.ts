import { Meal } from '../../../ordering/domain/entities/meal.entity';

export const ADMIN_MEAL_REPOSITORY = Symbol('ADMIN_MEAL_REPOSITORY');

export interface IAdminMealRepository {
  findByRestaurantId(restaurantId: number): Promise<Meal[]>;
  findById(id: number): Promise<Meal | null>;
  create(meal: Omit<Meal, 'id'>): Promise<Meal>;
  update(id: number, meal: Partial<Omit<Meal, 'id'>>): Promise<Meal | null>;
  delete(id: number): Promise<boolean>;
}
