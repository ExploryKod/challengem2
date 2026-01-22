import { createTestStore } from "@taotask/modules/testing/tests-environment";
import { createTable } from "@taotask/modules/backoffice/core/useCase/create-table.usecase";
import { BackofficeDomainModel } from "@taotask/modules/backoffice/core/model/backoffice.domain-model";
import { StubTableManagementGateway } from "@taotask/modules/backoffice/core/testing/stub.table-management-gateway";

describe('createTable Use Case', () => {
    const validDTO: BackofficeDomainModel.CreateTableDTO = {
        restaurantId: 1,
        title: 'Table VIP',
        capacity: 6,
    };

    it('should create a table via gateway and store it in state', async () => {
        const gateway = new StubTableManagementGateway();
        const store = createTestStore({
            dependencies: { tableManagementGateway: gateway },
        });

        expect(store.getState().backoffice.tables).toEqual([]);

        const result = await store.dispatch(createTable(validDTO));

        const tables = store.getState().backoffice.tables;
        expect(tables).toHaveLength(1);
        expect(tables[0]).toMatchObject({
            title: 'Table VIP',
            capacity: 6,
            restaurantId: 1,
        });
        expect(result.id).toBeDefined();
    });

    it('should return the created table with generated ID', async () => {
        const gateway = new StubTableManagementGateway();
        const store = createTestStore({
            dependencies: { tableManagementGateway: gateway },
        });

        const result = await store.dispatch(createTable(validDTO));

        expect(result.id).toBeDefined();
        expect(typeof result.id).toBe('number');
        expect(result.title).toBe('Table VIP');
    });
});
