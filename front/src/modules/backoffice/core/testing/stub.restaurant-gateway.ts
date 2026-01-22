import { IRestaurantManagementGateway } from "@taotask/modules/backoffice/core/gateway/restaurant.gateway";
import { BackofficeDomainModel } from "@taotask/modules/backoffice/core/model/backoffice.domain-model";

export class StubRestaurantGateway implements IRestaurantManagementGateway {
    private _restaurants: BackofficeDomainModel.Restaurant[] = [];

    constructor(initialRestaurants: BackofficeDomainModel.Restaurant[] = []) {
        this._restaurants = initialRestaurants.map(r => ({ ...r }));
    }

    async createRestaurant(dto: BackofficeDomainModel.CreateRestaurantDTO): Promise<BackofficeDomainModel.Restaurant> {
        const newRestaurant: BackofficeDomainModel.Restaurant = {
            id: this._restaurants.length + 1,
            ...dto
        };
        this._restaurants.push(newRestaurant);
        return newRestaurant;
    }

    async updateRestaurant(id: number, dto: Partial<BackofficeDomainModel.CreateRestaurantDTO>): Promise<BackofficeDomainModel.Restaurant> {
        const index = this._restaurants.findIndex(r => r.id === id);
        if (index === -1) {
            throw new Error(`Restaurant ${id} not found`);
        }
        const updatedRestaurant = { ...this._restaurants[index], ...dto };
        this._restaurants[index] = updatedRestaurant;
        return updatedRestaurant;
    }

    async deleteRestaurant(id: number): Promise<void> {
        const index = this._restaurants.findIndex(r => r.id === id);
        if (index === -1) {
            throw new Error(`Restaurant ${id} not found`);
        }
        this._restaurants.splice(index, 1);
    }

    async getRestaurants(): Promise<BackofficeDomainModel.Restaurant[]> {
        return this._restaurants;
    }

    async getRestaurant(id: number): Promise<BackofficeDomainModel.Restaurant> {
        const restaurant = this._restaurants.find(r => r.id === id);
        if (!restaurant) throw new Error(`Restaurant ${id} not found`);
        return restaurant;
    }
}