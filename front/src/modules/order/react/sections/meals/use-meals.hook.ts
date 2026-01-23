import { MealForm } from "@taotask/modules/order/core/form/meal.form";
import { OrderingDomainModel } from "@taotask/modules/order/core/model/ordering.domain-model";
import { orderingSlice } from "@taotask/modules/order/core/store/ordering.slice";
import { AppState, useAppDispatch } from "@taotask/modules/store/store";
import { useRef, useEffect, useState } from 'react';
import { useSelector } from "react-redux";
import { chooseMeal } from "@taotask/modules/order/core/useCase/choose-meal.usecase";

export const useMeals = () => {
    const [currentGuestIndex, setCurrentGuestIndex] = useState(0);
    const menus: OrderingDomainModel.Menu[] = useSelector((state: AppState) => state.ordering.availableMenus.data);

    function getGuestMenu(guest: OrderingDomainModel.Guest): OrderingDomainModel.Menu | null {
        if (!guest.menuId) return null;
        return menus.find(m => m.id === guest.menuId) || null;
    }

    function getRequiredMealTypes(guest: OrderingDomainModel.Guest): OrderingDomainModel.MealType[] {
        const menu = getGuestMenu(guest);
        if (!menu) return []; // À la carte - no requirements
        return menu.items
            .filter(item => item.quantity > 0)
            .map(item => item.mealType);
    }

    function getMealIdForType(guest: OrderingDomainModel.Guest, mealType: OrderingDomainModel.MealType): string | null {
        switch (mealType) {
            case OrderingDomainModel.MealType.ENTRY: return guest.meals.entry;
            case OrderingDomainModel.MealType.MAIN_COURSE: return guest.meals.mainCourse;
            case OrderingDomainModel.MealType.DESSERT: return guest.meals.dessert;
            case OrderingDomainModel.MealType.DRINK: return guest.meals.drink;
        }
    }

    function isGuestComplete(guest: OrderingDomainModel.Guest): boolean {
        const menu = getGuestMenu(guest);
        if (!menu) return true; // À la carte always valid

        return menu.items.every(item => {
            if (item.quantity === 0) return true;
            const mealId = getMealIdForType(guest, item.mealType);
            return mealId !== null;
        });
    }

    function getMenuProgress(guest: OrderingDomainModel.Guest): { selected: number; total: number } | null {
        const menu = getGuestMenu(guest);
        if (!menu) return null;

        const requiredItems = menu.items.filter(item => item.quantity > 0);
        const total = requiredItems.length;
        const selected = requiredItems.filter(item => {
            const mealId = getMealIdForType(guest, item.mealType);
            return mealId !== null;
        }).length;

        return { selected, total };
    }

    function findGuestById(guestId: string) {
        return form.guests.find(guest => guest.id === guestId);
    }

    function getSelectableEntries(guest: OrderingDomainModel.Guest | string): OrderingDomainModel.Meal[] {
        const guestObj = typeof guest === 'string' ? findGuestById(guest) : guest;
        if(!guestObj) {
            return [];
        }

        return mealForm.current.getSelectableEntries(meals, guestObj);
    }

    function getSelectableMainCourses(guest: OrderingDomainModel.Guest | string): OrderingDomainModel.Meal[] {
        const guestObj = typeof guest === 'string' ? findGuestById(guest) : guest;
        if(!guestObj) {
            return [];
        }

        return mealForm.current.getSelectableMainCourse(meals, guestObj);
    }

    function getSelectableDesserts(guest: OrderingDomainModel.Guest | string): OrderingDomainModel.Meal[] {
        const guestObj = typeof guest === 'string' ? findGuestById(guest) : guest;
        if(!guestObj) {
            return [];
        }

        return mealForm.current.getSelectableDessert(meals, guestObj);
    }

    function getSelectableDrinks(guest: OrderingDomainModel.Guest | string): OrderingDomainModel.Meal[] {
        const guestObj = typeof guest === 'string' ? findGuestById(guest) : guest;
        if(!guestObj) {
            return [];
        }

        return mealForm.current.getSelectableDrink(meals, guestObj);
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
        dispatch(orderingSlice.actions.setStep(OrderingDomainModel.OrderingStep.GUESTS))
    }

    function onSkip() {
        dispatch(orderingSlice.actions.setStep(OrderingDomainModel.OrderingStep.SUMMARY))
    }

    function onNextGuest() {
        if (!isLastGuest) {
            setCurrentGuestIndex(currentGuestIndex + 1);
        }
    }

    function onPreviousGuest() {
        if (!isFirstGuest) {
            setCurrentGuestIndex(currentGuestIndex - 1);
        }
    }

    function isSubmittable() { return false; }
    const dispatch = useAppDispatch();
    const meals: OrderingDomainModel.Meal[] = useSelector((state: AppState) => state.ordering.availableMeals.data);
    const initialState = useSelector((state: AppState) => state.ordering.form);
    const [form, setForm] = useState<OrderingDomainModel.Form>(initialState);
    const mealForm = useRef(new MealForm())

    const currentGuest = form.guests[currentGuestIndex];
    const isLastGuest = currentGuestIndex === form.guests.length - 1;
    const isFirstGuest = currentGuestIndex === 0;

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
        onSkip,
        onNextGuest,
        onPreviousGuest,
        meals: meals || null,
        guests: form.guests,
        currentGuest,
        currentGuestIndex,
        totalGuests: form.guests.length,
        isLastGuest,
        isFirstGuest,
        isSubmittable: isSubmittable(),
        onMealSelected: assignMeals,
        menus,
        getGuestMenu,
        getRequiredMealTypes,
        isGuestComplete,
        getMenuProgress,
    }
}