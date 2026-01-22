import { useState, useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '@taotask/modules/store/store';
import { getRestaurants } from '@taotask/modules/backoffice/core/useCase/get-restaurant.usecase';
import { backofficeSlice } from '@taotask/modules/backoffice/core/store/backoffice.slice';

export const useRestaurantDetail = (restaurantId: number) => {
    const dispatch = useAppDispatch();
    const [activeTab, setActiveTab] = useState('info');

    const restaurants = useAppSelector((state) => state.backoffice.restaurants);
    const isLoading = useAppSelector((state) => state.backoffice.isLoading);

    const restaurant = restaurants.find((r) => r.id === restaurantId);

    useEffect(() => {
        dispatch(backofficeSlice.actions.selectRestaurant(restaurantId));
        // Always fetch restaurants to ensure we have the latest data
        dispatch(getRestaurants());
    }, [dispatch, restaurantId]);

    return {
        restaurant,
        activeTab,
        setActiveTab,
        isLoading,
    };
};
