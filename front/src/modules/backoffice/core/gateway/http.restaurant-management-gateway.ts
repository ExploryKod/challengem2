import { IRestaurantManagementGateway } from "./restaurant.gateway";
import { BackofficeDomainModel } from "../model/backoffice.domain-model";
import { API_CONFIG } from "@taotask/modules/app/config/api.config";

export class HttpRestaurantManagementGateway implements IRestaurantManagementGateway {
    
    async getRestaurants(): Promise<BackofficeDomainModel.Restaurant[]> {
        const url = `${API_CONFIG.baseUrl}/admin/restaurants`;
        const response = await fetch(url);
        if (!response.ok) throw new Error('Failed to fetch restaurants');
        return await response.json();
    }

    async createRestaurant(dto: BackofficeDomainModel.CreateRestaurantDTO): Promise<BackofficeDomainModel.Restaurant> {
        const url = `${API_CONFIG.baseUrl}/admin/restaurants`;
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dto)
        });
        if (!response.ok) throw new Error('Failed to create restaurant');
        return await response.json();
    }

    async updateRestaurant(id: number, dto: Partial<BackofficeDomainModel.CreateRestaurantDTO>): Promise<BackofficeDomainModel.Restaurant> {
        const url = `${API_CONFIG.baseUrl}/admin/restaurants/${id}`;
        const response = await fetch(url, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dto)
        });
        if (!response.ok) throw new Error('Failed to update restaurant');
        return await response.json();
    }

    async deleteRestaurant(id: number): Promise<void> {
        const url = `${API_CONFIG.baseUrl}/admin/restaurants/${id}`;
        const response = await fetch(url, {
            method: 'DELETE',
        });
        if (!response.ok) throw new Error('Failed to delete restaurant');
    }
}