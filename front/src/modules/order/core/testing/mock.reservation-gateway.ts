import { IReservationGateway } from "@taotask/modules/order/core/gateway/reservation.gateway";
import {ReserveDTO} from "@taotask/modules/order/core/gateway/reserve.dto";
//  Ceci est un mock avec des méthodes d'assertion à l'intérieur
export class MockReservationGateway implements IReservationGateway {
    private reserveCallData: ReserveDTO | null = null

    async reserve(data: ReserveDTO): Promise<void> {
        this.reserveCallData = data
    }

    // Methode assertion
    expectReserveWasCallWith(data: ReserveDTO) {
        expect(this.reserveCallData).toEqual(data)
    }


}