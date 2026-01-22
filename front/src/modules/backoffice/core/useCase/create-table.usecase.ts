import { AppDispatch, AppGetState } from "@taotask/modules/store/store";
import { Dependencies } from "@taotask/modules/store/dependencies";
import { BackofficeDomainModel } from "@taotask/modules/backoffice/core/model/backoffice.domain-model";
import { backofficeSlice } from "@taotask/modules/backoffice/core/store/backoffice.slice";

export const createTable = (dto: BackofficeDomainModel.CreateTableDTO) =>
    async (dispatch: AppDispatch, getState: AppGetState, dependencies: Dependencies) => {
        const gateway = dependencies.tableManagementGateway;

        if (!gateway) {
            throw new Error('Table management gateway not available');
        }

        const newTable = await gateway.createTable(dto);
        dispatch(backofficeSlice.actions.storeTable(newTable));

        return newTable;
    };
