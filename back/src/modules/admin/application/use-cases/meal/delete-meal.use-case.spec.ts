import { DeleteMealUseCase } from './delete-meal.use-case';
import { InMemoryAdminMealRepository } from '../../testing/stubs';
import { Meal } from '../../../../ordering/domain/entities/meal.entity';
import { MealType } from '../../../../ordering/domain/enums/meal-type.enum';

describe('DeleteMealUseCase', () => {
  it('should delete a meal and return true', async () => {
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
    const useCase = new DeleteMealUseCase(repository);

    // Act
    const result = await useCase.execute(1);

    // Assert
    expect(result).toBe(true);
  });

  it('should actually remove the meal from repository', async () => {
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
    const useCase = new DeleteMealUseCase(repository);

    // Act
    await useCase.execute(1);
    const found = await repository.findById(1);

    // Assert
    expect(found).toBeNull();
  });

  it('should return false when meal not found', async () => {
    // Arrange
    const repository = new InMemoryAdminMealRepository([]);
    const useCase = new DeleteMealUseCase(repository);

    // Act
    const result = await useCase.execute(999);

    // Assert
    expect(result).toBe(false);
  });
});
