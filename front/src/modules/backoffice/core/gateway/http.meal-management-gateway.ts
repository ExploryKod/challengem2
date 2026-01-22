import { IMealManagementGateway } from "./meal-management.gateway";
import { BackofficeDomainModel } from "../model/backoffice.domain-model";
import { HttpClient } from "@taotask/modules/shared/infrastructure/http-client";

export class HttpMealManagementGateway implements IMealManagementGateway {
    constructor(private readonly httpClient: HttpClient) {}

    async getMeals(restaurantId: number): Promise<BackofficeDomainModel.Meal[]> {
        return this.httpClient.get<BackofficeDomainModel.Meal[]>(`/admin/meals?restaurantId=${restaurantId}`);
    }

    async getMeal(id: number): Promise<BackofficeDomainModel.Meal> {
        return this.httpClient.get<BackofficeDomainModel.Meal>(`/admin/meals/${id}`);
    }

    async createMeal(dto: BackofficeDomainModel.CreateMealDTO): Promise<BackofficeDomainModel.Meal> {
        return this.httpClient.post<BackofficeDomainModel.Meal>('/admin/meals', dto);
    }

    async updateMeal(id: number, dto: BackofficeDomainModel.UpdateMealDTO): Promise<BackofficeDomainModel.Meal> {
        return this.httpClient.put<BackofficeDomainModel.Meal>(`/admin/meals/${id}`, dto);
    }

    async deleteMeal(id: number): Promise<void> {
        return this.httpClient.delete(`/admin/meals/${id}`);
    }
}
