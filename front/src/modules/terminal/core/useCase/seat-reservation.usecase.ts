import { AppDispatch, AppGetState } from '@taotask/modules/store/store';
import { Dependencies } from '@taotask/modules/store/dependencies';
import { terminalActions } from '../store/terminal.slice';
import { TerminalDomainModel } from '../model/terminal.domain-model';

export const seatReservation = () => async (
    dispatch: AppDispatch,
    getState: AppGetState,
    { terminalReservationGateway }: Dependencies
) => {
    const reservation = getState().terminal.reservation;

    if (!reservation) {
        return;
    }

    await terminalReservationGateway?.updateStatus(
        reservation.id,
        TerminalDomainModel.ReservationStatus.SEATED
    );

    dispatch(terminalActions.goToConfirmation());
};
