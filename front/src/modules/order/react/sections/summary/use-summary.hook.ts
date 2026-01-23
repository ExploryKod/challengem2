import {AppState, useAppDispatch} from "@taotask/modules/store/store";
import {OrderingDomainModel} from "@taotask/modules/order/core/model/ordering.domain-model";
import {useSelector} from "react-redux";
import {orderingSlice} from "@taotask/modules/order/core/store/ordering.slice";
import { reserve } from "@taotask/modules/order/core/useCase/reserve.usecase";
import { useMemo } from 'react';


type MealSummary = {
    id: string,
    title: string,
    price: number,
    quantity: number
}

type Guest = {
    id: string | number,
    name: string,
    isOrganizer: boolean,
    menuId: string | null,
    menuTitle: string | null,
    menuPrice: number | null,
    meals: {
        entry: MealSummary | null,
        mainCourse: MealSummary | null,
        dessert: MealSummary | null,
        drink: MealSummary | null
    }
}

type Summary = {
    table: {
        id: string,
        title: string
    },
    guests: Array<Guest>
};

const selectSummary = (state: AppState, menus: OrderingDomainModel.Menu[]): Summary => {
    const meals = state.ordering.availableMeals.data;

    function findMealById(id: string) {
        return meals.find((meal: OrderingDomainModel.Meal) => meal.id === id) ?? null
    }

    function findRestaurantById(id: string) {
        return meals.find((meal: OrderingDomainModel.Meal) => meal.restaurantId === id) ?? null
    }

    function findMenuById(id: string) {
        return menus.find((menu: OrderingDomainModel.Menu) => menu.id === id) ?? null
    }

    const tableId = state.ordering.form.tableId
    const table = state.ordering.availableTables.data.find((table: OrderingDomainModel.Table) => table.id === tableId)!

    const organizerId = state.ordering.form.organizerId;
    const guests = state.ordering.form.guests.map((guest: OrderingDomainModel.Guest) =>  {
        const entrySelection = guest.meals.entry;
        const mainCourseSelection = guest.meals.mainCourse;
        const dessertSelection = guest.meals.dessert;
        const drinkSelection = guest.meals.drink;

        const entryMeal = entrySelection ? findMealById(entrySelection.mealId) : null;
        const mainCourseMeal = mainCourseSelection ? findMealById(mainCourseSelection.mealId) : null;
        const dessertMeal = dessertSelection ? findMealById(dessertSelection.mealId) : null;
        const drinkMeal = drinkSelection ? findMealById(drinkSelection.mealId) : null;
        const guestMenu = guest.menuId ? findMenuById(guest.menuId) : null;

        return {
            id: guest.id,
            name: `${guest.firstName} ${guest.lastName}`,
            isOrganizer: guest.id === organizerId,
            menuId: guest.menuId,
            menuTitle: guestMenu?.title || null,
            menuPrice: guestMenu?.price || null,
            meals: {
                entry: entryMeal ? { id: entryMeal.id, title: entryMeal.title, price: entryMeal.price, quantity: entrySelection?.quantity ?? 1 } : null,
                mainCourse: mainCourseMeal ? { id: mainCourseMeal.id, title: mainCourseMeal.title, price: mainCourseMeal.price, quantity: mainCourseSelection?.quantity ?? 1 } : null,
                dessert: dessertMeal ? { id: dessertMeal.id, title: dessertMeal.title, price: dessertMeal.price, quantity: dessertSelection?.quantity ?? 1 } : null,
                drink: drinkMeal ? { id: drinkMeal.id, title: drinkMeal.title, price: drinkMeal.price, quantity: drinkSelection?.quantity ?? 1 } : null
            },
            restaurantId: guest.restaurantId ? findRestaurantById(guest.restaurantId.toString()): null
        };
    })

    return {
        table : {
            id: table.id,
            title: table.title
        },
        guests
    };
};

export const useSummary = () => {
    const dispatch = useAppDispatch()
    const menus = useSelector((state: AppState) => state.ordering.availableMenus.data);
    const summary: Summary = useSelector((state: AppState) => selectSummary(state, menus))

    function onNext(){
       dispatch(reserve())
    }

    function onPrevious(){
        dispatch(orderingSlice.actions.setStep(OrderingDomainModel.OrderingStep.MEALS))
    }

    const totalPrice = useMemo(() => {
        let total = 0;
        summary.guests.forEach((guest: Guest) => {
            if (guest.menuId && guest.menuPrice) {
                // Menu pricing - fixed price regardless of quantities
                total += guest.menuPrice;
            } else {
                // A la carte pricing - multiply by quantity
                if (guest.meals.entry) total += guest.meals.entry.price * guest.meals.entry.quantity;
                if (guest.meals.mainCourse) total += guest.meals.mainCourse.price * guest.meals.mainCourse.quantity;
                if (guest.meals.dessert) total += guest.meals.dessert.price * guest.meals.dessert.quantity;
                if (guest.meals.drink) total += guest.meals.drink.price * guest.meals.drink.quantity;
            }
        });
        return total.toFixed(2);
    }, [summary.guests]);

    const priceBreakdown = useMemo(() => {
        const menuGuests = summary.guests.filter(g => g.menuId);
        const alaCarteGuests = summary.guests.filter(g => !g.menuId);

        const menusByType = menuGuests.reduce((acc, guest) => {
            const key = guest.menuTitle || 'Menu';
            if (!acc[key]) acc[key] = { count: 0, price: guest.menuPrice || 0 };
            acc[key].count++;
            return acc;
        }, {} as Record<string, { count: number; price: number }>);

        let alaCarteTotal = 0;
        alaCarteGuests.forEach(guest => {
            if (guest.meals.entry) alaCarteTotal += guest.meals.entry.price * guest.meals.entry.quantity;
            if (guest.meals.mainCourse) alaCarteTotal += guest.meals.mainCourse.price * guest.meals.mainCourse.quantity;
            if (guest.meals.dessert) alaCarteTotal += guest.meals.dessert.price * guest.meals.dessert.quantity;
            if (guest.meals.drink) alaCarteTotal += guest.meals.drink.price * guest.meals.drink.quantity;
        });

        return { menusByType, alaCarteTotal, hasAlaCarte: alaCarteGuests.length > 0 };
    }, [summary.guests]);

    return {
        onNext,
        onPrevious,
        summary,
        totalPrice,
        priceBreakdown
    }
}
