import { Injectable, Inject } from '@nestjs/common';
import { Meal } from '../../domain/entities/meal.entity';
import { MealType } from '../../domain/enums/meal-type.enum';
import type { IMealRepository } from '../ports/meal.repository.port';
import { MEAL_REPOSITORY } from '../ports/meal.repository.port';

export interface GetMealsInput {
  restaurantId: string;
  type?: MealType;
}

@Injectable()
export class GetMealsUseCase {
  constructor(
    @Inject(MEAL_REPOSITORY)
    private readonly mealRepository: IMealRepository,
  ) {}

  async execute(input: GetMealsInput): Promise<Meal[]> {
    return this.mealRepository.findByFilters(input);
  }
}
