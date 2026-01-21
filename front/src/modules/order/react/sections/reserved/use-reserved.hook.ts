import {useAppDispatch} from "@taotask/modules/store/store";
import {OrderingDomainModel} from "@taotask/modules/order/core/model/ordering.domain-model";
import {orderingSlice} from "@taotask/modules/order/core/store/ordering.slice";
import OrderingStep = OrderingDomainModel.OrderingStep;

export const useReserved = () => {

    function onNewTable(){
       dispatch(orderingSlice.actions.setStep(OrderingStep.GUESTS))
    }

    const dispatch = useAppDispatch()
  
    return {
        onNewTable
    }
}