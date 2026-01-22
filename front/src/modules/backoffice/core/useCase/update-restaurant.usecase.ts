import { AppDispatch, AppGetState } from "@taotask/modules/store/store";
import { Dependencies } from "@taotask/modules/store/dependencies";
import { backofficeSlice } from "@taotask/modules/backoffice/core/store/backoffice.slice";
import { BackofficeDomainModel } from "@taotask/modules/backoffice/core/model/backoffice.domain-model";

export const updateRestaurantUseCase = (
    restaurantId: number,
    dto: Partial<BackofficeDomainModel.CreateRestaurantDTO>
) =>
    async (dispatch: AppDispatch, getState: AppGetState, dependencies: Dependencies) => {
        const gateway = dependencies.restaurantManagementGateway;

        if (!gateway) {
            throw new Error('Restaurant management gateway not available');
        }

        const updatedRestaurant = await gateway.updateRestaurant(restaurantId, dto);
        dispatch(backofficeSlice.actions.updateRestaurant(updatedRestaurant));

        return updatedRestaurant;
    };
