import { UpdateTableUseCase } from './update-table.use-case';
import { InMemoryAdminTableRepository } from '../../testing/stubs';
import { Table } from '../../../../ordering/domain/entities/table.entity';

describe('UpdateTableUseCase', () => {
  it('should update a table and return the updated version', async () => {
    // Arrange
    const table: Table = {
      id: 1,
      restaurantId: 1,
      title: 'Old Title',
      capacity: 4,
    };
    const repository = new InMemoryAdminTableRepository([table]);
    const useCase = new UpdateTableUseCase(repository);

    // Act
    const result = await useCase.execute(1, {
      title: 'New Title',
      capacity: 6,
    });

    // Assert
    expect(result).not.toBeNull();
    expect(result!.title).toBe('New Title');
    expect(result!.capacity).toBe(6);
  });

  it('should return null when table not found', async () => {
    // Arrange
    const repository = new InMemoryAdminTableRepository([]);
    const useCase = new UpdateTableUseCase(repository);

    // Act
    const result = await useCase.execute(999, { title: 'New Title' });

    // Assert
    expect(result).toBeNull();
  });

  it('should only update provided fields', async () => {
    // Arrange
    const table: Table = {
      id: 1,
      restaurantId: 1,
      title: 'Original Title',
      capacity: 4,
    };
    const repository = new InMemoryAdminTableRepository([table]);
    const useCase = new UpdateTableUseCase(repository);

    // Act
    const result = await useCase.execute(1, { capacity: 8 });

    // Assert
    expect(result).not.toBeNull();
    expect(result!.title).toBe('Original Title');
    expect(result!.capacity).toBe(8);
  });
});
