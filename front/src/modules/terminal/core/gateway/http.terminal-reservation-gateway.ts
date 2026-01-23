import { ITerminalReservationGateway, UpdateGuestMealsInput } from './terminal-reservation.gateway';
import { TerminalDomainModel } from '../model/terminal.domain-model';
import { HttpClient } from '@taotask/modules/shared/infrastructure/http-client';

type BackendMealSelection = {
    mealId: number;
    quantity: number;
} | null;

type BackendGuestMeals = {
    entry: BackendMealSelection;
    mainCourse: BackendMealSelection;
    dessert: BackendMealSelection;
    drink: BackendMealSelection;
};

type BackendGuest = {
    id: number;
    firstName: string;
    lastName: string;
    age: number;
    isOrganizer: boolean;
    meals: BackendGuestMeals;
};

type BackendReservation = {
    id: number;
    reservationCode: string;
    status: string;
    restaurantId: number;
    tableId: number;
    guests: BackendGuest[];
};

type HttpError = {
    statusCode?: number;
};

const mapMealSelection = (selection: BackendMealSelection): TerminalDomainModel.MealSelection | null => {
    if (!selection) return null;
    return {
        mealId: selection.mealId.toString(),
        quantity: selection.quantity,
    };
};

const mapBackendToReservation = (backend: BackendReservation): TerminalDomainModel.Reservation => ({
    id: backend.id,
    code: backend.reservationCode,
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
            entry: mapMealSelection(guest.meals.entry),
            mainCourse: mapMealSelection(guest.meals.mainCourse),
            dessert: mapMealSelection(guest.meals.dessert),
            drink: mapMealSelection(guest.meals.drink),
        },
    })),
});

const isHttpError = (error: unknown): error is HttpError => {
    return typeof error === 'object' && error !== null && 'statusCode' in error;
};

export class HttpTerminalReservationGateway implements ITerminalReservationGateway {
    constructor(private readonly httpClient: HttpClient) {}

    async getByCode(code: string): Promise<TerminalDomainModel.Reservation | null> {
        try {
            const response = await this.httpClient.get<BackendReservation>(`/reservations/code/${code}`);
            return mapBackendToReservation(response);
        } catch (error: unknown) {
            if (isHttpError(error) && error.statusCode === 404) {
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

    async updateGuestsMeals(id: number, guests: UpdateGuestMealsInput[]): Promise<TerminalDomainModel.Reservation> {
        const response = await this.httpClient.request<BackendReservation>(`/admin/reservations/${id}`, {
            method: 'PUT',
            body: { guests },
        });
        return mapBackendToReservation(response);
    }
}
