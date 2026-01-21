import { createTestStore } from "@taotask/modules/testing/tests-environment";
import { registerRestaurant } from "@taotask/modules/backoffice/core/useCase/register-restaurant.usecase";
import { BackofficeDomainModel } from "@taotask/modules/backoffice/core/model/backoffice.domain-model";
import { StubRestaurantGateway } from "@taotask/modules/backoffice/core/testing/stub.restaurant-gateway";
import { FailingRestaurantManagementGateway } from "@taotask/modules/backoffice/core/testing/failing.restaurant-gateway";

describe('registerRestaurant Use Case', () => {
    const validDTO: BackofficeDomainModel.CreateRestaurantDTO = {
        name: "Le Gourmet",
        type: "Française",
        stars: 4
    };

    // ==========================================
    // GROUPE 1 : CAS NOMINAL (SUCCÈS)
    // ==========================================
    describe('Successful creation', () => {
        it('should create a restaurant via gateway', async () => {
            // GIVEN : Un store avec un gateway stub
            const gateway = new StubRestaurantGateway();
            const store = createTestStore({
                dependencies: {
                    restaurantManagementGateway: gateway
                }
            });

            // WHEN : On dispatch le use case
            await store.dispatch(registerRestaurant(validDTO));

            // THEN : Le gateway doit avoir été appelé
            // (le stub interne aura créé le restaurant)
            expect(gateway.getRestaurants()).resolves.toHaveLength(1);
        });

        it('should store the created restaurant in Redux state', async () => {
            // GIVEN : Un store vide
            const store = createTestStore({
                dependencies: {
                    restaurantManagementGateway: new StubRestaurantGateway()
                }
            });

            // Vérifier que le store est vide
            expect(store.getState().backoffice.restaurants).toEqual([]);

            // WHEN : On crée un restaurant
            await store.dispatch(registerRestaurant(validDTO));

            // THEN : Le restaurant doit être dans le store Redux
            const restaurants = store.getState().backoffice.restaurants;
            expect(restaurants).toHaveLength(1);
            expect(restaurants[0]).toMatchObject({
                name: "Le Gourmet",
                type: "Française",
                stars: 4
            });
        });

        it('should return the created restaurant with generated ID', async () => {
            // GIVEN : Un store
            const store = createTestStore({
                dependencies: {
                    restaurantManagementGateway: new StubRestaurantGateway()
                }
            });

            // WHEN : On crée un restaurant
            const result = await store.dispatch(registerRestaurant(validDTO));

            // THEN : Le résultat doit contenir le restaurant avec un ID
            expect(result).toMatchObject({
                name: "Le Gourmet",
                type: "Française",
                stars: 4
            });
            expect(result.id).toBeDefined();
            expect(typeof result.id).toBe('number');
        });

        it('should handle multiple sequential creations', async () => {
            // GIVEN : Un store
            const store = createTestStore({
                dependencies: {
                    restaurantManagementGateway: new StubRestaurantGateway()
                }
            });

            // WHEN : On crée plusieurs restaurants
            await store.dispatch(registerRestaurant({ name: "Restaurant 1", type: "Type 1", stars: 3 }));
            await store.dispatch(registerRestaurant({ name: "Restaurant 2", type: "Type 2", stars: 4 }));
            await store.dispatch(registerRestaurant({ name: "Restaurant 3", type: "Type 3", stars: 5 }));

            // THEN : Tous doivent être dans le store
            const restaurants = store.getState().backoffice.restaurants;
            expect(restaurants).toHaveLength(3);
            expect(restaurants[0].name).toBe("Restaurant 1");
            expect(restaurants[1].name).toBe("Restaurant 2");
            expect(restaurants[2].name).toBe("Restaurant 3");
        });
    });

  
    // ==========================================
    // GROUPE 2 : EDGE CASES
    // ==========================================
    describe('Edge cases', () => {
        it('should handle restaurant with minimum stars (1)', async () => {
            const store = createTestStore({
                dependencies: {
                    restaurantManagementGateway: new StubRestaurantGateway()
                }
            });

            const dto = { name: "Budget Restaurant", type: "Fast Food", stars: 1 };
            const result = await store.dispatch(registerRestaurant(dto));

            expect(result.stars).toBe(1);
        });

        it('should handle restaurant with maximum stars (5)', async () => {
            const store = createTestStore({
                dependencies: {
                    restaurantManagementGateway: new StubRestaurantGateway()
                }
            });

            const dto = { name: "Luxury Restaurant", type: "Gastronomique", stars: 5 };
            const result = await store.dispatch(registerRestaurant(dto));

            expect(result.stars).toBe(5);
        });

        it('should handle restaurant with minimum valid name (3 chars)', async () => {
            const store = createTestStore({
                dependencies: {
                    restaurantManagementGateway: new StubRestaurantGateway()
                }
            });

            const dto = { name: "ABC", type: "Type", stars: 3 };
            const result = await store.dispatch(registerRestaurant(dto));

            expect(result.name).toBe("ABC");
        });

        it('should handle restaurant with long name', async () => {
            const store = createTestStore({
                dependencies: {
                    restaurantManagementGateway: new StubRestaurantGateway()
                }
            });

            const longName = "Le Restaurant Gastronomique Extraordinaire de la Ville";
            const dto = { name: longName, type: "Française", stars: 4 };
            const result = await store.dispatch(registerRestaurant(dto));

            expect(result.name).toBe(longName);
        });
    });
});