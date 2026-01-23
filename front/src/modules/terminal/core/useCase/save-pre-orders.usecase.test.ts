import { createTestStore } from '@taotask/modules/testing/tests-environment';
import { savePreOrders } from './save-pre-orders.usecase';
import { StubTerminalReservationGateway } from '../testing/stub.terminal-reservation-gateway';
import { TerminalDomainModel } from '../model/terminal.domain-model';
import { OrderingDomainModel } from '@taotask/modules/order/core/model/ordering.domain-model';

describe('save-pre-orders use case', () => {
    const createReservation = (): TerminalDomainModel.Reservation => ({
        id: 1,
        code: 'ABC123',
        status: TerminalDomainModel.ReservationStatus.CONFIRMED,
        restaurantId: 1,
        tableId: 10,
        guests: [
            {
                id: 1,
                firstName: 'John',
                lastName: 'Doe',
                age: 30,
                isOrganizer: true,
                meals: { entry: null, mainCourse: null, dessert: null, drink: null },
            },
            {
                id: 2,
                firstName: 'Jane',
                lastName: 'Doe',
                age: 28,
                isOrganizer: false,
                meals: { entry: null, mainCourse: null, dessert: null, drink: null },
            },
        ],
    });

    const createOrderingForm = (): OrderingDomainModel.Form => ({
        guests: [
            {
                id: '1',
                firstName: 'John',
                lastName: 'Doe',
                age: 30,
                isOrganizer: true,
                restaurantId: '1',
                menuId: null,
                meals: {
                    entries: [{ mealId: '101', quantity: 1 }],
                    mainCourses: [{ mealId: '201', quantity: 1 }],
                    desserts: [],
                    drinks: [{ mealId: '401', quantity: 1 }],
                },
            },
            {
                id: '2',
                firstName: 'Jane',
                lastName: 'Doe',
                age: 28,
                isOrganizer: false,
                restaurantId: '1',
                menuId: null,
                meals: {
                    entries: [],
                    mainCourses: [{ mealId: '202', quantity: 1 }],
                    desserts: [{ mealId: '301', quantity: 1 }],
                    drinks: [],
                },
            },
        ],
        organizerId: '1',
        tableId: '10',
    });

    it('should save guest meal selections to the reservation', async () => {
        const reservation = createReservation();
        const gateway = new StubTerminalReservationGateway([reservation]);

        // Create base store to get proper initial state structure
        const baseStore = createTestStore({
            dependencies: { terminalReservationGateway: gateway },
        });

        // Create store with terminal reservation and ordering form
        const store = createTestStore({
            initialState: {
                ...baseStore.getState(),
                terminal: {
                    ...baseStore.getState().terminal,
                    step: TerminalDomainModel.TerminalStep.PRE_ORDER,
                    restaurantId: '1',
                    identifyMode: 'reservation' as const,
                    reservationCode: 'ABC123',
                    guestCount: 2,
                    reservation,
                    error: null,
                    lookupStatus: 'success' as const,
                },
                ordering: {
                    ...baseStore.getState().ordering,
                    form: createOrderingForm(),
                },
            },
            dependencies: { terminalReservationGateway: gateway },
        });

        await store.dispatch(savePreOrders());

        const updatedMeals = gateway.getUpdatedGuestsMeals();
        expect(updatedMeals).toHaveLength(1);
        expect(updatedMeals[0].id).toBe(1);
        expect(updatedMeals[0].guests).toEqual([
            {
                firstName: 'John',
                lastName: 'Doe',
                age: 30,
                isOrganizer: true,
                entryId: 101,
                mainCourseId: 201,
                dessertId: undefined,
                drinkId: 401,
            },
            {
                firstName: 'Jane',
                lastName: 'Doe',
                age: 28,
                isOrganizer: false,
                entryId: undefined,
                mainCourseId: 202,
                dessertId: 301,
                drinkId: undefined,
            },
        ]);
    });

    it('should not call gateway if no reservation exists', async () => {
        const gateway = new StubTerminalReservationGateway([]);

        const store = createTestStore({
            dependencies: { terminalReservationGateway: gateway },
        });

        await store.dispatch(savePreOrders());

        expect(gateway.getUpdatedGuestsMeals()).toHaveLength(0);
    });

    it('should update terminal reservation state after saving', async () => {
        const reservation: TerminalDomainModel.Reservation = {
            id: 1,
            code: 'ABC123',
            status: TerminalDomainModel.ReservationStatus.CONFIRMED,
            restaurantId: 1,
            tableId: 10,
            guests: [
                {
                    id: 1,
                    firstName: 'John',
                    lastName: 'Doe',
                    age: 30,
                    isOrganizer: true,
                    meals: { entry: null, mainCourse: null, dessert: null, drink: null },
                },
            ],
        };

        const gateway = new StubTerminalReservationGateway([reservation]);

        const baseStore = createTestStore({
            dependencies: { terminalReservationGateway: gateway },
        });

        const store = createTestStore({
            initialState: {
                ...baseStore.getState(),
                terminal: {
                    ...baseStore.getState().terminal,
                    step: TerminalDomainModel.TerminalStep.PRE_ORDER,
                    restaurantId: '1',
                    identifyMode: 'reservation' as const,
                    reservationCode: 'ABC123',
                    guestCount: 1,
                    reservation,
                    error: null,
                    lookupStatus: 'success' as const,
                },
                ordering: {
                    ...baseStore.getState().ordering,
                    form: {
                        guests: [
                            {
                                id: '1',
                                firstName: 'John',
                                lastName: 'Doe',
                                age: 30,
                                isOrganizer: true,
                                restaurantId: '1',
                                menuId: null,
                                meals: {
                                    entries: [{ mealId: '101', quantity: 1 }],
                                    mainCourses: [],
                                    desserts: [],
                                    drinks: [],
                                },
                            },
                        ],
                        organizerId: '1',
                        tableId: '10',
                    },
                },
            },
            dependencies: { terminalReservationGateway: gateway },
        });

        await store.dispatch(savePreOrders());

        const terminalState = store.getState().terminal;
        expect(terminalState.reservation?.guests[0].meals.entry).toEqual({
            mealId: '101',
            quantity: 1,
        });
    });
});
