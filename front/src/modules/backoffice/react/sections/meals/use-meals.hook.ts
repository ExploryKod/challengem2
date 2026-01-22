import { useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '@taotask/modules/store/store';
import { fetchMeals } from '@taotask/modules/backoffice/core/useCase/get-meals.usecase';
import { createMeal as createMealUseCase } from '@taotask/modules/backoffice/core/useCase/add-meal.usecase';
import { deleteMeal as deleteMealUseCase } from '@taotask/modules/backoffice/core/useCase/remove-meal.usecase';
import { updateMeal as updateMealUseCase } from '@taotask/modules/backoffice/core/useCase/update-meal.usecase';
import { BackofficeDomainModel } from '@taotask/modules/backoffice/core/model/backoffice.domain-model';

export const useMeals = (restaurantId: number) => {
    const dispatch = useAppDispatch();
    const meals = useAppSelector((state) => state.backoffice.meals);
    const isLoading = useAppSelector((state) => state.backoffice.isLoading);

    useEffect(() => {
        dispatch(fetchMeals(restaurantId));
    }, [dispatch, restaurantId]);

    const createMeal = async (dto: BackofficeDomainModel.CreateMealDTO) => {
        await dispatch(createMealUseCase(dto));
    };

    const deleteMeal = async (mealId: number) => {
        await dispatch(deleteMealUseCase(mealId));
    };

    const updateMeal = async (mealId: number, dto: BackofficeDomainModel.UpdateMealDTO) => {
        await dispatch(updateMealUseCase(mealId, dto));
    };

    return {
        meals,
        isLoading,
        createMeal,
        deleteMeal,
        updateMeal,
    };
};
