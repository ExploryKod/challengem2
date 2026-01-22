import { BackofficeDomainModel } from "../model/backoffice.domain-model";

export interface IReservationManagementGateway {
    getReservations(restaurantId: number): Promise<BackofficeDomainModel.Reservation[]>;
    getReservation(id: number): Promise<BackofficeDomainModel.Reservation>;
    createReservation(dto: BackofficeDomainModel.CreateReservationDTO): Promise<BackofficeDomainModel.Reservation>;
    updateReservation(id: number, dto: BackofficeDomainModel.UpdateReservationDTO): Promise<BackofficeDomainModel.Reservation>;
    deleteReservation(id: number): Promise<void>;
}
