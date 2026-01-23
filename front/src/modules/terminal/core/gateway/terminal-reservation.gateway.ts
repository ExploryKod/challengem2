import { TerminalDomainModel } from '../model/terminal.domain-model';

export interface ITerminalReservationGateway {
    getByCode(code: string): Promise<TerminalDomainModel.Reservation | null>;
    updateStatus(id: number, status: TerminalDomainModel.ReservationStatus): Promise<void>;
}
