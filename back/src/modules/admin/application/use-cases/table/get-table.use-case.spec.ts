import { GetTableUseCase } from './get-table.use-case';
import { InMemoryAdminTableRepository } from '../../testing/stubs';
import { Table } from '../../../../ordering/domain/entities/table.entity';

describe('GetTableUseCase', () => {
  it('should return a table by id', async () => {
    // Arrange
    const table: Table = {
      id: 1,
      restaurantId: 1,
      title: 'Table 1',
      capacity: 4,
    };
    const repository = new InMemoryAdminTableRepository([table]);
    const useCase = new GetTableUseCase(repository);

    // Act
    const result = await useCase.execute(1);

    // Assert
    expect(result).toEqual(table);
  });

  it('should return null when table not found', async () => {
    // Arrange
    const repository = new InMemoryAdminTableRepository([]);
    const useCase = new GetTableUseCase(repository);

    // Act
    const result = await useCase.execute(999);

    // Assert
    expect(result).toBeNull();
  });
});
