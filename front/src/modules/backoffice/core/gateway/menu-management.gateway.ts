import { BackofficeDomainModel } from "../model/backoffice.domain-model";

export interface IMenuManagementGateway {
    getMenus(restaurantId: number): Promise<BackofficeDomainModel.Menu[]>;
    getMenu(id: number): Promise<BackofficeDomainModel.Menu>;
    createMenu(dto: BackofficeDomainModel.CreateMenuDTO): Promise<BackofficeDomainModel.Menu>;
    updateMenu(id: number, dto: BackofficeDomainModel.UpdateMenuDTO): Promise<BackofficeDomainModel.Menu>;
    deleteMenu(id: number): Promise<void>;
}
