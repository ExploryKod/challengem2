import { createTestStore } from "@taotask/modules/testing/tests-environment";
import { updateTable } from "@taotask/modules/backoffice/core/useCase/update-table.usecase";
import { BackofficeDomainModel } from "@taotask/modules/backoffice/core/model/backoffice.domain-model";
import { StubTableManagementGateway } from "@taotask/modules/backoffice/core/testing/stub.table-management-gateway";
import { backofficeSlice } from "@taotask/modules/backoffice/core/store/backoffice.slice";

describe('updateTable Use Case', () => {
    const existingTables: BackofficeDomainModel.Table[] = [
        { id: 1, restaurantId: 1, title: 'Table 1', capacity: 4 },
        { id: 2, restaurantId: 1, title: 'Table 2', capacity: 2 },
    ];

    it('should update a table via gateway and update it in state', async () => {
        const gateway = new StubTableManagementGateway(existingTables);
        const store = createTestStore({
            dependencies: { tableManagementGateway: gateway },
        });

        store.dispatch(backofficeSlice.actions.setTables(existingTables));

        await store.dispatch(updateTable(1, { title: 'Table VIP', capacity: 6 }));

        const tables = store.getState().backoffice.tables;
        expect(tables[0].title).toBe('Table VIP');
        expect(tables[0].capacity).toBe(6);
    });
});
