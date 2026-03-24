import { IMealManagementGateway } from '@taotask/modules/backoffice/core/gateway/meal-management.gateway';
import { BackofficeDomainModel } from '@taotask/modules/backoffice/core/model/backoffice.domain-model';
import { DemoMealsStore } from '@taotask/modules/shared/demo/demo-meals.store';
import { isDemoEntityId, toDemoNumberId } from '@taotask/modules/shared/demo/demo-utils';
import { mapDemoToBackofficeMeal } from '@taotask/modules/backoffice/core/model/demo-meal.mapper';

export class DemoMealManagementGateway implements IMealManagementGateway {
  constructor(
    private readonly primary: IMealManagementGateway | null,
    private readonly demoStore: DemoMealsStore,
  ) {}

  async getMeals(restaurantId: number): Promise<BackofficeDomainModel.Meal[]> {
    if (isDemoEntityId(restaurantId)) {
      const demoId = toDemoNumberId(restaurantId);
      if (demoId === null) {
        return [];
      }
      return this.demoStore.listByRestaurantId(demoId).map(mapDemoToBackofficeMeal);
    }

    if (!this.primary) {
      return [];
    }

    return this.primary.getMeals(restaurantId);
  }

  async getMeal(id: number): Promise<BackofficeDomainModel.Meal> {
    if (isDemoEntityId(id)) {
      const demoId = toDemoNumberId(id);
      if (demoId === null) {
        throw new Error('Demo meal not found');
      }
      const meal = this.demoStore.getById(demoId);
      if (!meal) {
        throw new Error('Demo meal not found');
      }
      return mapDemoToBackofficeMeal(meal);
    }

    if (!this.primary) {
      throw new Error('Meal management gateway not available');
    }

    return this.primary.getMeal(id);
  }

  async createMeal(dto: BackofficeDomainModel.CreateMealDTO): Promise<BackofficeDomainModel.Meal> {
    if (isDemoEntityId(dto.restaurantId) || !this.primary) {
      const demoId = toDemoNumberId(dto.restaurantId);
      if (demoId === null) {
        throw new Error('Demo meal not found');
      }
      const created = this.demoStore.create({
        restaurantId: demoId,
        title: dto.title,
        type: dto.type,
        price: dto.price,
        requiredAge: dto.requiredAge ?? null,
        imageUrl: dto.imageUrl,
      });
      return mapDemoToBackofficeMeal(created);
    }

    return this.primary.createMeal(dto);
  }

  async updateMeal(id: number, dto: BackofficeDomainModel.UpdateMealDTO): Promise<BackofficeDomainModel.Meal> {
    if (isDemoEntityId(id)) {
      const demoId = toDemoNumberId(id);
      if (demoId === null) {
        throw new Error('Demo meal not found');
      }
      const updated = this.demoStore.update(demoId, {
        title: dto.title,
        type: dto.type,
        price: dto.price,
        requiredAge: dto.requiredAge ?? null,
        imageUrl: dto.imageUrl,
      });
      return mapDemoToBackofficeMeal(updated);
    }

    if (!this.primary) {
      throw new Error('Meal management gateway not available');
    }

    return this.primary.updateMeal(id, dto);
  }

  async deleteMeal(id: number): Promise<void> {
    if (isDemoEntityId(id)) {
      const demoId = toDemoNumberId(id);
      if (demoId === null) {
        throw new Error('Demo meal not found');
      }
      this.demoStore.delete(demoId);
      return;
    }

    if (!this.primary) {
      throw new Error('Meal management gateway not available');
    }

    await this.primary.deleteMeal(id);
  }
}
