import { IRestaurantManagementGateway } from "./restaurant.gateway";
import { BackofficeDomainModel } from "../model/backoffice.domain-model";
import { HttpClient } from "@taotask/modules/shared/infrastructure/http-client";

export class HttpRestaurantManagementGateway implements IRestaurantManagementGateway {
    constructor(private readonly httpClient: HttpClient) {}
    
    async getRestaurants(): Promise<BackofficeDomainModel.Restaurant[]> {
        return this.httpClient.get<BackofficeDomainModel.Restaurant[]>('/admin/restaurants');
    }

    async createRestaurant(dto: BackofficeDomainModel.CreateRestaurantDTO): Promise<BackofficeDomainModel.Restaurant> {
        return this.httpClient.post<BackofficeDomainModel.Restaurant>('/admin/restaurants', dto);
    }

    async updateRestaurant(id: number, dto: Partial<BackofficeDomainModel.CreateRestaurantDTO>): Promise<BackofficeDomainModel.Restaurant> {
        return this.httpClient.put<BackofficeDomainModel.Restaurant>(`/admin/restaurants/${id}`, dto);
    }

    async deleteRestaurant(id: number): Promise<void> {
        return this.httpClient.delete(`/admin/restaurants/${id}`);
    }
}