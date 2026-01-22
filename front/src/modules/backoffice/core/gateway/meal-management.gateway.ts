import { BackofficeDomainModel } from "../model/backoffice.domain-model";

export interface IMealManagementGateway {
    getMeals(restaurantId: number): Promise<BackofficeDomainModel.Meal[]>;
    getMeal(id: number): Promise<BackofficeDomainModel.Meal>;
    createMeal(dto: BackofficeDomainModel.CreateMealDTO): Promise<BackofficeDomainModel.Meal>;
    updateMeal(id: number, dto: BackofficeDomainModel.UpdateMealDTO): Promise<BackofficeDomainModel.Meal>;
    deleteMeal(id: number): Promise<void>;
}
