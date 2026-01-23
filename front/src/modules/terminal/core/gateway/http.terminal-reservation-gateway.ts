import { ITerminalReservationGateway } from './terminal-reservation.gateway';
import { TerminalDomainModel } from '../model/terminal.domain-model';
import { HttpClient } from '@taotask/modules/shared/infrastructure/http-client';

type BackendMealSelection = {
    mealId: string;
    quantity: number;
} | null;

type BackendGuest = {
    id: number;
    firstName: string;
    lastName: string;
    age: number;
    isOrganizer: boolean;
    entry: BackendMealSelection;
    mainCourse: BackendMealSelection;
    dessert: BackendMealSelection;
    drink: BackendMealSelection;
};

type BackendReservation = {
    id: number;
    code: string;
    status: string;
    restaurantId: number;
    tableId: number;
    guests: BackendGuest[];
};

const mapBackendToReservation = (backend: BackendReservation): TerminalDomainModel.Reservation => ({
    id: backend.id,
    code: backend.code,
    status: backend.status as TerminalDomainModel.ReservationStatus,
    restaurantId: backend.restaurantId,
    tableId: backend.tableId,
    guests: backend.guests.map(guest => ({
        id: guest.id,
        firstName: guest.firstName,
        lastName: guest.lastName,
        age: guest.age,
        isOrganizer: guest.isOrganizer,
        meals: {
            entry: guest.entry,
            mainCourse: guest.mainCourse,
            dessert: guest.dessert,
            drink: guest.drink,
        },
    })),
});

export class HttpTerminalReservationGateway implements ITerminalReservationGateway {
    constructor(private readonly httpClient: HttpClient) {}

    async getByCode(code: string): Promise<TerminalDomainModel.Reservation | null> {
        try {
            const response = await this.httpClient.get<BackendReservation>(`/reservations/code/${code}`);
            return mapBackendToReservation(response);
        } catch (error: any) {
            if (error?.statusCode === 404) {
                return null;
            }
            throw error;
        }
    }

    async updateStatus(id: number, status: TerminalDomainModel.ReservationStatus): Promise<void> {
        await this.httpClient.request(`/reservations/${id}/status`, {
            method: 'PATCH',
            body: { status },
        });
    }
}
