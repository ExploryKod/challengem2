import { Injectable, Inject } from '@nestjs/common';
import { Table } from '../../domain/entities/table.entity';
import type { ITableRepository } from '../ports/table.repository.port';
import { TABLE_REPOSITORY } from '../ports/table.repository.port';

@Injectable()
export class GetTablesUseCase {
  constructor(
    @Inject(TABLE_REPOSITORY)
    private readonly tableRepository: ITableRepository,
  ) {}

  async execute(restaurantId: string): Promise<Table[]> {
    return this.tableRepository.findByRestaurantId(restaurantId);
  }
}
