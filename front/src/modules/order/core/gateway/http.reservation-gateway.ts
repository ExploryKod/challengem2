import { IReservationGateway } from "@taotask/modules/order/core/gateway/reservation.gateway";
import { ReserveDTO } from "@taotask/modules/order/core/gateway/reserve.dto";
import { AppState } from "@taotask/modules/store/store";
import { HttpClient } from "@taotask/modules/shared/infrastructure/http-client";

type BackendGuestDto = {
    firstName: string;
    lastName: string;
    age: number;
    isOrganizer: boolean;
    entryId?: string;
    entryQuantity?: number;
    mainCourseId?: string;
    mainCourseQuantity?: number;
    dessertId?: string;
    dessertQuantity?: number;
    drinkId?: string;
    drinkQuantity?: number;
}

type BackendCreateReservationDto = {
    restaurantId: string;
    tableId: string;
    guests: BackendGuestDto[];
}

const mapReserveDtoToBackend = (dto: ReserveDTO, restaurantId: string): BackendCreateReservationDto => {
    return {
        restaurantId,
        tableId: dto.tableId,
        guests: dto.guests.map(guest => ({
            firstName: guest.firstName,
            lastName: guest.lastName,
            age: guest.age,
            isOrganizer: guest.isOrganizer || false,
            entryId: guest.meals.entry?.mealId || undefined,
            entryQuantity: guest.meals.entry?.quantity || undefined,
            mainCourseId: guest.meals.mainCourse?.mealId || undefined,
            mainCourseQuantity: guest.meals.mainCourse?.quantity || undefined,
            dessertId: guest.meals.dessert?.mealId || undefined,
            dessertQuantity: guest.meals.dessert?.quantity || undefined,
            drinkId: guest.meals.drink?.mealId || undefined,
            drinkQuantity: guest.meals.drink?.quantity || undefined
        }))
    }
}

export class HttpReservationGateway implements IReservationGateway {
    constructor(
        private readonly httpClient: HttpClient,
        private readonly getState: () => AppState
    ) {}

    async reserve(data: ReserveDTO): Promise<void> {
        const state = this.getState();
        const restaurantId = state.ordering.restaurantId;
        
        if (!restaurantId) {
            throw new Error('Restaurant ID is required for reservation');
        }

        const backendDto = mapReserveDtoToBackend(data, restaurantId.toString());
        await this.httpClient.post<void>('/reservations', backendDto);
    }
}