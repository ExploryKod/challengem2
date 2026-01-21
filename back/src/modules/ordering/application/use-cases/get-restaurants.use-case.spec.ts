import { GetRestaurantsUseCase } from './get-restaurants.use-case';
import { InMemoryRestaurantRepository } from '../testing/stubs';
import { Restaurant } from '../../domain/entities/restaurant.entity';

describe('GetRestaurantsUseCase', () => {
  it('should return all restaurants when repository has data', async () => {
    // Arrange
    const restaurant1: Restaurant = {
      id: 'restaurant-1',
      name: 'Le Petit Bistro',
      type: 'French',
      stars: 3,
    };
    const restaurant2: Restaurant = {
      id: 'restaurant-2',
      name: 'Sushi Master',
      type: 'Japanese',
      stars: 4,
    };
    const repository = new InMemoryRestaurantRepository([
      restaurant1,
      restaurant2,
    ]);
    const useCase = new GetRestaurantsUseCase(repository);

    // Act
    const result = await useCase.execute();

    // Assert
    expect(result).toHaveLength(2);
    expect(result).toEqual([restaurant1, restaurant2]);
  });

  it('should return empty array when no restaurants exist', async () => {
    // Arrange
    const repository = new InMemoryRestaurantRepository([]);
    const useCase = new GetRestaurantsUseCase(repository);

    // Act
    const result = await useCase.execute();

    // Assert
    expect(result).toEqual([]);
  });
});
