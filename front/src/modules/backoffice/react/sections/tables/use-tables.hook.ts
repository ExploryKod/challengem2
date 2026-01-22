import { useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '@taotask/modules/store/store';
import { fetchTables } from '@taotask/modules/backoffice/core/useCase/fetch-tables.usecase';
import { createTable as createTableUseCase } from '@taotask/modules/backoffice/core/useCase/create-table.usecase';
import { deleteTable as deleteTableUseCase } from '@taotask/modules/backoffice/core/useCase/delete-table.usecase';
import { updateTable as updateTableUseCase } from '@taotask/modules/backoffice/core/useCase/update-table.usecase';
import { BackofficeDomainModel } from '@taotask/modules/backoffice/core/model/backoffice.domain-model';

export const useTables = (restaurantId: number) => {
    const dispatch = useAppDispatch();
    const tables = useAppSelector((state) => state.backoffice.tables);
    const isLoading = useAppSelector((state) => state.backoffice.isLoading);

    useEffect(() => {
        dispatch(fetchTables(restaurantId));
    }, [dispatch, restaurantId]);

    const createTable = async (dto: BackofficeDomainModel.CreateTableDTO) => {
        await dispatch(createTableUseCase(dto));
    };

    const deleteTable = async (tableId: number) => {
        await dispatch(deleteTableUseCase(tableId));
    };

    const updateTable = async (tableId: number, dto: BackofficeDomainModel.UpdateTableDTO) => {
        await dispatch(updateTableUseCase(tableId, dto));
    };

    return {
        tables,
        isLoading,
        createTable,
        deleteTable,
        updateTable,
    };
};
