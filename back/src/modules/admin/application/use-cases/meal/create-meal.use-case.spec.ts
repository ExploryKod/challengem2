import { CreateMealUseCase } from './create-meal.use-case';
import { InMemoryAdminMealRepository } from '../../testing/stubs';
import { MealType } from '../../../../ordering/domain/enums/meal-type.enum';

describe('CreateMealUseCase', () => {
  it('should create a meal and return it with id', async () => {
    // Arrange
    const repository = new InMemoryAdminMealRepository([]);
    const useCase = new CreateMealUseCase(repository);
    const input = {
      restaurantId: 1,
      title: 'Caesar Salad',
      type: MealType.ENTRY,
      price: 12.99,
      requiredAge: null,
      imageUrl: 'https://example.com/salad.jpg',
    };

    // Act
    const result = await useCase.execute(input);

    // Assert
    expect(result.id).toBeDefined();
    expect(result.restaurantId).toBe(1);
    expect(result.title).toBe('Caesar Salad');
    expect(result.type).toBe(MealType.ENTRY);
    expect(result.price).toBe(12.99);
    expect(result.requiredAge).toBeNull();
    expect(result.imageUrl).toBe('https://example.com/salad.jpg');
  });

  it('should persist the created meal', async () => {
    // Arrange
    const repository = new InMemoryAdminMealRepository([]);
    const useCase = new CreateMealUseCase(repository);
    const input = {
      restaurantId: 1,
      title: 'Red Wine',
      type: MealType.DRINK,
      price: 8.99,
      requiredAge: 18,
      imageUrl: 'https://example.com/wine.jpg',
    };

    // Act
    const created = await useCase.execute(input);
    const found = await repository.findById(created.id);

    // Assert
    expect(found).toEqual(created);
  });
});
