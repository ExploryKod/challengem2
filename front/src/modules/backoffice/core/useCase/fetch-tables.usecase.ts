import { AppDispatch, AppGetState } from "@taotask/modules/store/store";
import { Dependencies } from "@taotask/modules/store/dependencies";
import { backofficeSlice } from "@taotask/modules/backoffice/core/store/backoffice.slice";

export const fetchTables = (restaurantId: number) =>
    async (dispatch: AppDispatch, getState: AppGetState, dependencies: Dependencies) => {
        const gateway = dependencies.tableManagementGateway;

        if (!gateway) {
            throw new Error('Table management gateway not available');
        }

        const tables = await gateway.getTables(restaurantId);
        dispatch(backofficeSlice.actions.setTables(tables));

        return tables;
    };
