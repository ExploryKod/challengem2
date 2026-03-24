import { DemoTableManagementGateway } from '@taotask/modules/backoffice/core/gateway-infra/demo.table-management-gateway';
import { DemoTablesStore } from '@taotask/modules/shared/demo/demo-tables.store';
import { ITableManagementGateway } from '@taotask/modules/backoffice/core/gateway/table-management.gateway';

const createPrimaryGateway = (): ITableManagementGateway => ({
  getTables: async () => [{ id: 10, restaurantId: 10, title: 'API', capacity: 4 }],
  getTable: async (id) => ({ id, restaurantId: 10, title: 'API', capacity: 4 }),
  createTable: async (dto) => ({ id: 20, ...dto }),
  updateTable: async (id, dto) => ({ id, restaurantId: 10, title: dto.title ?? 'API', capacity: dto.capacity ?? 4 }),
  deleteTable: async () => undefined,
});

describe('DemoTableManagementGateway', () => {
  it('returns demo tables for demo restaurant', async () => {
    const store = new DemoTablesStore();
    const gateway = new DemoTableManagementGateway(null, store);

    const tables = await gateway.getTables(-1);
    expect(tables.length).toBeGreaterThan(0);
  });

  it('returns API tables for real restaurant', async () => {
    const store = new DemoTablesStore();
    const gateway = new DemoTableManagementGateway(createPrimaryGateway(), store);

    const tables = await gateway.getTables(10);
    expect(tables).toHaveLength(1);
    expect(tables[0].restaurantId).toBe(10);
  });
});
