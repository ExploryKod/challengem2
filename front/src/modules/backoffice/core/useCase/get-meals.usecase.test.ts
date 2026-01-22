import { createTestStore } from "@taotask/modules/testing/tests-environment";
import { fetchMeals } from "@taotask/modules/backoffice/core/useCase/get-meals.usecase";
import { BackofficeDomainModel } from "@taotask/modules/backoffice/core/model/backoffice.domain-model";
import { StubMealManagementGateway } from "@taotask/modules/backoffice/core/testing/stub.meal-management-gateway";

describe('fetchMeals Use Case', () => {
    const restaurantId = 1;

    const existingMeals: BackofficeDomainModel.Meal[] = [
        { id: 1, restaurantId: 1, title: 'Salade Caesar', type: 'ENTRY', price: 12, requiredAge: null, imageUrl: '/salade.jpg' },
        { id: 2, restaurantId: 1, title: 'Steak Frites', type: 'MAIN_COURSE', price: 25, requiredAge: null, imageUrl: '/steak.jpg' },
        { id: 3, restaurantId: 2, title: 'Pizza', type: 'MAIN_COURSE', price: 15, requiredAge: null, imageUrl: '/pizza.jpg' },
    ];

    it('should fetch meals for a specific restaurant and store them in state', async () => {
        const gateway = new StubMealManagementGateway(existingMeals);
        const store = createTestStore({
            dependencies: { mealManagementGateway: gateway },
        });

        await store.dispatch(fetchMeals(restaurantId));

        const meals = store.getState().backoffice.meals;
        expect(meals).toHaveLength(2);
        expect(meals[0].title).toBe('Salade Caesar');
        expect(meals[1].title).toBe('Steak Frites');
    });

    it('should return empty array when restaurant has no meals', async () => {
        const gateway = new StubMealManagementGateway([]);
        const store = createTestStore({
            dependencies: { mealManagementGateway: gateway },
        });

        await store.dispatch(fetchMeals(restaurantId));

        expect(store.getState().backoffice.meals).toEqual([]);
    });
});
