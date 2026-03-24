import { AppDispatch, AppGetState } from "@taotask/modules/store/store";
import { Dependencies } from "@taotask/modules/store/dependencies";
import { backofficeSlice } from "@taotask/modules/backoffice/core/store/backoffice.slice";
import { classifyApiError } from "@taotask/modules/shared/error.utils";

export const getRestaurants = () => 
    async (dispatch: AppDispatch, getState: AppGetState, dependencies: Dependencies) => {
        dispatch(backofficeSlice.actions.setLoading(true));
        dispatch(backofficeSlice.actions.setError(null));
        
        try {
            const gateway = dependencies.restaurantManagementGateway;
            const restaurants = await gateway?.getRestaurants();

            if (!restaurants) {
                throw new Error('Restaurant management gateway not available');
            }

            dispatch(backofficeSlice.actions.setRestaurants(restaurants));

            const lastError = gateway && 'getLastError' in gateway
                ? (gateway as { getLastError: () => unknown }).getLastError()
                : null;

            if (lastError) {
                const { kind, message } = classifyApiError(lastError);
                const prefix = kind === 'connection'
                    ? "Mode démo : API indisponible."
                    : `Erreur API : passage en mode démo. `;
                dispatch(backofficeSlice.actions.setError(`${prefix} Restaurants de démo affichés.`));
                console.error(message);
            } else {
                dispatch(backofficeSlice.actions.setError(null));
            }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
            dispatch(backofficeSlice.actions.setError(errorMessage));
        } finally {
            dispatch(backofficeSlice.actions.setLoading(false));
        }
    };