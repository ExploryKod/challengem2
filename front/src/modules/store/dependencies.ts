import { IMealGateway } from '@taotask/modules/order/core/gateway/meal.gateway';
import { IIDProvider } from '@taotask/modules/core/id-provider';
import { ITableGateway } from '@taotask/modules/order/core/gateway/table.gateway';
import { IReservationGateway } from "@taotask/modules/order/core/gateway/reservation.gateway";

export type Dependencies = {
    idProvider?: IIDProvider;
    // Nouvelle dépendance ajoutée pour les test de fetch-table.usecase.test.ts
    tableGateway?: ITableGateway;
    mealGateway?: IMealGateway;
    reservationGateway?: IReservationGateway;
};
