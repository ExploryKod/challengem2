import { useAppDispatch, useAppSelector } from "@taotask/modules/store/store";
import { OrderingDomainModel } from "@taotask/modules/order/core/model/ordering.domain-model";
import { orderingSlice } from "@taotask/modules/order/core/store/ordering.slice";
import OrderingStep = OrderingDomainModel.OrderingStep;

export const useReserved = () => {
    const dispatch = useAppDispatch();
    const isTerminalMode = useAppSelector((state) => state.ordering.isTerminalMode);

    function onNewTable() {
        dispatch(orderingSlice.actions.setStep(OrderingStep.GUESTS));
    }

    return {
        onNewTable,
        isTerminalMode,
    };
};
