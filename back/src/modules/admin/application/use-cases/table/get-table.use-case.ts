import { Injectable, Inject } from '@nestjs/common';
import { Table } from '../../../../ordering/domain/entities/table.entity';
import type { IAdminTableRepository } from '../../ports/admin-table.repository.port';
import { ADMIN_TABLE_REPOSITORY } from '../../ports/admin-table.repository.port';

@Injectable()
export class GetTableUseCase {
  constructor(
    @Inject(ADMIN_TABLE_REPOSITORY)
    private readonly repository: IAdminTableRepository,
  ) {}

  async execute(id: number): Promise<Table | null> {
    return this.repository.findById(id);
  }
}
