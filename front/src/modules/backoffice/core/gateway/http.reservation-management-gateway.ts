import { IReservationManagementGateway } from "./reservation-management.gateway";
import { BackofficeDomainModel } from "../model/backoffice.domain-model";
import { HttpClient } from "@taotask/modules/shared/infrastructure/http-client";

export class HttpReservationManagementGateway implements IReservationManagementGateway {
    constructor(private readonly httpClient: HttpClient) {}

    async getReservations(restaurantId: number): Promise<BackofficeDomainModel.Reservation[]> {
        return this.httpClient.get<BackofficeDomainModel.Reservation[]>(`/admin/reservations?restaurantId=${restaurantId}`);
    }

    async getReservation(id: number): Promise<BackofficeDomainModel.Reservation> {
        return this.httpClient.get<BackofficeDomainModel.Reservation>(`/admin/reservations/${id}`);
    }

    async createReservation(dto: BackofficeDomainModel.CreateReservationDTO): Promise<BackofficeDomainModel.Reservation> {
        return this.httpClient.post<BackofficeDomainModel.Reservation>('/admin/reservations', dto);
    }

    async updateReservation(id: number, dto: BackofficeDomainModel.UpdateReservationDTO): Promise<BackofficeDomainModel.Reservation> {
        return this.httpClient.put<BackofficeDomainModel.Reservation>(`/admin/reservations/${id}`, dto);
    }

    async deleteReservation(id: number): Promise<void> {
        return this.httpClient.delete(`/admin/reservations/${id}`);
    }
}
