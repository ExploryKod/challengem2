import { IRestaurantManagementGateway } from "@taotask/modules/backoffice/core/gateway/restaurant.gateway";
import { BackofficeDomainModel } from "@taotask/modules/backoffice/core/model/backoffice.domain-model";

export class StubRestaurantGateway implements IRestaurantManagementGateway {
    constructor(private restaurants: BackofficeDomainModel.Restaurant[] = []) {}

    async createRestaurant(dto: BackofficeDomainModel.CreateRestaurantDTO): Promise<BackofficeDomainModel.Restaurant> {
        const newRestaurant: BackofficeDomainModel.Restaurant = {
            id: this.restaurants.length + 1,
            ...dto
        };
        this.restaurants.push(newRestaurant);
        return newRestaurant;
    }

    async updateRestaurant(id: number, dto: Partial<BackofficeDomainModel.CreateRestaurantDTO>): Promise<BackofficeDomainModel.Restaurant> {
        const restaurant = this.restaurants.find(r => r.id === id);
        if (!restaurant) {
            throw new Error(`Restaurant ${id} not found`);
        }
        Object.assign(restaurant, dto);
        return restaurant;
    }

    async deleteRestaurant(id: number): Promise<void> {
        const index = this.restaurants.findIndex(r => r.id === id);
        if (index === -1) {
            throw new Error(`Restaurant ${id} not found`);
        }
        this.restaurants.splice(index, 1);
    }

    async getRestaurants(): Promise<BackofficeDomainModel.Restaurant[]> {
        return this.restaurants;
    }
}