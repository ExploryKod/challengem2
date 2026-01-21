import { Injectable, Inject } from '@nestjs/common';
import { Meal } from '../../../../ordering/domain/entities/meal.entity';
import type { IAdminMealRepository } from '../../ports/admin-meal.repository.port';
import { ADMIN_MEAL_REPOSITORY } from '../../ports/admin-meal.repository.port';

@Injectable()
export class GetMealsUseCase {
  constructor(
    @Inject(ADMIN_MEAL_REPOSITORY)
    private readonly repository: IAdminMealRepository,
  ) {}

  async execute(restaurantId: number): Promise<Meal[]> {
    return this.repository.findByRestaurantId(restaurantId);
  }
}
