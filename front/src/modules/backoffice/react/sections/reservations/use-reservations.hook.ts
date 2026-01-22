import { useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '@taotask/modules/store/store';
import { fetchReservations } from '@taotask/modules/backoffice/core/useCase/get-reservations.usecase';
import { deleteReservation as deleteReservationUseCase } from '@taotask/modules/backoffice/core/useCase/remove-reservation.usecase';

export const useReservations = (restaurantId: number) => {
    const dispatch = useAppDispatch();
    const reservations = useAppSelector((state) => state.backoffice.reservations);
    const tables = useAppSelector((state) => state.backoffice.tables);
    const isLoading = useAppSelector((state) => state.backoffice.isLoading);

    useEffect(() => {
        dispatch(fetchReservations(restaurantId));
    }, [dispatch, restaurantId]);

    const deleteReservation = async (reservationId: number) => {
        await dispatch(deleteReservationUseCase(reservationId));
    };

    const getTableTitle = (tableId: number) => {
        const table = tables.find((t) => t.id === tableId);
        return table?.title || `Table #${tableId}`;
    };

    return {
        reservations,
        isLoading,
        deleteReservation,
        getTableTitle,
    };
};
