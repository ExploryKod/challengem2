import { DemoRestaurantManagementGateway } from '@taotask/modules/backoffice/core/gateway-infra/demo.restaurant-management-gateway';
import { DemoRestaurantsStore } from '@taotask/modules/shared/demo/demo-restaurants.store';
import { BackofficeDomainModel } from '@taotask/modules/backoffice/core/model/backoffice.domain-model';
import { IRestaurantManagementGateway } from '@taotask/modules/backoffice/core/gateway/restaurant.gateway';

const createPrimaryGateway = (
  restaurants: BackofficeDomainModel.Restaurant[],
): IRestaurantManagementGateway => ({
  getRestaurants: async () => restaurants,
  getRestaurant: async (id: number) => {
    const restaurant = restaurants.find((item) => item.id === id);
    if (!restaurant) {
      throw new Error('Not found');
    }
    return restaurant;
  },
  createRestaurant: async (dto) => ({
    id: 100,
    name: dto.name,
    type: dto.type,
    stars: dto.stars,
    tableCount: 0,
    mealCount: 0,
  }),
  updateRestaurant: async (id, dto) => ({
    id,
    name: dto.name ?? 'Updated',
    type: dto.type ?? 'Updated',
    stars: dto.stars ?? 3,
    tableCount: 0,
    mealCount: 0,
  }),
  deleteRestaurant: async () => undefined,
});

describe('DemoRestaurantManagementGateway', () => {
  it('merges demo restaurants with API restaurants', async () => {
    const demoStore = new DemoRestaurantsStore();
    const primary = createPrimaryGateway([
      { id: 10, name: 'API', type: 'Fusion', stars: 5, tableCount: 1, mealCount: 2 },
    ]);

    const gateway = new DemoRestaurantManagementGateway(primary, demoStore);
    const restaurants = await gateway.getRestaurants();

    expect(restaurants.length).toBe(3);
    expect(gateway.getLastError()).toBeNull();
  });

  it('creates demo restaurants when API is unavailable', async () => {
    const demoStore = new DemoRestaurantsStore();
    const gateway = new DemoRestaurantManagementGateway(null, demoStore);

    const created = await gateway.createRestaurant({ name: 'Local', type: 'Demo', stars: 2 });
    expect(created.id).toBeLessThan(0);
  });
});
