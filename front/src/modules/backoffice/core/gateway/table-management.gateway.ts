import { BackofficeDomainModel } from "../model/backoffice.domain-model";

export interface ITableManagementGateway {
    getTables(restaurantId: number): Promise<BackofficeDomainModel.Table[]>;
    getTable(id: number): Promise<BackofficeDomainModel.Table>;
    createTable(dto: BackofficeDomainModel.CreateTableDTO): Promise<BackofficeDomainModel.Table>;
    updateTable(id: number, dto: BackofficeDomainModel.UpdateTableDTO): Promise<BackofficeDomainModel.Table>;
    deleteTable(id: number): Promise<void>;
}
