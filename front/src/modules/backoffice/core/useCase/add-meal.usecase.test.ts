import { createTestStore } from "@taotask/modules/testing/tests-environment";
import { createMeal } from "@taotask/modules/backoffice/core/useCase/add-meal.usecase";
import { BackofficeDomainModel } from "@taotask/modules/backoffice/core/model/backoffice.domain-model";
import { StubMealManagementGateway } from "@taotask/modules/backoffice/core/testing/stub.meal-management-gateway";

describe('createMeal Use Case', () => {
    const validDTO: BackofficeDomainModel.CreateMealDTO = {
        restaurantId: 1,
        title: 'Tiramisu',
        type: 'DESSERT',
        price: 8,
        imageUrl: '/tiramisu.jpg',
    };

    it('should create a meal via gateway and store it in state', async () => {
        const gateway = new StubMealManagementGateway();
        const store = createTestStore({
            dependencies: { mealManagementGateway: gateway },
        });

        expect(store.getState().backoffice.meals).toEqual([]);

        const result = await store.dispatch(createMeal(validDTO));

        const meals = store.getState().backoffice.meals;
        expect(meals).toHaveLength(1);
        expect(meals[0]).toMatchObject({
            title: 'Tiramisu',
            type: 'DESSERT',
            price: 8,
            restaurantId: 1,
        });
        expect(result.id).toBeDefined();
    });
});
