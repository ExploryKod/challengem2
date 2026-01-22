import { AppDispatch, AppGetState } from "@taotask/modules/store/store";
import { Dependencies } from "@taotask/modules/store/dependencies";
import { backofficeSlice } from "@taotask/modules/backoffice/core/store/backoffice.slice";

export const fetchReservations = (restaurantId: number) =>
    async (dispatch: AppDispatch, getState: AppGetState, dependencies: Dependencies) => {
        const gateway = dependencies.reservationManagementGateway;

        if (!gateway) {
            throw new Error('Reservation management gateway not available');
        }

        const reservations = await gateway.getReservations(restaurantId);
        dispatch(backofficeSlice.actions.setReservations(reservations));

        return reservations;
    };
