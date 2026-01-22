import { ITableManagementGateway } from "./table-management.gateway";
import { BackofficeDomainModel } from "../model/backoffice.domain-model";
import { HttpClient } from "@taotask/modules/shared/infrastructure/http-client";

export class HttpTableManagementGateway implements ITableManagementGateway {
    constructor(private readonly httpClient: HttpClient) {}

    async getTables(restaurantId: number): Promise<BackofficeDomainModel.Table[]> {
        return this.httpClient.get<BackofficeDomainModel.Table[]>(`/admin/tables?restaurantId=${restaurantId}`);
    }

    async getTable(id: number): Promise<BackofficeDomainModel.Table> {
        return this.httpClient.get<BackofficeDomainModel.Table>(`/admin/tables/${id}`);
    }

    async createTable(dto: BackofficeDomainModel.CreateTableDTO): Promise<BackofficeDomainModel.Table> {
        return this.httpClient.post<BackofficeDomainModel.Table>('/admin/tables', dto);
    }

    async updateTable(id: number, dto: BackofficeDomainModel.UpdateTableDTO): Promise<BackofficeDomainModel.Table> {
        return this.httpClient.put<BackofficeDomainModel.Table>(`/admin/tables/${id}`, dto);
    }

    async deleteTable(id: number): Promise<void> {
        return this.httpClient.delete(`/admin/tables/${id}`);
    }
}
