import { createTestStore } from "@taotask/modules/testing/tests-environment";
import { deleteReservation } from "@taotask/modules/backoffice/core/useCase/remove-reservation.usecase";
import { BackofficeDomainModel } from "@taotask/modules/backoffice/core/model/backoffice.domain-model";
import { StubReservationManagementGateway } from "@taotask/modules/backoffice/core/testing/stub.reservation-management-gateway";
import { backofficeSlice } from "@taotask/modules/backoffice/core/store/backoffice.slice";

describe('deleteReservation Use Case', () => {
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
    ];

    it('should delete a reservation via gateway and remove it from state', async () => {
        const gateway = new StubReservationManagementGateway(existingReservations);
        const store = createTestStore({
            dependencies: { reservationManagementGateway: gateway },
        });

        store.dispatch(backofficeSlice.actions.setReservations(existingReservations));
        expect(store.getState().backoffice.reservations).toHaveLength(2);

        await store.dispatch(deleteReservation(1));

        const reservations = store.getState().backoffice.reservations;
        expect(reservations).toHaveLength(1);
        expect(reservations[0].id).toBe(2);
    });
});
