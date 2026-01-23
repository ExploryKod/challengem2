import { IMenuManagementGateway } from "./menu-management.gateway";
import { BackofficeDomainModel } from "../model/backoffice.domain-model";
import { HttpClient } from "@taotask/modules/shared/infrastructure/http-client";

export class HttpMenuManagementGateway implements IMenuManagementGateway {
    constructor(private readonly httpClient: HttpClient) {}

    async getMenus(restaurantId: number): Promise<BackofficeDomainModel.Menu[]> {
        return this.httpClient.get<BackofficeDomainModel.Menu[]>(`/menus?restaurantId=${restaurantId}`);
    }

    async getMenu(id: number): Promise<BackofficeDomainModel.Menu> {
        return this.httpClient.get<BackofficeDomainModel.Menu>(`/menus/${id}`);
    }

    async createMenu(dto: BackofficeDomainModel.CreateMenuDTO): Promise<BackofficeDomainModel.Menu> {
        return this.httpClient.post<BackofficeDomainModel.Menu>('/menus', dto);
    }

    async updateMenu(id: number, dto: BackofficeDomainModel.UpdateMenuDTO): Promise<BackofficeDomainModel.Menu> {
        return this.httpClient.put<BackofficeDomainModel.Menu>(`/menus/${id}`, dto);
    }

    async deleteMenu(id: number): Promise<void> {
        return this.httpClient.delete(`/menus/${id}`);
    }
}
