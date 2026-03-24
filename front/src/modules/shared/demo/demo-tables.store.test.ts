import { DemoTablesStore } from '@taotask/modules/shared/demo/demo-tables.store';

describe('DemoTablesStore', () => {
  it('returns initial demo tables for each demo restaurant', () => {
    const store = new DemoTablesStore();
    expect(store.listByRestaurantId(-1).length).toBeGreaterThan(0);
    expect(store.listByRestaurantId(-2).length).toBeGreaterThan(0);
  });

  it('creates, updates, and deletes demo tables', () => {
    const store = new DemoTablesStore();
    const created = store.create({ restaurantId: -1, title: 'Demo', capacity: 2 });
    expect(created.restaurantId).toBe(-1);

    const updated = store.update(created.id, { capacity: 6 });
    expect(updated.capacity).toBe(6);

    store.delete(created.id);
    expect(store.getById(created.id)).toBeUndefined();
  });
});
