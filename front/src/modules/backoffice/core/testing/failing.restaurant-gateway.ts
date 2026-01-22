import { IRestaurantManagementGateway } from "@taotask/modules/backoffice/core/gateway/restaurant.gateway";
import { BackofficeDomainModel } from "@taotask/modules/backoffice/core/model/backoffice.domain-model";

export class FailingRestaurantManagementGateway implements IRestaurantManagementGateway {
    async createRestaurant(dto: BackofficeDomainModel.CreateRestaurantDTO): Promise<BackofficeDomainModel.Restaurant> {
        throw new Error("Failed to create restaurant");
    }

    async updateRestaurant(id: number, dto: Partial<BackofficeDomainModel.CreateRestaurantDTO>): Promise<BackofficeDomainModel.Restaurant> {
        throw new Error("Failed to update restaurant");
    }

    async deleteRestaurant(id: number): Promise<void> {
        throw new Error("Failed to delete restaurant");
    }

    async getRestaurants(): Promise<BackofficeDomainModel.Restaurant[]> {
        throw new Error("Failed to fetch restaurants");
    }

    async getRestaurant(id: number): Promise<BackofficeDomainModel.Restaurant> {
        throw new Error("Failed to fetch restaurant");
    }
}