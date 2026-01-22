import { AppDispatch, AppGetState } from "@taotask/modules/store/store";
import { Dependencies } from "@taotask/modules/store/dependencies";
import { backofficeSlice } from "@taotask/modules/backoffice/core/store/backoffice.slice";

export const deleteMeal = (mealId: number) =>
    async (dispatch: AppDispatch, getState: AppGetState, dependencies: Dependencies) => {
        const gateway = dependencies.mealManagementGateway;

        if (!gateway) {
            throw new Error('Meal management gateway not available');
        }

        await gateway.deleteMeal(mealId);
        dispatch(backofficeSlice.actions.removeMeal(mealId));
    };
