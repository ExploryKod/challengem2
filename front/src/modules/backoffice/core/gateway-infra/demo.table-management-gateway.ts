import { ITableManagementGateway } from '@taotask/modules/backoffice/core/gateway/table-management.gateway';
import { BackofficeDomainModel } from '@taotask/modules/backoffice/core/model/backoffice.domain-model';
import { DemoTablesStore } from '@taotask/modules/shared/demo/demo-tables.store';
import { isDemoEntityId, toDemoNumberId } from '@taotask/modules/shared/demo/demo-utils';
import { mapDemoToBackofficeTable } from '@taotask/modules/backoffice/core/model/demo-table.mapper';

export class DemoTableManagementGateway implements ITableManagementGateway {
  constructor(
    private readonly primary: ITableManagementGateway | null,
    private readonly demoStore: DemoTablesStore,
  ) {}

  async getTables(restaurantId: number): Promise<BackofficeDomainModel.Table[]> {
    if (isDemoEntityId(restaurantId)) {
      const demoId = toDemoNumberId(restaurantId);
      if (demoId === null) {
        return [];
      }
      return this.demoStore.listByRestaurantId(demoId).map(mapDemoToBackofficeTable);
    }

    if (!this.primary) {
      return [];
    }

    return this.primary.getTables(restaurantId);
  }

  async getTable(id: number): Promise<BackofficeDomainModel.Table> {
    if (isDemoEntityId(id)) {
      const demoId = toDemoNumberId(id);
      if (demoId === null) {
        throw new Error('Demo table not found');
      }
      const table = this.demoStore.getById(demoId);
      if (!table) {
        throw new Error('Demo table not found');
      }
      return mapDemoToBackofficeTable(table);
    }

    if (!this.primary) {
      throw new Error('Table management gateway not available');
    }

    return this.primary.getTable(id);
  }

  async createTable(dto: BackofficeDomainModel.CreateTableDTO): Promise<BackofficeDomainModel.Table> {
    if (isDemoEntityId(dto.restaurantId) || !this.primary) {
      const demoId = toDemoNumberId(dto.restaurantId);
      if (demoId === null) {
        throw new Error('Demo table not found');
      }
      const created = this.demoStore.create({
        restaurantId: demoId,
        title: dto.title,
        capacity: dto.capacity,
      });
      return mapDemoToBackofficeTable(created);
    }

    return this.primary.createTable(dto);
  }

  async updateTable(id: number, dto: BackofficeDomainModel.UpdateTableDTO): Promise<BackofficeDomainModel.Table> {
    if (isDemoEntityId(id)) {
      const demoId = toDemoNumberId(id);
      if (demoId === null) {
        throw new Error('Demo table not found');
      }
      const updated = this.demoStore.update(demoId, dto);
      return mapDemoToBackofficeTable(updated);
    }

    if (!this.primary) {
      throw new Error('Table management gateway not available');
    }

    return this.primary.updateTable(id, dto);
  }

  async deleteTable(id: number): Promise<void> {
    if (isDemoEntityId(id)) {
      const demoId = toDemoNumberId(id);
      if (demoId === null) {
        throw new Error('Demo table not found');
      }
      this.demoStore.delete(demoId);
      return;
    }

    if (!this.primary) {
      throw new Error('Table management gateway not available');
    }

    await this.primary.deleteTable(id);
  }
}
