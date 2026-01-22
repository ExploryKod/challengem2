import { createTestStore } from "@taotask/modules/testing/tests-environment";
import { updateRestaurantUseCase } from "@taotask/modules/backoffice/core/useCase/update-restaurant.usecase";
import { BackofficeDomainModel } from "@taotask/modules/backoffice/core/model/backoffice.domain-model";
import { StubRestaurantGateway } from "@taotask/modules/backoffice/core/testing/stub.restaurant-gateway";
import { backofficeSlice } from "@taotask/modules/backoffice/core/store/backoffice.slice";

describe('updateRestaurant Use Case', () => {
    const existingRestaurants: BackofficeDomainModel.Restaurant[] = [
        { id: 1, name: 'Le Gourmet', type: 'Gastronomique', stars: 3 },
        { id: 2, name: 'Pizza Place', type: 'Italien', stars: 1 },
    ];

    it('should update a restaurant via gateway and update it in state', async () => {
        const gateway = new StubRestaurantGateway(existingRestaurants);
        const store = createTestStore({
            dependencies: { restaurantManagementGateway: gateway },
        });

        store.dispatch(backofficeSlice.actions.setRestaurants(existingRestaurants));
        expect(store.getState().backoffice.restaurants[0].name).toBe('Le Gourmet');

        await store.dispatch(updateRestaurantUseCase(1, { name: 'Le Grand Gourmet' }));

        const restaurants = store.getState().backoffice.restaurants;
        expect(restaurants[0].name).toBe('Le Grand Gourmet');
        expect(restaurants[0].type).toBe('Gastronomique');
    });

    it('should return the updated restaurant', async () => {
        const gateway = new StubRestaurantGateway(existingRestaurants);
        const store = createTestStore({
            dependencies: { restaurantManagementGateway: gateway },
        });

        store.dispatch(backofficeSlice.actions.setRestaurants(existingRestaurants));

        const result = await store.dispatch(updateRestaurantUseCase(1, { name: 'Updated Name', type: 'Bistro' }));

        expect(result.name).toBe('Updated Name');
        expect(result.type).toBe('Bistro');
        expect(result.id).toBe(1);
    });
});
