import { Injectable, Inject } from '@nestjs/common';
import { Meal } from '../../../../ordering/domain/entities/meal.entity';
import type { IAdminMealRepository } from '../../ports/admin-meal.repository.port';
import { ADMIN_MEAL_REPOSITORY } from '../../ports/admin-meal.repository.port';
import { MealType } from '../../../../ordering/domain/enums/meal-type.enum';

export interface CreateMealInput {
  restaurantId: number;
  title: string;
  type: MealType;
  price: number;
  requiredAge: number | null;
  imageUrl: string;
}

@Injectable()
export class CreateMealUseCase {
  constructor(
    @Inject(ADMIN_MEAL_REPOSITORY)
    private readonly repository: IAdminMealRepository,
  ) {}

  async execute(input: CreateMealInput): Promise<Meal> {
    return this.repository.create(input);
  }
}
