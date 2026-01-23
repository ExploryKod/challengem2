import { ReserveDTO } from '@taotask/modules/order/core/gateway/reserve.dto'

export type ReserveResult = {
    code: string;
}

export interface IReservationGateway {
    reserve(data: ReserveDTO): Promise<ReserveResult>
}
