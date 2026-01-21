import { AppDispatch, AppGetState } from "@taotask/modules/store/store";
import { Dependencies } from "@taotask/modules/store/dependencies";
import { BackofficeDomainModel } from "@taotask/modules/backoffice/core/model/backoffice.domain-model";
import { backofficeSlice } from "@taotask/modules/backoffice/core/store/backoffice.slice";

export const registerRestaurant = (dto: BackofficeDomainModel.CreateRestaurantDTO) => 
async (dispatch: AppDispatch, getState: AppGetState, dependencies: Dependencies) => {
    
    // await new Promise(resolve => setTimeout(resolve, 500));
    
    // const newRestaurant = {
    //     id: Date.now(),
    //     ...dto
    // };

    const newRestaurant = await dependencies.restaurantManagementGateway?.createRestaurant(dto);
    
    if (!newRestaurant) {
        throw new Error('Restaurant management gateway not available');
    }
    
    dispatch(backofficeSlice.actions.storeRestaurant(newRestaurant));
    
    return newRestaurant;
};