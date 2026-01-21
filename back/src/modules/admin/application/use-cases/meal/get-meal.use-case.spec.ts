import { GetMealUseCase } from './get-meal.use-case';
import { InMemoryAdminMealRepository } from '../../testing/stubs';
import { Meal } from '../../../../ordering/domain/entities/meal.entity';
import { MealType } from '../../../../ordering/domain/enums/meal-type.enum';

describe('GetMealUseCase', () => {
  it('should return a meal by id', async () => {
    // Arrange
    const meal: Meal = {
      id: 1,
      restaurantId: 1,
      title: 'Caesar Salad',
      type: MealType.ENTRY,
      price: 12.99,
      requiredAge: null,
      imageUrl: 'https://example.com/salad.jpg',
    };
    const repository = new InMemoryAdminMealRepository([meal]);
    const useCase = new GetMealUseCase(repository);

    // Act
    const result = await useCase.execute(1);

    // Assert
    expect(result).toEqual(meal);
  });

  it('should return null when meal not found', async () => {
    // Arrange
    const repository = new InMemoryAdminMealRepository([]);
    const useCase = new GetMealUseCase(repository);

    // Act
    const result = await useCase.execute(999);

    // Assert
    expect(result).toBeNull();
  });
});
