import { IMealManagementGateway } from "../gateway/meal-management.gateway";
import { BackofficeDomainModel } from "../model/backoffice.domain-model";

export class InMemoryMealManagementGateway implements IMealManagementGateway {
    private meals: BackofficeDomainModel.Meal[] = [];
    private nextId = 1;

    async getMeals(restaurantId: number): Promise<BackofficeDomainModel.Meal[]> {
        return this.meals.filter(m => m.restaurantId === restaurantId);
    }

    async getMeal(id: number): Promise<BackofficeDomainModel.Meal> {
        const meal = this.meals.find(m => m.id === id);
        if (!meal) throw new Error(`Meal ${id} not found`);
        return meal;
    }

    async createMeal(dto: BackofficeDomainModel.CreateMealDTO): Promise<BackofficeDomainModel.Meal> {
        const newMeal: BackofficeDomainModel.Meal = {
            id: this.nextId++,
            ...dto,
            requiredAge: dto.requiredAge ?? null,
        };
        this.meals.push(newMeal);
        return newMeal;
    }

    async updateMeal(id: number, dto: BackofficeDomainModel.UpdateMealDTO): Promise<BackofficeDomainModel.Meal> {
        const meal = this.meals.find(m => m.id === id);
        if (!meal) throw new Error(`Meal ${id} not found`);
        Object.assign(meal, dto);
        return meal;
    }

    async deleteMeal(id: number): Promise<void> {
        const index = this.meals.findIndex(m => m.id === id);
        if (index === -1) throw new Error(`Meal ${id} not found`);
        this.meals.splice(index, 1);
    }
}
