import { IReservationGateway } from "@taotask/modules/order/core/gateway/reservation.gateway";
import { ReserveDTO } from "@taotask/modules/order/core/gateway/reserve.dto";
import { AppState } from "@taotask/modules/store/store";
import { HttpClient } from "@taotask/modules/shared/infrastructure/http-client";
import { OrderingDomainModel } from "@taotask/modules/order/core/model/ordering.domain-model";

type BackendMealSelection = {
    mealId: string;
    quantity: number;
}

type BackendGuestDto = {
    firstName: string;
    lastName: string;
    age: number;
    isOrganizer: boolean;
    entries: BackendMealSelection[];
    mainCourses: BackendMealSelection[];
    desserts: BackendMealSelection[];
    drinks: BackendMealSelection[];
}

type BackendCreateReservationDto = {
    restaurantId: string;
    tableId: string;
    guests: BackendGuestDto[];
}

const mapSelections = (selections: OrderingDomainModel.MealSelection[]): BackendMealSelection[] => {
    return selections.map(s => ({
        mealId: s.mealId,
        quantity: s.quantity
    }));
};

const mapReserveDtoToBackend = (dto: ReserveDTO, restaurantId: string): BackendCreateReservationDto => {
    return {
        restaurantId,
        tableId: dto.tableId,
        guests: dto.guests.map(guest => ({
            firstName: guest.firstName,
            lastName: guest.lastName,
            age: guest.age,
            isOrganizer: guest.isOrganizer || false,
            entries: mapSelections(guest.meals.entries),
            mainCourses: mapSelections(guest.meals.mainCourses),
            desserts: mapSelections(guest.meals.desserts),
            drinks: mapSelections(guest.meals.drinks)
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
