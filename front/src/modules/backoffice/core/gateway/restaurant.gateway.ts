import { BackofficeDomainModel } from "../model/backoffice.domain-model";

export interface IRestaurantManagementGateway {
    getRestaurants(): Promise<BackofficeDomainModel.Restaurant[]>;
    getRestaurant(id: number): Promise<BackofficeDomainModel.Restaurant>;
    createRestaurant(dto: BackofficeDomainModel.CreateRestaurantDTO): Promise<BackofficeDomainModel.Restaurant>;
    updateRestaurant(id: number, dto: Partial<BackofficeDomainModel.CreateRestaurantDTO>): Promise<BackofficeDomainModel.Restaurant>;
    deleteRestaurant(id: number): Promise<void>;
}