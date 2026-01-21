import { MealForm } from "@taotask/modules/order/core/form/meal.form";
import { OrderingDomainModel } from "@taotask/modules/order/core/model/ordering.domain-model";
import { orderingSlice } from "@taotask/modules/order/core/store/ordering.slice";
import { AppState, useAppDispatch } from "@taotask/modules/store/store";
import { useRef, useEffect, useState } from 'react';
import { useSelector } from "react-redux";
import { chooseMeal } from "@taotask/modules/order/core/useCase/choose-meal.usecase";

export const useMeals = () => {

    function findGuestById(guestId: string) {
        return form.guests.find(guest => guest.id === guestId);
    }

    function getSelectableEntries(guestId: string): OrderingDomainModel.Meal[] {
        const guest = findGuestById(guestId);
        if(!guest) {
            return [];
        }

        return mealForm.current.getSelectableEntries(meals, guest);
    }

    function getSelectableMainCourses(guestId: string): OrderingDomainModel.Meal[] {
        const guest = findGuestById(guestId);
        if(!guest) {
            return [];
        }

        return mealForm.current.getSelectableMainCourse(meals, guest);
    }

    function getSelectableDesserts(guestId: string): OrderingDomainModel.Meal[] {
        const guest = findGuestById(guestId);
        if(!guest) {
            return [];
        }

        return mealForm.current.getSelectableDessert(meals, guest);
    }

    function getSelectableDrinks(guestId: string): OrderingDomainModel.Meal[] {
        const guest = findGuestById(guestId);
        if(!guest) {
            return [];
        }

        return mealForm.current.getSelectableDrink(meals, guest);
    }

    function assignEntry(guestId: string, mealId: string) {
        const nextState = mealForm.current.assignEntry(form, guestId, mealId)
        setForm(nextState)
    }

    function assignMainCourse(guestId: string, mealId: string) {
        const nextState = mealForm.current.assignMainCourse(form, guestId, mealId)
        setForm(nextState)
    }

    function assignDessert(guestId: string, mealId: string) {
        const nextState = mealForm.current.assignDessert(form, guestId, mealId)
        setForm(nextState)
    }

    function assignDrink(guestId: string, mealId: string) {
        const nextState = mealForm.current.assignDrink(form, guestId, mealId)
        setForm(nextState)
    }


    function assignMeals(guestId: string, mealId: string, mealType: string) {
        switch (mealType) {
            case OrderingDomainModel.MealType.ENTRY:
                assignEntry(guestId, mealId);
                break;
            case OrderingDomainModel.MealType.MAIN_COURSE:
                assignMainCourse(guestId, mealId);
                break;
            case OrderingDomainModel.MealType.DESSERT:
                assignDessert(guestId, mealId);
                break;
            case OrderingDomainModel.MealType.DRINK:
                assignDrink(guestId, mealId);
                break;
        }
    }


    function onNext() {
        dispatch(chooseMeal(form))
    }

    function onPrevious() {
        dispatch(orderingSlice.actions.setStep(OrderingDomainModel.OrderingStep.TABLE))
    }

    function isSubmittable() { return false; }
    const dispatch = useAppDispatch();
    const meals: OrderingDomainModel.Meal[] = useSelector((state: AppState) => state.ordering.availableMeals.data);
    const initialState = useSelector((state: AppState) => state.ordering.form);
    const [form, setForm] = useState<OrderingDomainModel.Form>(initialState);
    const mealForm = useRef(new MealForm())

    return {
        getSelectableEntries,
        getSelectableMainCourses,
        getSelectableDesserts,
        getSelectableDrinks,
        assignMeals,
        assignEntry,
        assignMainCourse,
        assignDessert,
        assignDrink,
        onNext,
        onPrevious,
        meals: meals || null,
        guests: form.guests,
        isSubmittable: isSubmittable()
    }
}