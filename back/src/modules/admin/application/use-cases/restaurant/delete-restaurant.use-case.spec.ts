import { DeleteRestaurantUseCase } from './delete-restaurant.use-case';
import { InMemoryAdminRestaurantRepository } from '../../testing/stubs';
import { Restaurant } from '../../../../ordering/domain/entities/restaurant.entity';

describe('DeleteRestaurantUseCase', () => {
  it('should delete restaurant and return true', async () => {
    // Arrange
    const restaurant: Restaurant = { id: 1, name: 'Bistro', type: 'French', stars: 3 };
    const repository = new InMemoryAdminRestaurantRepository([restaurant]);
    const useCase = new DeleteRestaurantUseCase(repository);

    // Act
    const result = await useCase.execute(1);

    // Assert
    expect(result).toBe(true);
    expect(await repository.findById(1)).toBeNull();
  });

  it('should return false when restaurant not found', async () => {
    // Arrange
    const repository = new InMemoryAdminRestaurantRepository([]);
    const useCase = new DeleteRestaurantUseCase(repository);

    // Act
    const result = await useCase.execute(999);

    // Assert
    expect(result).toBe(false);
  });
});
