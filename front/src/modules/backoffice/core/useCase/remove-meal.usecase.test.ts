import { createTestStore } from "@taotask/modules/testing/tests-environment";
import { deleteMeal } from "@taotask/modules/backoffice/core/useCase/remove-meal.usecase";
import { BackofficeDomainModel } from "@taotask/modules/backoffice/core/model/backoffice.domain-model";
import { StubMealManagementGateway } from "@taotask/modules/backoffice/core/testing/stub.meal-management-gateway";
import { backofficeSlice } from "@taotask/modules/backoffice/core/store/backoffice.slice";

describe('deleteMeal Use Case', () => {
    const existingMeals: BackofficeDomainModel.Meal[] = [
        { id: 1, restaurantId: 1, title: 'Salade Caesar', type: 'ENTRY', price: 12, requiredAge: null, imageUrl: '/salade.jpg' },
        { id: 2, restaurantId: 1, title: 'Steak Frites', type: 'MAIN_COURSE', price: 25, requiredAge: null, imageUrl: '/steak.jpg' },
    ];

    it('should delete a meal via gateway and remove it from state', async () => {
        const gateway = new StubMealManagementGateway(existingMeals);
        const store = createTestStore({
            dependencies: { mealManagementGateway: gateway },
        });

        store.dispatch(backofficeSlice.actions.setMeals(existingMeals));
        expect(store.getState().backoffice.meals).toHaveLength(2);

        await store.dispatch(deleteMeal(1));

        const meals = store.getState().backoffice.meals;
        expect(meals).toHaveLength(1);
        expect(meals[0].id).toBe(2);
    });
});
