import { createTestStore } from '@taotask/modules/testing/tests-environment';
import { StubTerminalReservationGateway } from '../testing/stub.terminal-reservation-gateway';
import { lookupReservation } from './lookup-reservation.usecase';
import { TerminalDomainModel } from '../model/terminal.domain-model';

const createReservationWithMeals = (): TerminalDomainModel.Reservation => ({
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
                entry: { mealId: '1', quantity: 1 },
                mainCourse: { mealId: '2', quantity: 1 },
                dessert: null,
                drink: null,
            },
        },
    ],
});

const createReservationWithoutMeals = (): TerminalDomainModel.Reservation => ({
    id: 2,
    code: 'XYZ789',
    status: TerminalDomainModel.ReservationStatus.CONFIRMED,
    restaurantId: 1,
    tableId: 2,
    guests: [
        {
            id: 2,
            firstName: 'Jane',
            lastName: 'Doe',
            age: 28,
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

describe('Lookup Reservation Use Case', () => {
    it('should set loading state when lookup starts', async () => {
        const reservation = createReservationWithMeals();
        const terminalReservationGateway = new StubTerminalReservationGateway([reservation]);
        const store = createTestStore({
            dependencies: { terminalReservationGateway },
        });

        const promise = store.dispatch(lookupReservation('ABC123'));
        expect(store.getState().terminal.lookupStatus).toBe('loading');
        await promise;
    });

    it('should store reservation and go to confirmation when reservation has pre-orders', async () => {
        const reservation = createReservationWithMeals();
        const terminalReservationGateway = new StubTerminalReservationGateway([reservation]);
        const store = createTestStore({
            dependencies: { terminalReservationGateway },
        });

        await store.dispatch(lookupReservation('ABC123'));

        expect(store.getState().terminal.lookupStatus).toBe('success');
        expect(store.getState().terminal.reservation).toEqual(reservation);
        expect(store.getState().terminal.step).toBe(TerminalDomainModel.TerminalStep.CONFIRMATION);
    });

    it('should store reservation and go to menu browse when reservation has no pre-orders', async () => {
        const reservation = createReservationWithoutMeals();
        const terminalReservationGateway = new StubTerminalReservationGateway([reservation]);
        const store = createTestStore({
            dependencies: { terminalReservationGateway },
        });

        await store.dispatch(lookupReservation('XYZ789'));

        expect(store.getState().terminal.lookupStatus).toBe('success');
        expect(store.getState().terminal.reservation).toEqual(reservation);
        expect(store.getState().terminal.step).toBe(TerminalDomainModel.TerminalStep.MENU_BROWSE);
    });

    it('should set error when reservation is not found', async () => {
        const terminalReservationGateway = new StubTerminalReservationGateway([]);
        const store = createTestStore({
            dependencies: { terminalReservationGateway },
        });

        await store.dispatch(lookupReservation('INVALID'));

        expect(store.getState().terminal.lookupStatus).toBe('error');
        expect(store.getState().terminal.error).toBe('Reservation non trouvee');
    });
});
