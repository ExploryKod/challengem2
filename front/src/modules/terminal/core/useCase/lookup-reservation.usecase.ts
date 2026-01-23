import { AppDispatch, AppGetState } from '@taotask/modules/store/store';
import { Dependencies } from '@taotask/modules/store/dependencies';
import { terminalActions } from '../store/terminal.slice';
import { TerminalDomainModel } from '../model/terminal.domain-model';

export const lookupReservation = (code: string) => async (
    dispatch: AppDispatch,
    _getState: AppGetState,
    { terminalReservationGateway }: Dependencies
) => {
    dispatch(terminalActions.setLookupLoading());

    try {
        const reservation = await terminalReservationGateway?.getByCode(code);

        if (!reservation) {
            dispatch(terminalActions.setLookupError('Reservation non trouvee'));
            return;
        }

        dispatch(terminalActions.setReservation(reservation));

        // Set restaurantId from the reservation if not already set
        dispatch(terminalActions.setRestaurantId(reservation.restaurantId.toString()));

        if (TerminalDomainModel.hasPreOrders(reservation)) {
            dispatch(terminalActions.goToConfirmation());
        } else {
            dispatch(terminalActions.goToMenuBrowse());
        }
    } catch (error) {
        console.error('Error looking up reservation:', error);
        dispatch(terminalActions.setLookupError('Erreur lors de la recherche de la reservation'));
    }
};
