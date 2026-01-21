import { Controller, Get, Query, ParseIntPipe, BadRequestException } from '@nestjs/common';
import { GetMealsUseCase } from '../../../application/use-cases/get-meals.use-case';
import { Meal } from '../../../domain/entities/meal.entity';
import { MealType } from '../../../domain/enums/meal-type.enum';

@Controller('meals')
export class MealController {
  constructor(private readonly getMealsUseCase: GetMealsUseCase) {}

  @Get()
  async findByFilters(
    @Query('restaurantId', new ParseIntPipe({ 
      errorHttpStatusCode: 400,
      exceptionFactory: () => new BadRequestException('restaurantId must be a valid number')
    })) restaurantId: number,
    @Query('type') type?: MealType,
  ): Promise<Meal[]> {
    return this.getMealsUseCase.execute({ restaurantId, type });
  }
}
