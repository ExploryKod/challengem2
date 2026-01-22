import { IRestaurantManagementGateway } from "../gateway/restaurant.gateway";
import { IMealManagementGateway } from "../gateway/meal-management.gateway";
import { IReservationManagementGateway } from "../gateway/reservation-management.gateway";
import { ITableManagementGateway } from "../gateway/table-management.gateway";
import { HttpRestaurantManagementGateway } from "../gateway/http.restaurant-management-gateway";
import { HttpMealManagementGateway } from "../gateway/http.meal-management-gateway";
import { HttpReservationManagementGateway } from "../gateway/http.reservation-management-gateway";
import { HttpTableManagementGateway } from "../gateway/http.table-management-gateway";
import { InMemoryRestaurantManagementGateway } from "../gateway-infra/in-memory.restaurant-management-gateway";
import { InMemoryMealManagementGateway } from "../gateway-infra/in-memory.meal-management-gateway";
import { InMemoryReservationManagementGateway } from "../gateway-infra/in-memory.reservation-management-gateway";
import { InMemoryTableManagementGateway } from "../gateway-infra/in-memory.table-management-gateway";
import { API_CONFIG } from "@taotask/modules/app/config/api.config";
import { HttpClient } from "@taotask/modules/shared/infrastructure/http-client";

export class BackofficeGatewayFactory {
    private static httpClient = new HttpClient();

    static createRestaurantManagementGateway(): IRestaurantManagementGateway {
        if (API_CONFIG.isApiAvailable()) {
            return new HttpRestaurantManagementGateway(this.httpClient);
        }
        return new InMemoryRestaurantManagementGateway();
    }

    static createMealManagementGateway(): IMealManagementGateway {
        if (API_CONFIG.isApiAvailable()) {
            return new HttpMealManagementGateway(this.httpClient);
        }
        return new InMemoryMealManagementGateway();
    }

    static createReservationManagementGateway(): IReservationManagementGateway {
        if (API_CONFIG.isApiAvailable()) {
            return new HttpReservationManagementGateway(this.httpClient);
        }
        return new InMemoryReservationManagementGateway();
    }

    static createTableManagementGateway(): ITableManagementGateway {
        if (API_CONFIG.isApiAvailable()) {
            return new HttpTableManagementGateway(this.httpClient);
        }
        return new InMemoryTableManagementGateway();
    }
}
