import { DemoMealsStore } from '@taotask/modules/shared/demo/demo-meals.store';

describe('DemoMealsStore', () => {
  it('returns initial demo meals for each demo restaurant', () => {
    const store = new DemoMealsStore();
    expect(store.listByRestaurantId(-1).length).toBeGreaterThan(0);
    expect(store.listByRestaurantId(-2).length).toBeGreaterThan(0);
  });

  it('creates, updates, and deletes demo meals', () => {
    const store = new DemoMealsStore();
    const created = store.create({
      restaurantId: -1,
      title: 'Demo meal',
      type: 'ENTRY',
      price: 5,
      requiredAge: null,
      imageUrl: '/demo.png',
    });
    expect(created.restaurantId).toBe(-1);

    const updated = store.update(created.id, { price: 9 });
    expect(updated.price).toBe(9);

    store.delete(created.id);
    expect(store.getById(created.id)).toBeUndefined();
  });
});
