import { ITableGateway } from "@taotask/modules/order/core/gateway/table.gateway";
import { IMealGateway } from "@taotask/modules/order/core/gateway/meal.gateway";
import { IReservationGateway } from "@taotask/modules/order/core/gateway/reservation.gateway";
import { InMemoryTableGateway } from "@taotask/modules/order/core/gateway-infra/in-memory.table-gateway";
import { InMemoryMealGateway } from "@taotask/modules/order/core/gateway-infra/in-memory.meal-gateway";
import { HttpTableGateway } from "@taotask/modules/order/core/gateway/http.table-gateway";
import { HttpMealGateway } from "@taotask/modules/order/core/gateway/http.meal-gateway";
import { HttpReservationGateway } from "@taotask/modules/order/core/gateway/http.reservation-gateway";
import { API_CONFIG } from "@taotask/modules/app/config/api.config";
import { AppState } from "@taotask/modules/store/store";
import { MockReservationGateway } from "@taotask/modules/order/core/testing/mock.reservationGateway";

export class GatewayFactory {
    static createTableGateway(getState: () => AppState): ITableGateway {
        if (API_CONFIG.isApiAvailable()) {
            return new HttpTableGateway(getState);
        }
        return new InMemoryTableGateway();
    }

    static createMealGateway(getState: () => AppState): IMealGateway {
        if (API_CONFIG.isApiAvailable()) {
            return new HttpMealGateway(getState);
        }
        return new InMemoryMealGateway();
    }

    static createReservationGateway(getState: () => AppState): IReservationGateway {
        if (API_CONFIG.isApiAvailable()) {
            return new HttpReservationGateway(getState);
        }
        return new MockReservationGateway();
    }
}