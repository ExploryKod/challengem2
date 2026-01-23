import { createAsyncThunk } from "@reduxjs/toolkit";
import { Dependencies } from "@taotask/modules/store/dependencies";
import { orderingActions } from "@taotask/modules/order/core/store/ordering.slice";
import { OrderingDomainModel } from "@taotask/modules/order/core/model/ordering.domain-model";

interface InitQrModeParams {
    restaurantId: string;
    tableId: string;
}

export const initQrMode = createAsyncThunk<
    void,
    InitQrModeParams,
    { extra: Dependencies }
>(
    "ordering/initQrMode",
    async ({ restaurantId, tableId }, { dispatch, extra }) => {
        // 1. Dispatch initQrMode to set initial state
        dispatch(orderingActions.initQrMode({ restaurantId, tableId }));

        try {
            // 2. Fetch tables via tableGateway
            const tables = await extra.tableGateway!.getTables();
            dispatch(orderingActions.storeTables(tables));

            // 3. Find the table and validate it exists
            const table = tables.find(t => t.id === tableId);

            if (table) {
                // 4. Valid table: set capacity and navigate to QR_GUESTS
                dispatch(orderingActions.setQrTableCapacity(table.capacity));
                dispatch(orderingActions.setStep(OrderingDomainModel.OrderingStep.QR_GUESTS));
            } else {
                // 5. Invalid table: set error and fallback to RESTAURANT
                dispatch(orderingActions.setQrError("Table introuvable"));
                dispatch(orderingActions.setStep(OrderingDomainModel.OrderingStep.RESTAURANT));
            }
        } catch (error) {
            // 6. Gateway error: set error and fallback to RESTAURANT
            dispatch(orderingActions.setQrError("Impossible de charger les tables"));
            dispatch(orderingActions.setStep(OrderingDomainModel.OrderingStep.RESTAURANT));
        }
    }
);
