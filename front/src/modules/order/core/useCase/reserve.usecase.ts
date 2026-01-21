import {AppDispatch, AppGetState } from "@taotask/modules/store/store";
import {orderingSlice} from "@taotask/modules/order/core/store/ordering.slice";
import {Dependencies} from "@taotask/modules/store/dependencies";
import { OrderingDomainModel } from "../model/ordering.domain-model";
//  On récup directement le formulaire depuis le getState ici
// Analyser : const x = () => () => {} >>> currying (a function that return a function so maintaining the state of the first param
// See: https://dev.to/earthboundmisfit/multiple-arrow-operators-in-a-single-function-551d
// In Redux, we call it a connect() function : https://react-redux.js.org/api/connect
export const reserve = () => async (dispatch: AppDispatch, getState: AppGetState, { reservationGateway }: Dependencies) => {
    
    const form = getState().ordering.form;
    
    dispatch(orderingSlice.actions.handleReservationLoading())

    const result = await reservationGateway?.reserve({
        tableId: form.tableId!,
        guests: form.guests.map((guest:OrderingDomainModel.Guest) => ({
            id: guest.id,
            firstName: guest.firstName,
            lastName: guest.lastName,
            age: guest.age,
            isOrganizer: guest.id === form.organizerId,
            meals: {
                entry: guest.meals.entry,
                mainCourse: guest.meals.mainCourse!,
                dessert: guest.meals.dessert,
                drink: guest.meals.drink,
            }
        }))
    })
    
    dispatch(orderingSlice.actions.handleReservationSuccess())
}