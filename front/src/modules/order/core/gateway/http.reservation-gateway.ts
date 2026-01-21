import { IReservationGateway } from "@taotask/modules/order/core/gateway/reservation.gateway";
import { ReserveDTO } from "@taotask/modules/order/core/gateway/reserve.dto";
import { API_CONFIG } from "@taotask/modules/app/config/api.config";
import { AppState } from "@taotask/modules/store/store";
import { ApiError } from "@taotask/modules/shared/error.utils";

type BackendGuestDto = {
    firstName: string;
    lastName: string;
    age: number;
    isOrganizer: boolean;
    entryId?: string;
    mainCourseId?: string;
    dessertId?: string;
    drinkId?: string;
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
            entryId: guest.meals.entry || undefined,
            mainCourseId: guest.meals.mainCourse || undefined,
            dessertId: guest.meals.dessert || undefined,
            drinkId: guest.meals.drink || undefined
        }))
    }
}

export class HttpReservationGateway implements IReservationGateway {
    constructor(
        private readonly getState: () => AppState
    ) {}

    async reserve(data: ReserveDTO): Promise<void> {
        const state = this.getState();
        const restaurantId = state.ordering.restaurantId;
        
        if (!restaurantId) {
            throw new Error('Restaurant ID is required for reservation');
        }

        const backendDto = mapReserveDtoToBackend(data, restaurantId.toString());
        const url = `${API_CONFIG.baseUrl}/reservations`;
        
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(backendDto)
        });
        
        if (!response.ok) {
            const errorData = await response.json().catch(() => null);
            throw new ApiError(
                `Failed to create reservation: ${response.statusText}`,
                response.status,
                errorData
            );
        }
    }
}