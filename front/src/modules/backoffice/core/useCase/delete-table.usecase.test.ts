import { createTestStore } from "@taotask/modules/testing/tests-environment";
import { deleteTable } from "@taotask/modules/backoffice/core/useCase/delete-table.usecase";
import { BackofficeDomainModel } from "@taotask/modules/backoffice/core/model/backoffice.domain-model";
import { StubTableManagementGateway } from "@taotask/modules/backoffice/core/testing/stub.table-management-gateway";
import { backofficeSlice } from "@taotask/modules/backoffice/core/store/backoffice.slice";

describe('deleteTable Use Case', () => {
    const existingTables: BackofficeDomainModel.Table[] = [
        { id: 1, restaurantId: 1, title: 'Table 1', capacity: 4 },
        { id: 2, restaurantId: 1, title: 'Table 2', capacity: 2 },
    ];

    it('should delete a table via gateway and remove it from state', async () => {
        const gateway = new StubTableManagementGateway(existingTables);
        const store = createTestStore({
            dependencies: { tableManagementGateway: gateway },
        });

        store.dispatch(backofficeSlice.actions.setTables(existingTables));
        expect(store.getState().backoffice.tables).toHaveLength(2);

        await store.dispatch(deleteTable(1));

        const tables = store.getState().backoffice.tables;
        expect(tables).toHaveLength(1);
        expect(tables[0].id).toBe(2);
    });
});
