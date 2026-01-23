import { IMealGateway } from '@taotask/modules/order/core/gateway/meal.gateway';
import { IMenuGateway } from '@taotask/modules/order/core/gateway/menu.gateway';
import { IIDProvider } from '@taotask/modules/core/id-provider';
import { ITableGateway } from '@taotask/modules/order/core/gateway/table.gateway';
import { IReservationGateway } from "@taotask/modules/order/core/gateway/reservation.gateway";
import { IRestaurantGateway } from "@taotask/modules/order/core/gateway/restaurant.gateway";
import { IRestaurantManagementGateway } from "@taotask/modules/backoffice/core/gateway/restaurant.gateway";
import { ITableManagementGateway } from "@taotask/modules/backoffice/core/gateway/table-management.gateway";
import { IMealManagementGateway } from "@taotask/modules/backoffice/core/gateway/meal-management.gateway";
import { IReservationManagementGateway } from "@taotask/modules/backoffice/core/gateway/reservation-management.gateway";

export type Dependencies = {
    idProvider?: IIDProvider;
    tableGateway?: ITableGateway;
    mealGateway?: IMealGateway;
    menuGateway?: IMenuGateway;
    reservationGateway?: IReservationGateway;
    restaurantGateway?: IRestaurantGateway;
    restaurantManagementGateway?: IRestaurantManagementGateway;
    tableManagementGateway?: ITableManagementGateway;
    mealManagementGateway?: IMealManagementGateway;
    reservationManagementGateway?: IReservationManagementGateway;
};
