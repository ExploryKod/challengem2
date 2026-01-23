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

    const reservation = await terminalReservationGateway?.getByCode(code);

    if (!reservation) {
        dispatch(terminalActions.setLookupError('Reservation non trouvee'));
        return;
    }

    dispatch(terminalActions.setReservation(reservation));

    if (TerminalDomainModel.hasPreOrders(reservation)) {
        dispatch(terminalActions.goToConfirmation());
    } else {
        dispatch(terminalActions.goToMenuBrowse());
    }
};
