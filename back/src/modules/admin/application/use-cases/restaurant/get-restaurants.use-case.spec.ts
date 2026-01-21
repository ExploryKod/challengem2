import { GetRestaurantsUseCase } from './get-restaurants.use-case';
import { InMemoryAdminRestaurantRepository } from '../../testing/stubs';
import { Restaurant } from '../../../../ordering/domain/entities/restaurant.entity';

describe('GetRestaurantsUseCase', () => {
  it('should return all restaurants', async () => {
    // Arrange
    const restaurant1: Restaurant = { id: 1, name: 'Bistro', type: 'French', stars: 3 };
    const restaurant2: Restaurant = { id: 2, name: 'Sushi', type: 'Japanese', stars: 4 };
    const repository = new InMemoryAdminRestaurantRepository([restaurant1, restaurant2]);
    const useCase = new GetRestaurantsUseCase(repository);

    // Act
    const result = await useCase.execute();

    // Assert
    expect(result).toHaveLength(2);
    expect(result).toEqual([restaurant1, restaurant2]);
  });

  it('should return empty array when no restaurants exist', async () => {
    // Arrange
    const repository = new InMemoryAdminRestaurantRepository([]);
    const useCase = new GetRestaurantsUseCase(repository);

    // Act
    const result = await useCase.execute();

    // Assert
    expect(result).toEqual([]);
  });
});
