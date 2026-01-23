import { AppDispatch, AppGetState } from '@taotask/modules/store/store';
import { Dependencies } from '@taotask/modules/store/dependencies';
import { terminalActions } from '../store/terminal.slice';
import { UpdateGuestMealsInput } from '../gateway/terminal-reservation.gateway';

export const savePreOrders = () => async (
    dispatch: AppDispatch,
    getState: AppGetState,
    { terminalReservationGateway }: Dependencies
) => {
    const terminalState = getState().terminal;
    const orderingState = getState().ordering;
    const reservation = terminalState.reservation;

    if (!reservation) {
        return;
    }

    // Map ordering guests to the update format
    const guestsInput: UpdateGuestMealsInput[] = orderingState.form.guests.map(guest => {
        // Get first meal selection from each array (backend expects single meal per type)
        const entry = guest.meals.entries[0];
        const mainCourse = guest.meals.mainCourses[0];
        const dessert = guest.meals.desserts[0];
        const drink = guest.meals.drinks[0];

        return {
            firstName: guest.firstName,
            lastName: guest.lastName,
            age: guest.age,
            isOrganizer: guest.isOrganizer,
            entryId: entry ? parseInt(entry.mealId, 10) : undefined,
            mainCourseId: mainCourse ? parseInt(mainCourse.mealId, 10) : undefined,
            dessertId: dessert ? parseInt(dessert.mealId, 10) : undefined,
            drinkId: drink ? parseInt(drink.mealId, 10) : undefined,
        };
    });

    const updatedReservation = await terminalReservationGateway?.updateGuestsMeals(
        reservation.id,
        guestsInput
    );

    if (updatedReservation) {
        dispatch(terminalActions.setReservation(updatedReservation));
    }
};
