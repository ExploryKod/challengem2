import { IRestaurantManagementGateway } from "../gateway/restaurant.gateway";
import { IMealManagementGateway } from "../gateway/meal-management.gateway";
import { IReservationManagementGateway } from "../gateway/reservation-management.gateway";
import { ITableManagementGateway } from "../gateway/table-management.gateway";
import { HttpRestaurantManagementGateway } from "../gateway/http.restaurant-management-gateway";
import { HttpMealManagementGateway } from "../gateway/http.meal-management-gateway";
import { HttpReservationManagementGateway } from "../gateway/http.reservation-management-gateway";
import { HttpTableManagementGateway } from "../gateway/http.table-management-gateway";
import { InMemoryReservationManagementGateway } from "../gateway-infra/in-memory.reservation-management-gateway";
import { API_CONFIG } from "@taotask/modules/app/config/api.config";
import { HttpClient } from "@taotask/modules/shared/infrastructure/http-client";
import { DemoRestaurantsStore } from "@taotask/modules/shared/demo/demo-restaurants.store";
import { DemoRestaurantManagementGateway } from "../gateway-infra/demo.restaurant-management-gateway";
import { DemoTablesStore } from "@taotask/modules/shared/demo/demo-tables.store";
import { DemoMealsStore } from "@taotask/modules/shared/demo/demo-meals.store";
import { DemoTableManagementGateway } from "../gateway-infra/demo.table-management-gateway";
import { DemoMealManagementGateway } from "../gateway-infra/demo.meal-management-gateway";

export class BackofficeGatewayFactory {
    private static httpClient = new HttpClient();

    static createRestaurantManagementGateway(
        demoStore: DemoRestaurantsStore,
    ): IRestaurantManagementGateway {
        const primary = API_CONFIG.isApiAvailable()
            ? new HttpRestaurantManagementGateway(this.httpClient)
            : null;
        return new DemoRestaurantManagementGateway(primary, demoStore);
    }

    static createMealManagementGateway(
        demoMealsStore: DemoMealsStore,
    ): IMealManagementGateway {
        const primary = API_CONFIG.isApiAvailable()
            ? new HttpMealManagementGateway(this.httpClient)
            : null;
        return new DemoMealManagementGateway(primary, demoMealsStore);
    }

    static createReservationManagementGateway(): IReservationManagementGateway {
        if (API_CONFIG.isApiAvailable()) {
            return new HttpReservationManagementGateway(this.httpClient);
        }
        return new InMemoryReservationManagementGateway();
    }

    static createTableManagementGateway(
        demoTablesStore: DemoTablesStore,
    ): ITableManagementGateway {
        const primary = API_CONFIG.isApiAvailable()
            ? new HttpTableManagementGateway(this.httpClient)
            : null;
        return new DemoTableManagementGateway(primary, demoTablesStore);
    }

}
