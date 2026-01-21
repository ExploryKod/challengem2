import { GetTablesUseCase } from './get-tables.use-case';
import { InMemoryTableRepository } from '../testing/stubs';
import { Table } from '../../domain/entities/table.entity';

describe('GetTablesUseCase', () => {
  it('should return tables for a given restaurant', async () => {
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
      capacity: 2,
    };
    const tableOtherRestaurant: Table = {
      id: 3,
      restaurantId: 2,
      title: 'Table 3',
      capacity: 6,
    };
    const repository = new InMemoryTableRepository([
      table1,
      table2,
      tableOtherRestaurant,
    ]);
    const useCase = new GetTablesUseCase(repository);

    // Act
    const result = await useCase.execute(1);

    // Assert
    expect(result).toHaveLength(2);
    expect(result).toEqual([table1, table2]);
  });

  it('should return empty array when restaurant has no tables', async () => {
    // Arrange
    const table: Table = {
      id: 1,
      restaurantId: 1,
      title: 'Table 1',
      capacity: 4,
    };
    const repository = new InMemoryTableRepository([table]);
    const useCase = new GetTablesUseCase(repository);

    // Act
    const result = await useCase.execute(999);

    // Assert
    expect(result).toEqual([]);
  });
});
