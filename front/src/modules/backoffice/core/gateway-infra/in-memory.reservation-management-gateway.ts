import { IReservationManagementGateway } from "../gateway/reservation-management.gateway";
import { BackofficeDomainModel } from "../model/backoffice.domain-model";

export class InMemoryReservationManagementGateway implements IReservationManagementGateway {
    private reservations: BackofficeDomainModel.Reservation[] = [];
    private nextId = 1;

    async getReservations(restaurantId: number): Promise<BackofficeDomainModel.Reservation[]> {
        return this.reservations.filter(r => r.restaurantId === restaurantId);
    }

    async getReservation(id: number): Promise<BackofficeDomainModel.Reservation> {
        const reservation = this.reservations.find(r => r.id === id);
        if (!reservation) throw new Error(`Reservation ${id} not found`);
        return reservation;
    }

    async createReservation(dto: BackofficeDomainModel.CreateReservationDTO): Promise<BackofficeDomainModel.Reservation> {
        const newReservation: BackofficeDomainModel.Reservation = {
            id: this.nextId++,
            ...dto,
            createdAt: new Date().toISOString(),
        };
        this.reservations.push(newReservation);
        return newReservation;
    }

    async updateReservation(id: number, dto: BackofficeDomainModel.UpdateReservationDTO): Promise<BackofficeDomainModel.Reservation> {
        const reservation = this.reservations.find(r => r.id === id);
        if (!reservation) throw new Error(`Reservation ${id} not found`);
        Object.assign(reservation, dto);
        return reservation;
    }

    async deleteReservation(id: number): Promise<void> {
        const index = this.reservations.findIndex(r => r.id === id);
        if (index === -1) throw new Error(`Reservation ${id} not found`);
        this.reservations.splice(index, 1);
    }
}
