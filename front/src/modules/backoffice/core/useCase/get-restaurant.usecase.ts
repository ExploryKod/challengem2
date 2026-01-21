import { AppDispatch, AppGetState } from "@taotask/modules/store/store";
import { Dependencies } from "@taotask/modules/store/dependencies";
import { backofficeSlice } from "@taotask/modules/backoffice/core/store/backoffice.slice";

export const getRestaurants = () => 
    async (dispatch: AppDispatch, getState: AppGetState, dependencies: Dependencies) => {
        dispatch(backofficeSlice.actions.setLoading(true));
        dispatch(backofficeSlice.actions.setError(null));
        
        try {
            const restaurants = await dependencies.restaurantManagementGateway?.getRestaurants();
            
            if (!restaurants) {
                throw new Error('Restaurant management gateway not available');
            }
            
            dispatch(backofficeSlice.actions.setRestaurants(restaurants));
            
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
            dispatch(backofficeSlice.actions.setError(errorMessage));
        } finally {
            dispatch(backofficeSlice.actions.setLoading(false));
        }
    };