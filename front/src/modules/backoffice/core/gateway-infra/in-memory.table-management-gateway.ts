import { ITableManagementGateway } from "../gateway/table-management.gateway";
import { BackofficeDomainModel } from "../model/backoffice.domain-model";

export class InMemoryTableManagementGateway implements ITableManagementGateway {
    private tables: BackofficeDomainModel.Table[] = [];
    private nextId = 1;

    async getTables(restaurantId: number): Promise<BackofficeDomainModel.Table[]> {
        return this.tables.filter(t => t.restaurantId === restaurantId);
    }

    async getTable(id: number): Promise<BackofficeDomainModel.Table> {
        const table = this.tables.find(t => t.id === id);
        if (!table) throw new Error(`Table ${id} not found`);
        return table;
    }

    async createTable(dto: BackofficeDomainModel.CreateTableDTO): Promise<BackofficeDomainModel.Table> {
        const newTable: BackofficeDomainModel.Table = {
            id: this.nextId++,
            ...dto,
        };
        this.tables.push(newTable);
        return newTable;
    }

    async updateTable(id: number, dto: BackofficeDomainModel.UpdateTableDTO): Promise<BackofficeDomainModel.Table> {
        const table = this.tables.find(t => t.id === id);
        if (!table) throw new Error(`Table ${id} not found`);
        Object.assign(table, dto);
        return table;
    }

    async deleteTable(id: number): Promise<void> {
        const index = this.tables.findIndex(t => t.id === id);
        if (index === -1) throw new Error(`Table ${id} not found`);
        this.tables.splice(index, 1);
    }
}
