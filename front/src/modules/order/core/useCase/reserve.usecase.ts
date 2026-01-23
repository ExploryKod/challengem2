import {AppDispatch, AppGetState } from "@taotask/modules/store/store";
import {orderingSlice} from "@taotask/modules/order/core/store/ordering.slice";
import {Dependencies} from "@taotask/modules/store/dependencies";
import { OrderingDomainModel } from "../model/ordering.domain-model";

export const reserve = () => async (dispatch: AppDispatch, getState: AppGetState, { reservationGateway }: Dependencies) => {

    const form = getState().ordering.form;

    dispatch(orderingSlice.actions.handleReservationLoading())

    const result = await reservationGateway?.reserve({
        tableId: form.tableId!,
        guests: form.guests.map((guest: OrderingDomainModel.Guest) => ({
            id: guest.id,
            firstName: guest.firstName,
            lastName: guest.lastName,
            age: guest.age,
            isOrganizer: guest.id === form.organizerId,
            meals: {
                entries: guest.meals.entries,
                mainCourses: guest.meals.mainCourses,
                desserts: guest.meals.desserts,
                drinks: guest.meals.drinks,
            }
        }))
    })

    dispatch(orderingSlice.actions.handleReservationSuccess())
}
