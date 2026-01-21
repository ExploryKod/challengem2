import { GetTablesUseCase } from './get-tables.use-case';
import { InMemoryAdminTableRepository } from '../../testing/stubs';
import { Table } from '../../../../ordering/domain/entities/table.entity';

describe('GetTablesUseCase', () => {
  it('should return all tables for a restaurant', async () => {
    // Arrange
    const table1: Table = {
      id: 1,
      restaurantId: 1,
      title: 'Table 1',
      capacity: 4,
    };
    const table2: Table = {
      id: 2,
      restaurantId: 1,
      title: 'Table 2',
      capacity: 6,
    };
    const table3: Table = {
      id: 3,
      restaurantId: 2,
      title: 'Table 3',
      capacity: 2,
    };
    const repository = new InMemoryAdminTableRepository([
      table1,
      table2,
      table3,
    ]);
    const useCase = new GetTablesUseCase(repository);

    // Act
    const result = await useCase.execute(1);

    // Assert
    expect(result).toHaveLength(2);
    expect(result).toEqual([table1, table2]);
  });

  it('should return empty array when no tables exist for restaurant', async () => {
    // Arrange
    const repository = new InMemoryAdminTableRepository([]);
    const useCase = new GetTablesUseCase(repository);

    // Act
    const result = await useCase.execute(1);

    // Assert
    expect(result).toEqual([]);
  });
});
