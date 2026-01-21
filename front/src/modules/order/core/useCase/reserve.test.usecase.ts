// On va se faire un mock > dossier testing
import {MockReservationGateway} from "@taotask/modules/order/core/testing/mock.reservationGateway";

describe("Reserve", () => {
    it("Should reserve successfully", () => {
        const reservationGatway = new MockReservationGateway();
    })
})