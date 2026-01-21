import { Injectable, Inject } from '@nestjs/common';
import type { IAdminTableRepository } from '../../ports/admin-table.repository.port';
import { ADMIN_TABLE_REPOSITORY } from '../../ports/admin-table.repository.port';

@Injectable()
export class DeleteTableUseCase {
  constructor(
    @Inject(ADMIN_TABLE_REPOSITORY)
    private readonly repository: IAdminTableRepository,
  ) {}

  async execute(id: number): Promise<boolean> {
    return this.repository.delete(id);
  }
}
