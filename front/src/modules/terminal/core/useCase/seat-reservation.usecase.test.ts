import { createTestStore } from '@taotask/modules/testing/tests-environment';
import { StubTerminalReservationGateway } from '../testing/stub.terminal-reservation-gateway';
import { seatReservation } from './seat-reservation.usecase';
import { TerminalDomainModel } from '../model/terminal.domain-model';
import { TerminalState } from '../store/terminal.slice';

const createReservation = (): TerminalDomainModel.Reservation => ({
    id: 1,
    code: 'ABC123',
    status: TerminalDomainModel.ReservationStatus.CONFIRMED,
    restaurantId: 1,
    tableId: 1,
    guests: [
        {
            id: 1,
            firstName: 'John',
            lastName: 'Doe',
            age: 30,
            isOrganizer: true,
            meals: {
                entry: null,
                mainCourse: null,
                dessert: null,
                drink: null,
            },
        },
    ],
});

const createTerminalState = (reservation: TerminalDomainModel.Reservation): TerminalState => ({
    step: TerminalDomainModel.TerminalStep.MENU_BROWSE,
    restaurantId: '1',
    identifyMode: 'reservation',
    reservationCode: reservation.code,
    guestCount: 1,
    reservation,
    error: null,
    lookupStatus: 'success',
});

describe('Seat Reservation Use Case', () => {
    it('should update reservation status to SEATED and go to confirmation', async () => {
        const reservation = createReservation();
        const terminalReservationGateway = new StubTerminalReservationGateway([reservation]);
        const store = createTestStore({
            initialState: {
                terminal: createTerminalState(reservation),
            },
            dependencies: { terminalReservationGateway },
        });

        await store.dispatch(seatReservation());

        expect(store.getState().terminal.step).toBe(TerminalDomainModel.TerminalStep.CONFIRMATION);
        terminalReservationGateway.expectUpdateStatusCalledWith(1, TerminalDomainModel.ReservationStatus.SEATED);
    });

    it('should not call gateway when no reservation is present', async () => {
        const terminalReservationGateway = new StubTerminalReservationGateway([]);
        const store = createTestStore({
            dependencies: { terminalReservationGateway },
        });

        await store.dispatch(seatReservation());

        expect(terminalReservationGateway.getUpdatedStatuses()).toHaveLength(0);
    });
});
