import { GetRestaurantUseCase } from './get-restaurant.use-case';
import { InMemoryAdminRestaurantRepository } from '../../testing/stubs';
import { Restaurant } from '../../../../ordering/domain/entities/restaurant.entity';

describe('GetRestaurantUseCase', () => {
  it('should return restaurant by id', async () => {
    // Arrange
    const restaurant: Restaurant = {
      id: 1,
      name: 'Bistro',
      type: 'French',
      stars: 3,
    };
    const repository = new InMemoryAdminRestaurantRepository([restaurant]);
    const useCase = new GetRestaurantUseCase(repository);

    // Act
    const result = await useCase.execute(1);

    // Assert
    expect(result).toEqual(restaurant);
  });

  it('should return null when restaurant not found', async () => {
    // Arrange
    const repository = new InMemoryAdminRestaurantRepository([]);
    const useCase = new GetRestaurantUseCase(repository);

    // Act
    const result = await useCase.execute(999);

    // Assert
    expect(result).toBeNull();
  });
});
