import { DeleteTableUseCase } from './delete-table.use-case';
import { InMemoryAdminTableRepository } from '../../testing/stubs';
import { Table } from '../../../../ordering/domain/entities/table.entity';

describe('DeleteTableUseCase', () => {
  it('should delete a table and return true', async () => {
    // Arrange
    const table: Table = {
      id: 1,
      restaurantId: 1,
      title: 'Table 1',
      capacity: 4,
    };
    const repository = new InMemoryAdminTableRepository([table]);
    const useCase = new DeleteTableUseCase(repository);

    // Act
    const result = await useCase.execute(1);

    // Assert
    expect(result).toBe(true);
  });

  it('should actually remove the table from repository', async () => {
    // Arrange
    const table: Table = {
      id: 1,
      restaurantId: 1,
      title: 'Table 1',
      capacity: 4,
    };
    const repository = new InMemoryAdminTableRepository([table]);
    const useCase = new DeleteTableUseCase(repository);

    // Act
    await useCase.execute(1);
    const found = await repository.findById(1);

    // Assert
    expect(found).toBeNull();
  });

  it('should return false when table not found', async () => {
    // Arrange
    const repository = new InMemoryAdminTableRepository([]);
    const useCase = new DeleteTableUseCase(repository);

    // Act
    const result = await useCase.execute(999);

    // Assert
    expect(result).toBe(false);
  });
});
