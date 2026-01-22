import { AppDispatch, AppGetState } from "@taotask/modules/store/store";
import { Dependencies } from "@taotask/modules/store/dependencies";
import { BackofficeDomainModel } from "@taotask/modules/backoffice/core/model/backoffice.domain-model";
import { backofficeSlice } from "@taotask/modules/backoffice/core/store/backoffice.slice";

export const updateMeal = (mealId: number, dto: BackofficeDomainModel.UpdateMealDTO) =>
    async (dispatch: AppDispatch, getState: AppGetState, dependencies: Dependencies) => {
        const gateway = dependencies.mealManagementGateway;

        if (!gateway) {
            throw new Error('Meal management gateway not available');
        }

        const updatedMeal = await gateway.updateMeal(mealId, dto);
        dispatch(backofficeSlice.actions.updateMeal(updatedMeal));

        return updatedMeal;
    };
