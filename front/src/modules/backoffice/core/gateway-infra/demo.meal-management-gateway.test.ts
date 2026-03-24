import { DemoMealManagementGateway } from '@taotask/modules/backoffice/core/gateway-infra/demo.meal-management-gateway';
import { DemoMealsStore } from '@taotask/modules/shared/demo/demo-meals.store';
import { IMealManagementGateway } from '@taotask/modules/backoffice/core/gateway/meal-management.gateway';

const createPrimaryGateway = (): IMealManagementGateway => ({
  getMeals: async () => [
    {
      id: 10,
      restaurantId: 10,
      title: 'API',
      type: 'ENTRY',
      price: 5,
      requiredAge: null,
      imageUrl: '',
    },
  ],
  getMeal: async (id) => ({
    id,
    restaurantId: 10,
    title: 'API',
    type: 'ENTRY',
    price: 5,
    requiredAge: null,
    imageUrl: '',
  }),
  createMeal: async (dto) => ({
    id: 20,
    restaurantId: dto.restaurantId,
    title: dto.title,
    type: dto.type,
    price: dto.price,
    requiredAge: dto.requiredAge ?? null,
    imageUrl: dto.imageUrl,
  }),
  updateMeal: async (id, dto) => ({
    id,
    restaurantId: 10,
    title: dto.title ?? 'API',
    type: dto.type ?? 'ENTRY',
    price: dto.price ?? 5,
    requiredAge: dto.requiredAge ?? null,
    imageUrl: dto.imageUrl ?? '',
  }),
  deleteMeal: async () => undefined,
});

describe('DemoMealManagementGateway', () => {
  it('returns demo meals for demo restaurant', async () => {
    const store = new DemoMealsStore();
    const gateway = new DemoMealManagementGateway(null, store);

    const meals = await gateway.getMeals(-1);
    expect(meals.length).toBeGreaterThan(0);
  });

  it('returns API meals for real restaurant', async () => {
    const store = new DemoMealsStore();
    const gateway = new DemoMealManagementGateway(createPrimaryGateway(), store);

    const meals = await gateway.getMeals(10);
    expect(meals).toHaveLength(1);
    expect(meals[0].restaurantId).toBe(10);
  });
});
