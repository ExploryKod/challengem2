import { DemoRestaurantsStore, isDemoRestaurantId } from '@taotask/modules/shared/demo/demo-restaurants.store';

describe('DemoRestaurantsStore', () => {
  it('returns initial demo restaurants', () => {
    const store = new DemoRestaurantsStore();
    expect(store.list()).toHaveLength(2);
  });

  it('creates, updates, and deletes demo restaurants', () => {
    const store = new DemoRestaurantsStore();
    const created = store.create({ name: 'Demo Test', type: 'Test', stars: 2 });
    expect(isDemoRestaurantId(created.id)).toBe(true);

    const updated = store.update(created.id, { stars: 5 });
    expect(updated.stars).toBe(5);

    store.delete(created.id);
    expect(store.getById(created.id)).toBeUndefined();
  });
});
