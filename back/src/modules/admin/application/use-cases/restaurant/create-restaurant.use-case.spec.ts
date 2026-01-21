import { CreateRestaurantUseCase } from './create-restaurant.use-case';
import { InMemoryAdminRestaurantRepository } from '../../testing/stubs';

describe('CreateRestaurantUseCase', () => {
  it('should create a restaurant and return it with id', async () => {
    // Arrange
    const repository = new InMemoryAdminRestaurantRepository([]);
    const useCase = new CreateRestaurantUseCase(repository);
    const input = { name: 'New Bistro', type: 'French', stars: 4 };

    // Act
    const result = await useCase.execute(input);

    // Assert
    expect(result.id).toBeDefined();
    expect(result.name).toBe('New Bistro');
    expect(result.type).toBe('French');
    expect(result.stars).toBe(4);
  });

  it('should persist the created restaurant', async () => {
    // Arrange
    const repository = new InMemoryAdminRestaurantRepository([]);
    const useCase = new CreateRestaurantUseCase(repository);
    const input = { name: 'New Bistro', type: 'French', stars: 4 };

    // Act
    const created = await useCase.execute(input);
    const found = await repository.findById(created.id);

    // Assert
    expect(found).toEqual(created);
  });
});
