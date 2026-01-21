import { UpdateRestaurantUseCase } from './update-restaurant.use-case';
import { InMemoryAdminRestaurantRepository } from '../../testing/stubs';
import { Restaurant } from '../../../../ordering/domain/entities/restaurant.entity';

describe('UpdateRestaurantUseCase', () => {
  it('should update restaurant and return updated entity', async () => {
    // Arrange
    const restaurant: Restaurant = { id: 1, name: 'Old Name', type: 'French', stars: 3 };
    const repository = new InMemoryAdminRestaurantRepository([restaurant]);
    const useCase = new UpdateRestaurantUseCase(repository);

    // Act
    const result = await useCase.execute(1, { name: 'New Name', stars: 5 });

    // Assert
    expect(result).not.toBeNull();
    expect(result!.name).toBe('New Name');
    expect(result!.type).toBe('French'); // unchanged
    expect(result!.stars).toBe(5);
  });

  it('should return null when restaurant not found', async () => {
    // Arrange
    const repository = new InMemoryAdminRestaurantRepository([]);
    const useCase = new UpdateRestaurantUseCase(repository);

    // Act
    const result = await useCase.execute(999, { name: 'New Name' });

    // Assert
    expect(result).toBeNull();
  });
});
