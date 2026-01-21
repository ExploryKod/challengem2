// On va se faire un mock > dossier testing
import {MockReservationGateway} from "@taotask/modules/order/core/testing/mock.reservationGateway";
import {createTestStore} from "@taotask/modules/testing/tests-environment";
import { reserve } from "@taotask/modules/order/core/useCase/reserve.usecase";
import {OrderingDomainModel} from "@taotask/modules/order/core/model/ordering.domain-model";
import {GuestFactory} from "@taotask/modules/order/core/model/guest.factory";
import {OrderingState} from "@taotask/modules/order/core/store/ordering.slice";

const orderForm: OrderingDomainModel.Form = {
    organizerId: "1",
    tableId: "1",
    guests: [
        GuestFactory.create({
            id: "1",
            firstName: "",
            lastName: "",
            age: 21,
            meals: {
                entry: null,
                mainCourse: "1",
                dessert: null,
                drink: null
            }
        })
    ]
}

const orderingState: OrderingState = {
    step: OrderingDomainModel.OrderingStep.SUMMARY,
    form: orderForm,
    availableTables: {
        status: "idle",
        error: null,
        data: []
    },
    availableMeals: {
      status: "idle",
      error: null,
      data: []
    },
    reservation: { status: "idle"}
}
describe("Reserve", () => {
    it("Should reserve successfully", async () => {
        const reservationGateway = new MockReservationGateway();
        const store = createTestStore({
            initialState: {
                ordering: orderingState
            },
            dependencies: {
                reservationGateway
            }
        })

        const promise = store.dispatch(reserve())
        expect(store.getState().ordering.reservation.status).toEqual("loading")
        await promise;
        expect(store.getState().ordering.reservation.status).toEqual("success")

        reservationGateway.expectReserveWasCallWith({  
            tableId: "1",
            guests: [
                {
                    id: "1",
                    firstName: "",
                    lastName: "",
                    age: 21,
                    isOrganizer: true,
                    meals: {
                        entry: null,
                        mainCourse: "1",
                        dessert: null,
                        drink: null
                    }
                }
            ]
        })
        expect(store.getState().ordering.step).toEqual(OrderingDomainModel.OrderingStep.RESERVED)
    })
})

