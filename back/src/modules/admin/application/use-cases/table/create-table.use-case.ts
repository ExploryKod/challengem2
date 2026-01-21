import { Injectable, Inject } from '@nestjs/common';
import { Table } from '../../../../ordering/domain/entities/table.entity';
import type { IAdminTableRepository } from '../../ports/admin-table.repository.port';
import { ADMIN_TABLE_REPOSITORY } from '../../ports/admin-table.repository.port';

export interface CreateTableInput {
  restaurantId: number;
  title: string;
  capacity: number;
}

@Injectable()
export class CreateTableUseCase {
  constructor(
    @Inject(ADMIN_TABLE_REPOSITORY)
    private readonly repository: IAdminTableRepository,
  ) {}

  async execute(input: CreateTableInput): Promise<Table> {
    return this.repository.create(input);
  }
}
