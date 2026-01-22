import { IMealManagementGateway } from "@taotask/modules/backoffice/core/gateway/meal-management.gateway";
import { BackofficeDomainModel } from "@taotask/modules/backoffice/core/model/backoffice.domain-model";

export class StubMealManagementGateway implements IMealManagementGateway {
    private meals: BackofficeDomainModel.Meal[] = [];
    private nextId = 1;

    constructor(initialMeals: BackofficeDomainModel.Meal[] = []) {
        this.meals = initialMeals.map(m => ({ ...m }));
        if (initialMeals.length > 0) {
            this.nextId = Math.max(...initialMeals.map(m => m.id)) + 1;
        }
    }

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
        const index = this.meals.findIndex(m => m.id === id);
        if (index === -1) throw new Error(`Meal ${id} not found`);
        const updatedMeal = { ...this.meals[index], ...dto };
        this.meals[index] = updatedMeal;
        return updatedMeal;
    }

    async deleteMeal(id: number): Promise<void> {
        const index = this.meals.findIndex(m => m.id === id);
        if (index === -1) throw new Error(`Meal ${id} not found`);
        this.meals.splice(index, 1);
    }
}
