import { IMealGateway } from '@taotask/modules/order/core/gateway/meal.gateway';
import { IIDProvider } from '@taotask/modules/core/id-provider';
import { ITableGateway } from '@taotask/modules/order/core/gateway/table.gateway';
import { IReservationGateway } from "@taotask/modules/order/core/gateway/reservation.gateway";
import { IRestaurantGateway } from "@taotask/modules/order/core/gateway/restaurant.gateway";
import { IParcoursGateway } from "@taotask/modules/welcome/core/gateway/parcours.gateway";
import { IRestaurantManagementGateway } from "@taotask/modules/backoffice/core/gateway/restaurant.gateway";

export type Dependencies = {
    idProvider?: IIDProvider;
    parcoursGateway?: IParcoursGateway;
    tableGateway?: ITableGateway;
    mealGateway?: IMealGateway;
    reservationGateway?: IReservationGateway;
    restaurantGateway?: IRestaurantGateway;
    restaurantManagementGateway?: IRestaurantManagementGateway;
};

