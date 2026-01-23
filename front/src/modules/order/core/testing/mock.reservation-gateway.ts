import { IReservationGateway, ReserveResult } from "@taotask/modules/order/core/gateway/reservation.gateway";
import { ReserveDTO } from "@taotask/modules/order/core/gateway/reserve.dto";

// Mock gateway with assertion methods for testing
export class MockReservationGateway implements IReservationGateway {
    private reserveCallData: ReserveDTO | null = null;
    private nextCode: string = 'TEST123';

    async reserve(data: ReserveDTO): Promise<ReserveResult> {
        this.reserveCallData = data;
        return { code: this.nextCode };
    }

    // Test helper to set the code that will be returned
    setNextCode(code: string): void {
        this.nextCode = code;
    }

    // Assertion method
    expectReserveWasCallWith(data: ReserveDTO): void {
        expect(this.reserveCallData).toEqual(data);
    }
}