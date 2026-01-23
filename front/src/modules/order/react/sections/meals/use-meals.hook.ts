import { MealForm } from "@taotask/modules/order/core/form/meal.form";
import { OrderingDomainModel } from "@taotask/modules/order/core/model/ordering.domain-model";
import { orderingSlice, orderingActions } from "@taotask/modules/order/core/store/ordering.slice";
import { AppState, useAppDispatch } from "@taotask/modules/store/store";
import { useRef, useState } from 'react';
import { useSelector } from "react-redux";
import { chooseMeal } from "@taotask/modules/order/core/useCase/choose-meal.usecase";

export const useMeals = () => {
    const [currentGuestIndex, setCurrentGuestIndex] = useState(0);
    const menus: OrderingDomainModel.Menu[] = useSelector((state: AppState) => state.ordering.availableMenus.data);
    const selectedMenuId = useSelector((state: AppState) => state.ordering.selectedMenuId);

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
            case OrderingDomainModel.MealType.ENTRY: return guest.meals.entry?.mealId ?? null;
            case OrderingDomainModel.MealType.MAIN_COURSE: return guest.meals.mainCourse?.mealId ?? null;
            case OrderingDomainModel.MealType.DESSERT: return guest.meals.dessert?.mealId ?? null;
            case OrderingDomainModel.MealType.DRINK: return guest.meals.drink?.mealId ?? null;
        }
    }

    function getMealQuantityForType(guest: OrderingDomainModel.Guest, mealType: OrderingDomainModel.MealType): number {
        switch (mealType) {
            case OrderingDomainModel.MealType.ENTRY: return guest.meals.entry?.quantity ?? 0;
            case OrderingDomainModel.MealType.MAIN_COURSE: return guest.meals.mainCourse?.quantity ?? 0;
            case OrderingDomainModel.MealType.DESSERT: return guest.meals.dessert?.quantity ?? 0;
            case OrderingDomainModel.MealType.DRINK: return guest.meals.drink?.quantity ?? 0;
        }
    }

    function getMaxQuantityForType(guest: OrderingDomainModel.Guest, mealType: OrderingDomainModel.MealType): number {
        const A_LA_CARTE_MAX = 10;

        // A la carte mode - no menu restrictions
        if (!guest.menuId) {
            return A_LA_CARTE_MAX;
        }

        // Menu mode - find the menu and get the quantity limit for this meal type
        const menu = getGuestMenu(guest);
        if (!menu) {
            return A_LA_CARTE_MAX; // Fallback if menu not found
        }

        const menuItem = menu.items.find(item => item.mealType === mealType);
        return menuItem?.quantity ?? 0; // Return 0 if meal type not in menu
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

    function clearIncompatibleMeals(guest: OrderingDomainModel.Guest, menu: OrderingDomainModel.Menu | null): OrderingDomainModel.Guest {
        if (!menu) return guest; // a la carte keeps all meals

        const requiredTypes = menu.items
            .filter(item => item.quantity > 0)
            .map(item => item.mealType);

        return {
            ...guest,
            meals: {
                entry: requiredTypes.includes(OrderingDomainModel.MealType.ENTRY) ? guest.meals.entry : null,
                mainCourse: requiredTypes.includes(OrderingDomainModel.MealType.MAIN_COURSE) ? guest.meals.mainCourse : null,
                dessert: requiredTypes.includes(OrderingDomainModel.MealType.DESSERT) ? guest.meals.dessert : null,
                drink: requiredTypes.includes(OrderingDomainModel.MealType.DRINK) ? guest.meals.drink : null,
            }
        };
    }

    function incrementQuantity(guestId: string, mealType: OrderingDomainModel.MealType) {
        const guest = form.guests.find(g => g.id === guestId);
        if (!guest) return;

        const currentQty = getMealQuantityForType(guest, mealType);
        const maxQty = getMaxQuantityForType(guest, mealType);
        if (currentQty >= maxQty) return; // Respect menu constraints

        const nextState = mealForm.current.updateQuantity(form, guestId, mealType, currentQty + 1);
        setForm(nextState);
    }

    function decrementQuantity(guestId: string, mealType: OrderingDomainModel.MealType) {
        const guest = form.guests.find(g => g.id === guestId);
        if (!guest) return;

        const currentQty = getMealQuantityForType(guest, mealType);
        const nextState = mealForm.current.updateQuantity(form, guestId, mealType, currentQty - 1);
        setForm(nextState);
    }

    function onSelectMenu(menuId: string | null) {
        // Dispatch menu selection to Redux (UI state)
        dispatch(orderingActions.selectMenu(menuId));

        // Get the new menu
        const newMenu = menuId ? menus.find(m => m.id === menuId) || null : null;

        // Update current guest menu + clear incompatible meals
        if (currentGuest) {
            const nextGuest = clearIncompatibleMeals(
                { ...currentGuest, menuId },
                newMenu
            );

            // Update the form state with the updated guest
            setForm(prevForm => ({
                ...prevForm,
                guests: prevForm.guests.map(g =>
                    g.id === currentGuest.id ? nextGuest : g
                )
            }));
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

    const selectedMenu = selectedMenuId
        ? menus.find(m => m.id === selectedMenuId) || null
        : null;

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
        onSelectMenu,
        incrementQuantity,
        decrementQuantity,
        getMealIdForType,
        getMealQuantityForType,
        getMaxQuantityForType,
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
        selectedMenuId,
        selectedMenu,
        getGuestMenu,
        getRequiredMealTypes,
        isGuestComplete,
        getMenuProgress,
    }
}