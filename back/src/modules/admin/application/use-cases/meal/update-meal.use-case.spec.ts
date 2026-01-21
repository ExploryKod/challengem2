import { UpdateMealUseCase } from './update-meal.use-case';
import { InMemoryAdminMealRepository } from '../../testing/stubs';
import { Meal } from '../../../../ordering/domain/entities/meal.entity';
import { MealType } from '../../../../ordering/domain/enums/meal-type.enum';

describe('UpdateMealUseCase', () => {
  it('should update a meal and return the updated version', async () => {
    // Arrange
    const meal: Meal = {
      id: 1,
      restaurantId: 1,
      title: 'Old Title',
      type: MealType.ENTRY,
      price: 10.0,
      requiredAge: null,
      imageUrl: 'https://example.com/old.jpg',
    };
    const repository = new InMemoryAdminMealRepository([meal]);
    const useCase = new UpdateMealUseCase(repository);

    // Act
    const result = await useCase.execute(1, {
      title: 'New Title',
      price: 15.99,
    });

    // Assert
    expect(result).not.toBeNull();
    expect(result!.title).toBe('New Title');
    expect(result!.price).toBe(15.99);
  });

  it('should return null when meal not found', async () => {
    // Arrange
    const repository = new InMemoryAdminMealRepository([]);
    const useCase = new UpdateMealUseCase(repository);

    // Act
    const result = await useCase.execute(999, { title: 'New Title' });

    // Assert
    expect(result).toBeNull();
  });

  it('should only update provided fields', async () => {
    // Arrange
    const meal: Meal = {
      id: 1,
      restaurantId: 1,
      title: 'Original Title',
      type: MealType.MAIN_COURSE,
      price: 20.0,
      requiredAge: null,
      imageUrl: 'https://example.com/original.jpg',
    };
    const repository = new InMemoryAdminMealRepository([meal]);
    const useCase = new UpdateMealUseCase(repository);

    // Act
    const result = await useCase.execute(1, { price: 25.0 });

    // Assert
    expect(result).not.toBeNull();
    expect(result!.title).toBe('Original Title');
    expect(result!.type).toBe(MealType.MAIN_COURSE);
    expect(result!.price).toBe(25.0);
    expect(result!.imageUrl).toBe('https://example.com/original.jpg');
  });
});
