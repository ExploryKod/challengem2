import { GetMealsUseCase } from './get-meals.use-case';
import { InMemoryAdminMealRepository } from '../../testing/stubs';
import { Meal } from '../../../../ordering/domain/entities/meal.entity';
import { MealType } from '../../../../ordering/domain/enums/meal-type.enum';

describe('GetMealsUseCase', () => {
  it('should return all meals for a restaurant', async () => {
    // Arrange
    const meal1: Meal = {
      id: 1,
      restaurantId: 1,
      title: 'Caesar Salad',
      type: MealType.ENTRY,
      price: 12.99,
      requiredAge: null,
      imageUrl: 'https://example.com/salad.jpg',
    };
    const meal2: Meal = {
      id: 2,
      restaurantId: 1,
      title: 'Grilled Steak',
      type: MealType.MAIN_COURSE,
      price: 24.99,
      requiredAge: null,
      imageUrl: 'https://example.com/steak.jpg',
    };
    const meal3: Meal = {
      id: 3,
      restaurantId: 2,
      title: 'Pizza',
      type: MealType.MAIN_COURSE,
      price: 18.99,
      requiredAge: null,
      imageUrl: 'https://example.com/pizza.jpg',
    };
    const repository = new InMemoryAdminMealRepository([meal1, meal2, meal3]);
    const useCase = new GetMealsUseCase(repository);

    // Act
    const result = await useCase.execute(1);

    // Assert
    expect(result).toHaveLength(2);
    expect(result).toEqual([meal1, meal2]);
  });

  it('should return empty array when no meals exist for restaurant', async () => {
    // Arrange
    const repository = new InMemoryAdminMealRepository([]);
    const useCase = new GetMealsUseCase(repository);

    // Act
    const result = await useCase.execute(1);

    // Assert
    expect(result).toEqual([]);
  });
});
