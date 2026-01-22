import { ITableGateway } from "@taotask/modules/order/core/gateway/table.gateway";
import { IMealGateway } from "@taotask/modules/order/core/gateway/meal.gateway";
import { IReservationGateway } from "@taotask/modules/order/core/gateway/reservation.gateway";
import { IRestaurantGateway } from "@taotask/modules/order/core/gateway/restaurant.gateway";
import { InMemoryTableGateway } from "@taotask/modules/order/core/gateway-infra/in-memory.table-gateway";
import { InMemoryMealGateway } from "@taotask/modules/order/core/gateway-infra/in-memory.meal-gateway";
import { InMemoryRestaurantGateway } from "@taotask/modules/order/core/gateway-infra/in-memory.restaurant-gateway";
import { HttpTableGateway } from "@taotask/modules/order/core/gateway/http.table-gateway";
import { HttpMealGateway } from "@taotask/modules/order/core/gateway/http.meal-gateway";
import { HttpRestaurantGateway } from "@taotask/modules/order/core/gateway/http.restaurant-gateway";
import { HttpReservationGateway } from "@taotask/modules/order/core/gateway/http.reservation-gateway";
import { API_CONFIG } from "@taotask/modules/app/config/api.config";
import { AppState } from "@taotask/modules/store/store";
import { MockReservationGateway } from "@taotask/modules/order/core/testing/mock.reservation-gateway";
import { HttpClient } from "@taotask/modules/shared/infrastructure/http-client";

export class GatewayFactory {
    private static httpClient = new HttpClient();

    static createTableGateway(getState: () => AppState): ITableGateway {
        if (API_CONFIG.isApiAvailable()) {
            return new HttpTableGateway(this.httpClient, getState);
        }
        return new InMemoryTableGateway();
    }

    static createMealGateway(getState: () => AppState): IMealGateway {
        if (API_CONFIG.isApiAvailable()) {
            return new HttpMealGateway(this.httpClient, getState);
        }
        return new InMemoryMealGateway();
    }

    static createReservationGateway(getState: () => AppState): IReservationGateway {
        if (API_CONFIG.isApiAvailable()) {
            return new HttpReservationGateway(this.httpClient, getState);
        }
        return new MockReservationGateway();
    }

    static createRestaurantGateway(): IRestaurantGateway {
        if (API_CONFIG.isApiAvailable()) {
            return new HttpRestaurantGateway(this.httpClient);
        }
        return new InMemoryRestaurantGateway();
    }
}