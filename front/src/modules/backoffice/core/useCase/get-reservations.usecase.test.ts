import { createTestStore } from "@taotask/modules/testing/tests-environment";
import { fetchReservations } from "@taotask/modules/backoffice/core/useCase/get-reservations.usecase";
import { BackofficeDomainModel } from "@taotask/modules/backoffice/core/model/backoffice.domain-model";
import { StubReservationManagementGateway } from "@taotask/modules/backoffice/core/testing/stub.reservation-management-gateway";

describe('fetchReservations Use Case', () => {
    const restaurantId = 1;

    const existingReservations: BackofficeDomainModel.Reservation[] = [
        {
            id: 1,
            restaurantId: 1,
            tableId: 1,
            guests: [{ firstName: 'John', lastName: 'Doe', age: 30, isOrganizer: true }],
            createdAt: '2026-01-22T10:00:00Z'
        },
        {
            id: 2,
            restaurantId: 1,
            tableId: 2,
            guests: [{ firstName: 'Jane', lastName: 'Smith', age: 28, isOrganizer: true }],
            createdAt: '2026-01-22T11:00:00Z'
        },
        {
            id: 3,
            restaurantId: 2,
            tableId: 3,
            guests: [{ firstName: 'Bob', lastName: 'Brown', age: 35, isOrganizer: true }],
            createdAt: '2026-01-22T12:00:00Z'
        },
    ];

    it('should fetch reservations for a specific restaurant and store them in state', async () => {
        const gateway = new StubReservationManagementGateway(existingReservations);
        const store = createTestStore({
            dependencies: { reservationManagementGateway: gateway },
        });

        await store.dispatch(fetchReservations(restaurantId));

        const reservations = store.getState().backoffice.reservations;
        expect(reservations).toHaveLength(2);
        expect(reservations[0].guests[0].firstName).toBe('John');
        expect(reservations[1].guests[0].firstName).toBe('Jane');
    });

    it('should return empty array when restaurant has no reservations', async () => {
        const gateway = new StubReservationManagementGateway([]);
        const store = createTestStore({
            dependencies: { reservationManagementGateway: gateway },
        });

        await store.dispatch(fetchReservations(restaurantId));

        expect(store.getState().backoffice.reservations).toEqual([]);
    });
});
