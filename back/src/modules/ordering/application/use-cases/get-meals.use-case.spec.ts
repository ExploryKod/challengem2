import { GetMealsUseCase } from './get-meals.use-case';
import { InMemoryMealRepository } from '../testing/stubs';
import { Meal } from '../../domain/entities/meal.entity';
import { MealType } from '../../domain/enums/meal-type.enum';

describe('GetMealsUseCase', () => {
  const createMeal = (overrides: Partial<Meal>): Meal => ({
    id: 'meal-1',
    restaurantId: 'restaurant-1',
    title: 'Default Meal',
    type: MealType.ENTRY,
    price: 10,
    requiredAge: null,
    imageUrl: 'https://example.com/meal.jpg',
    ...overrides,
  });

  it('should return all meals for a restaurant', async () => {
    // Arrange
    const entry = createMeal({
      id: 'meal-1',
      title: 'Salad',
      type: MealType.ENTRY,
    });
    const mainCourse = createMeal({
      id: 'meal-2',
      title: 'Steak',
      type: MealType.MAIN_COURSE,
    });
    const dessert = createMeal({
      id: 'meal-3',
      title: 'Cake',
      type: MealType.DESSERT,
    });
    const repository = new InMemoryMealRepository([entry, mainCourse, dessert]);
    const useCase = new GetMealsUseCase(repository);

    // Act
    const result = await useCase.execute({ restaurantId: 'restaurant-1' });

    // Assert
    expect(result).toHaveLength(3);
    expect(result).toEqual([entry, mainCourse, dessert]);
  });

  it('should filter meals by type', async () => {
    // Arrange
    const entry1 = createMeal({
      id: 'meal-1',
      title: 'Salad',
      type: MealType.ENTRY,
    });
    const entry2 = createMeal({
      id: 'meal-2',
      title: 'Soup',
      type: MealType.ENTRY,
    });
    const mainCourse = createMeal({
      id: 'meal-3',
      title: 'Steak',
      type: MealType.MAIN_COURSE,
    });
    const repository = new InMemoryMealRepository([entry1, entry2, mainCourse]);
    const useCase = new GetMealsUseCase(repository);

    // Act
    const result = await useCase.execute({
      restaurantId: 'restaurant-1',
      type: MealType.ENTRY,
    });

    // Assert
    expect(result).toHaveLength(2);
    expect(result).toEqual([entry1, entry2]);
    expect(result.every((m) => m.type === MealType.ENTRY)).toBe(true);
  });

  it('should return empty array when no meals match filters', async () => {
    // Arrange
    const mainCourse = createMeal({
      id: 'meal-1',
      title: 'Steak',
      type: MealType.MAIN_COURSE,
    });
    const repository = new InMemoryMealRepository([mainCourse]);
    const useCase = new GetMealsUseCase(repository);

    // Act
    const result = await useCase.execute({
      restaurantId: 'restaurant-1',
      type: MealType.DESSERT,
    });

    // Assert
    expect(result).toEqual([]);
  });
});
