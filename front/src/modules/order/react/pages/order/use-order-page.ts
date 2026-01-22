import { useState, useEffect, useRef, useCallback } from 'react';
import { OrderingDomainModel } from '@taotask/modules/order/core/model/ordering.domain-model';
import { useAppDispatch } from '@taotask/modules/store/store';
import { orderingActions } from '@taotask/modules/order/core/store/ordering.slice';
import { useDependencies } from '@taotask/modules/app/react/DependenciesProvider';

export interface UseOrderPageOptions {
    restaurantId?: string;
}

const EMPTY_RESTAURANT_LIST: OrderingDomainModel.RestaurantList = {
    restaurants: [],
    restaurantId: ""
};

export const useOrderPage = (options?: UseOrderPageOptions) => {
    const dispatch = useAppDispatch();
    const dependencies = useDependencies();
    const isTerminalMode = !!options?.restaurantId;

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
                fetchMealsForRestaurant();
            } else {
                console.error('Restaurant not found:', restaurantId);
            }
        } catch (error) {
            console.error('Failed to init terminal mode:', error);
        }
    }, [dependencies.restaurantGateway, dispatch, fetchMealsForRestaurant]);

    useEffect(() => {
        if (!isTerminalMode) {
            displayRestaurants();
        }
    }, [isTerminalMode, displayRestaurants]);

    useEffect(() => {
        if (isTerminalMode && options?.restaurantId) {
            initTerminalMode(options.restaurantId);
        }
    }, [isTerminalMode, options?.restaurantId, initTerminalMode]);

    return {
        isTerminalMode,
        bottomRef,
        selectRestaurant,
        restaurantList,
        meals,
        animText
    };
};
