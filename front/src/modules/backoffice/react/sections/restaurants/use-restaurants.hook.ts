import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { AppState, useAppDispatch } from "@taotask/modules/store/store";
import { getRestaurants } from "@taotask/modules/backoffice/core/useCase/get-restaurant.usecase";
import { registerRestaurant } from "@taotask/modules/backoffice/core/useCase/register-restaurant.usecase";
import { BackofficeDomainModel } from "@taotask/modules/backoffice/core/model/backoffice.domain-model";

export const useRestaurants = () => {
    const dispatch = useAppDispatch();

    const restaurants = useSelector((state: AppState) => state.backoffice.restaurants);
    const isLoading = useSelector((state: AppState) => state.backoffice.isLoading);
    const error = useSelector((state: AppState) => state.backoffice.error);

    const fetchRestaurants = () => {
        dispatch(getRestaurants());
    };

    const createRestaurant = async (dto: BackofficeDomainModel.CreateRestaurantDTO) => {
        await dispatch(registerRestaurant(dto));
    };

    useEffect(() => {
        fetchRestaurants();
    }, []);

    return {
        restaurants,
        isLoading,
        error,
        refetch: fetchRestaurants,
        createRestaurant
    };
};
