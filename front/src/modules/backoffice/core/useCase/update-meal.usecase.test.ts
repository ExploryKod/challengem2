import { createTestStore } from "@taotask/modules/testing/tests-environment";
import { updateMeal } from "@taotask/modules/backoffice/core/useCase/update-meal.usecase";
import { BackofficeDomainModel } from "@taotask/modules/backoffice/core/model/backoffice.domain-model";
import { StubMealManagementGateway } from "@taotask/modules/backoffice/core/testing/stub.meal-management-gateway";
import { backofficeSlice } from "@taotask/modules/backoffice/core/store/backoffice.slice";

describe('updateMeal Use Case', () => {
    const existingMeals: BackofficeDomainModel.Meal[] = [
        { id: 1, restaurantId: 1, title: 'Salade Caesar', type: 'ENTRY', price: 12, requiredAge: null, imageUrl: '/salade.jpg' },
        { id: 2, restaurantId: 1, title: 'Steak Frites', type: 'MAIN_COURSE', price: 25, requiredAge: null, imageUrl: '/steak.jpg' },
    ];

    it('should update a meal via gateway and update it in state', async () => {
        const gateway = new StubMealManagementGateway(existingMeals);
        const store = createTestStore({
            dependencies: { mealManagementGateway: gateway },
        });

        store.dispatch(backofficeSlice.actions.setMeals(existingMeals));

        await store.dispatch(updateMeal(1, { title: 'Salade Nicoise', price: 14 }));

        const meals = store.getState().backoffice.meals;
        expect(meals[0].title).toBe('Salade Nicoise');
        expect(meals[0].price).toBe(14);
        expect(meals[0].type).toBe('ENTRY'); // unchanged
    });

    it('should return the updated meal', async () => {
        const gateway = new StubMealManagementGateway(existingMeals);
        const store = createTestStore({
            dependencies: { mealManagementGateway: gateway },
        });

        store.dispatch(backofficeSlice.actions.setMeals(existingMeals));

        const result = await store.dispatch(updateMeal(1, { title: 'Salade Nicoise' }));

        expect(result.title).toBe('Salade Nicoise');
        expect(result.id).toBe(1);
    });
});
