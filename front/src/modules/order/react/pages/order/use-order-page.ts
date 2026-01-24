import { useState, useEffect, useRef, useCallback } from 'react';
import { OrderingDomainModel } from '@taotask/modules/order/core/model/ordering.domain-model';
import { useAppDispatch } from '@taotask/modules/store/store';
import { orderingActions } from '@taotask/modules/order/core/store/ordering.slice';
import { useDependencies } from '@taotask/modules/app/react/DependenciesProvider';
import { initQrMode } from '@taotask/modules/order/core/useCase/init-qr-mode.usecase';

export interface UseOrderPageOptions {
    restaurantId?: string;
    tableId?: string;
    qrRestaurantId?: string;
}

const EMPTY_RESTAURANT_LIST: OrderingDomainModel.RestaurantList = {
    restaurants: [],
    restaurantId: ""
};

export const useOrderPage = (options?: UseOrderPageOptions) => {
    const dispatch = useAppDispatch();
    const dependencies = useDependencies();
    const isTerminalMode = !!options?.restaurantId;
    const isQrMode = !!(options?.tableId && options?.qrRestaurantId);

    const animText = useRef<HTMLDivElement>(null);
    const bottomRef = useRef<HTMLDivElement>(null);
    const [restaurantList, setRestaurantList] = useState<OrderingDomainModel.RestaurantList>(EMPTY_RESTAURANT_LIST);
    const [meals, setMeals] = useState<OrderingDomainModel.Meal[]>([]);

    const fetchMealsForRestaurant = useCallback(async () => {
        try {
            const fetchedMeals = await dependencies.mealGateway?.getMeals() || [];
            setMeals(fetchedMeals);
        } catch (error) {
            console.error('Failed to fetch meals:', error);
            setMeals([]);
        }
    }, [dependencies.mealGateway]);

    const displayRestaurants = useCallback(async () => {
        try {
            const restaurants = await dependencies.restaurantGateway?.getRestaurants() || [];
            setRestaurantList({ restaurants, restaurantId: "" });
        } catch (error) {
            console.error('Failed to fetch restaurants:', error);
            setRestaurantList(EMPTY_RESTAURANT_LIST);
        }
    }, [dependencies.restaurantGateway]);

    const selectRestaurant = useCallback((id: string) => {
        setRestaurantList(prev => ({ ...prev, restaurantId: id }));
        dispatch(orderingActions.setRestaurantId(id));
        fetchMealsForRestaurant();
    }, [dispatch, fetchMealsForRestaurant]);

    const initTerminalMode = useCallback(async (restaurantId: string) => {
        try {
            const restaurants = await dependencies.restaurantGateway?.getRestaurants() || [];
            const restaurant = restaurants.find(r => r.id === restaurantId);
            if (restaurant) {
                setRestaurantList({ restaurants: [restaurant], restaurantId });
                dispatch(orderingActions.setRestaurantId(restaurantId));
                dispatch(orderingActions.setTerminalMode(true));
                fetchMealsForRestaurant();
            } else {
                console.error('Restaurant not found:', restaurantId);
            }
        } catch (error) {
            console.error('Failed to init terminal mode:', error);
        }
    }, [dependencies.restaurantGateway, dispatch, fetchMealsForRestaurant]);

    const initQrModeFlow = useCallback(async (restaurantId: string, tableId: string) => {
        try {
            const restaurants = await dependencies.restaurantGateway?.getRestaurants() || [];
            const restaurant = restaurants.find(r => String(r.id) === restaurantId);
            if (restaurant) {
                setRestaurantList({ restaurants: [restaurant], restaurantId: restaurant.id });
                fetchMealsForRestaurant();
            }
            dispatch(initQrMode({ restaurantId, tableId }));
        } catch (error) {
            console.error('Failed to init QR mode:', error);
        }
    }, [dependencies.restaurantGateway, dispatch, fetchMealsForRestaurant]);

    useEffect(() => {
        if (!isTerminalMode && !isQrMode) {
            displayRestaurants();
        }
    }, [isTerminalMode, isQrMode, displayRestaurants]);

    useEffect(() => {
        if (isTerminalMode && options?.restaurantId) {
            initTerminalMode(options.restaurantId);
        }
    }, [isTerminalMode, options?.restaurantId, initTerminalMode]);

    useEffect(() => {
        if (isQrMode && options?.qrRestaurantId && options?.tableId) {
            initQrModeFlow(options.qrRestaurantId, options.tableId);
        }
    }, [isQrMode, options?.qrRestaurantId, options?.tableId, initQrModeFlow]);

    return {
        isTerminalMode,
        isQrMode,
        bottomRef,
        selectRestaurant,
        restaurantList,
        meals,
        animText
    };
};
