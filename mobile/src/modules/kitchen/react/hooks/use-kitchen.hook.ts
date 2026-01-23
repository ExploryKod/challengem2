import { useCallback, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  kitchenActions,
  selectFilteredOrders,
  selectFilter,
  selectLoading,
  selectError,
} from '../../core/store/kitchen.slice';
import { KitchenDomainModel } from '../../core/model/kitchen.domain-model';
import { IKitchenGateway } from '../../core/gateway/kitchen.gateway';

const POLLING_INTERVAL = 8000; // 8 seconds

export const useKitchen = (gateway: IKitchenGateway, restaurantId: number) => {
  const dispatch = useDispatch();
  const orders = useSelector(selectFilteredOrders);
  const filter = useSelector(selectFilter);
  const loading = useSelector(selectLoading);
  const error = useSelector(selectError);
  const pollingRef = useRef<NodeJS.Timeout | null>(null);

  const fetchOrders = useCallback(async () => {
    try {
      dispatch(kitchenActions.setLoading(true));
      const fetchedOrders = await gateway.getOrders(restaurantId);
      dispatch(kitchenActions.setOrders(fetchedOrders));
      dispatch(kitchenActions.setError(null));
    } catch (err) {
      dispatch(
        kitchenActions.setError(
          err instanceof Error ? err.message : 'Failed to fetch orders',
        ),
      );
    } finally {
      dispatch(kitchenActions.setLoading(false));
    }
  }, [dispatch, gateway, restaurantId]);

  const markCourseReady = useCallback(
    async (
      reservationId: number,
      course: KitchenDomainModel.CourseType,
    ) => {
      try {
        const updatedOrder = await gateway.markCourseReady(reservationId, course);

        // Check if order should be removed (completed)
        const hasEntry = updatedOrder.meals.entry.count > 0;
        const hasMain = updatedOrder.meals.mainCourse.count > 0;
        const hasDessert = updatedOrder.meals.dessert.count > 0;
        const hasDrink = updatedOrder.meals.drink.count > 0;

        const allReady =
          (!hasEntry || updatedOrder.coursesReady.entry) &&
          (!hasMain || updatedOrder.coursesReady.mainCourse) &&
          (!hasDessert || updatedOrder.coursesReady.dessert) &&
          (!hasDrink || updatedOrder.coursesReady.drink);

        if (allReady) {
          dispatch(kitchenActions.removeOrder(reservationId));
        } else {
          dispatch(kitchenActions.updateOrder(updatedOrder));
        }
      } catch (err) {
        dispatch(
          kitchenActions.setError(
            err instanceof Error ? err.message : 'Failed to mark course ready',
          ),
        );
      }
    },
    [dispatch, gateway],
  );

  const setFilter = useCallback(
    (newFilter: KitchenDomainModel.FilterType) => {
      dispatch(kitchenActions.setFilter(newFilter));
    },
    [dispatch],
  );

  const clearError = useCallback(() => {
    dispatch(kitchenActions.clearError());
  }, [dispatch]);

  // Start polling on mount
  useEffect(() => {
    fetchOrders();

    pollingRef.current = setInterval(fetchOrders, POLLING_INTERVAL);

    return () => {
      if (pollingRef.current) {
        clearInterval(pollingRef.current);
      }
    };
  }, [fetchOrders]);

  return {
    orders,
    filter,
    loading,
    error,
    setFilter,
    markCourseReady,
    clearError,
    refresh: fetchOrders,
  };
};
