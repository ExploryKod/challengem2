import { ITerminalReservationGateway } from '../gateway/terminal-reservation.gateway';
import { TerminalDomainModel } from '../model/terminal.domain-model';

export class StubTerminalReservationGateway implements ITerminalReservationGateway {
    private reservations: Map<string, TerminalDomainModel.Reservation> = new Map();
    private updatedStatuses: Array<{ id: number; status: TerminalDomainModel.ReservationStatus }> = [];

    constructor(reservations: TerminalDomainModel.Reservation[] = []) {
        reservations.forEach(r => this.reservations.set(r.code, r));
    }

    async getByCode(code: string): Promise<TerminalDomainModel.Reservation | null> {
        return this.reservations.get(code) ?? null;
    }

    async updateStatus(id: number, status: TerminalDomainModel.ReservationStatus): Promise<void> {
        this.updatedStatuses.push({ id, status });
        // Also update the in-memory reservation
        this.reservations.forEach((reservation, code) => {
            if (reservation.id === id) {
                this.reservations.set(code, { ...reservation, status });
            }
        });
    }

    // Test helper methods
    getUpdatedStatuses(): Array<{ id: number; status: TerminalDomainModel.ReservationStatus }> {
        return this.updatedStatuses;
    }

    expectUpdateStatusCalledWith(id: number, status: TerminalDomainModel.ReservationStatus): void {
        expect(this.updatedStatuses).toContainEqual({ id, status });
    }
}
