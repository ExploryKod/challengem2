import { useAppDispatch } from '@taotask/modules/store/store';
import { OrderingDomainModel } from '@taotask/modules/order/core/model/ordering.domain-model';
import { orderingActions } from '@taotask/modules/order/core/store/ordering.slice';

export interface UseMealsPreviewProps {
  meals: OrderingDomainModel.Meal[];
  restaurantName: string;
}

export const useMealsPreview = ({ meals, restaurantName }: UseMealsPreviewProps) => {
  const dispatch = useAppDispatch();

  const onContinue = () => {
    dispatch(orderingActions.setStep(OrderingDomainModel.OrderingStep.TABLE));
  };

  const onPrevious = () => {
    dispatch(orderingActions.setStep(OrderingDomainModel.OrderingStep.RESTAURANT));
  };

  return {
    meals,
    restaurantName,
    onContinue,
    onPrevious,
  };
};
