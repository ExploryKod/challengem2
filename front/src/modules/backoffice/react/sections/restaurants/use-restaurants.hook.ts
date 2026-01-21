import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { AppState, useAppDispatch } from "@taotask/modules/store/store";
import { getRestaurants } from "@taotask/modules/backoffice/core/useCase/get-restaurant.usecase";

export const useRestaurants = () => {
    const dispatch = useAppDispatch();
    
    const restaurants = useSelector((state: AppState) => state.backoffice.restaurants);
    const isLoading = useSelector((state: AppState) => state.backoffice.isLoading);
    const error = useSelector((state: AppState) => state.backoffice.error);

    const fetchRestaurants = () => {
        dispatch(getRestaurants());
    };

    useEffect(() => {
        fetchRestaurants();
    }, []);

    return {
        restaurants,
        isLoading,
        error,
        refetch: fetchRestaurants
    };
};