import {AppState, useAppDispatch} from "@taotask/modules/store/store";
import {OrderingDomainModel} from "@taotask/modules/order/core/model/ordering.domain-model";
import {useSelector} from "react-redux";
import {orderingSlice} from "@taotask/modules/order/core/store/ordering.slice";
import { reserve } from "@taotask/modules/order/core/useCase/reserve.usecase";
import { useMemo } from 'react';


type MealSummary = {
    id: string,
    title: string,
    price: number
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
        const entryMeal = guest.meals.entry ? findMealById(guest.meals.entry) : null;
        const mainCourseMeal = findMealById(guest.meals.mainCourse!)!;
        const dessertMeal = guest.meals.dessert ? findMealById(guest.meals.dessert) : null;
        const drinkMeal = guest.meals.drink ? findMealById(guest.meals.drink) : null;
        const guestMenu = guest.menuId ? findMenuById(guest.menuId) : null;

        return {
            id: guest.id,
            name: `${guest.firstName} ${guest.lastName}`,
            isOrganizer: guest.id === organizerId,
            menuId: guest.menuId,
            menuTitle: guestMenu?.title || null,
            menuPrice: guestMenu?.price || null,
            meals: {
                entry: entryMeal ? { id: entryMeal.id, title: entryMeal.title, price: entryMeal.price } : null,
                mainCourse: mainCourseMeal ? { id: mainCourseMeal.id, title: mainCourseMeal.title, price: mainCourseMeal.price } : null,
                dessert: dessertMeal ? { id: dessertMeal.id, title: dessertMeal.title, price: dessertMeal.price } : null,
                drink: drinkMeal ? { id: drinkMeal.id, title: drinkMeal.title, price: drinkMeal.price } : null
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
                // Menu pricing
                total += guest.menuPrice;
            } else {
                // A la carte pricing
                if (guest.meals.entry) total += guest.meals.entry.price;
                if (guest.meals.mainCourse) total += guest.meals.mainCourse.price;
                if (guest.meals.dessert) total += guest.meals.dessert.price;
                if (guest.meals.drink) total += guest.meals.drink.price;
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
            if (guest.meals.entry) alaCarteTotal += guest.meals.entry.price;
            if (guest.meals.mainCourse) alaCarteTotal += guest.meals.mainCourse.price;
            if (guest.meals.dessert) alaCarteTotal += guest.meals.dessert.price;
            if (guest.meals.drink) alaCarteTotal += guest.meals.drink.price;
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
