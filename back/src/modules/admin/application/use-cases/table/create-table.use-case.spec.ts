import { CreateTableUseCase } from './create-table.use-case';
import { InMemoryAdminTableRepository } from '../../testing/stubs';

describe('CreateTableUseCase', () => {
  it('should create a table and return it with id', async () => {
    // Arrange
    const repository = new InMemoryAdminTableRepository([]);
    const useCase = new CreateTableUseCase(repository);
    const input = { restaurantId: 1, title: 'VIP Table', capacity: 8 };

    // Act
    const result = await useCase.execute(input);

    // Assert
    expect(result.id).toBeDefined();
    expect(result.restaurantId).toBe(1);
    expect(result.title).toBe('VIP Table');
    expect(result.capacity).toBe(8);
  });

  it('should persist the created table', async () => {
    // Arrange
    const repository = new InMemoryAdminTableRepository([]);
    const useCase = new CreateTableUseCase(repository);
    const input = { restaurantId: 1, title: 'VIP Table', capacity: 8 };

    // Act
    const created = await useCase.execute(input);
    const found = await repository.findById(created.id);

    // Assert
    expect(found).toEqual(created);
  });
});
