import { createTestStore } from "@taotask/modules/testing/tests-environment";
import { fetchTables } from "@taotask/modules/backoffice/core/useCase/fetch-tables.usecase";
import { BackofficeDomainModel } from "@taotask/modules/backoffice/core/model/backoffice.domain-model";
import { StubTableManagementGateway } from "@taotask/modules/backoffice/core/testing/stub.table-management-gateway";

describe('fetchTables Use Case', () => {
    const restaurantId = 1;

    const existingTables: BackofficeDomainModel.Table[] = [
        { id: 1, restaurantId: 1, title: 'Table 1', capacity: 4 },
        { id: 2, restaurantId: 1, title: 'Table 2', capacity: 2 },
        { id: 3, restaurantId: 2, title: 'Table 3', capacity: 6 },
    ];

    it('should fetch tables for a specific restaurant and store them in state', async () => {
        const gateway = new StubTableManagementGateway(existingTables);
        const store = createTestStore({
            dependencies: { tableManagementGateway: gateway },
        });

        await store.dispatch(fetchTables(restaurantId));

        const tables = store.getState().backoffice.tables;
        expect(tables).toHaveLength(2);
        expect(tables[0].title).toBe('Table 1');
        expect(tables[1].title).toBe('Table 2');
    });

    it('should return empty array when restaurant has no tables', async () => {
        const gateway = new StubTableManagementGateway([]);
        const store = createTestStore({
            dependencies: { tableManagementGateway: gateway },
        });

        await store.dispatch(fetchTables(restaurantId));

        expect(store.getState().backoffice.tables).toEqual([]);
    });
});
