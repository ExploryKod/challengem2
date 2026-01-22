import { ITableGateway } from "@taotask/modules/order/core/gateway/table.gateway";
import { OrderingDomainModel } from "@taotask/modules/order/core/model/ordering.domain-model";
import { AppState } from "@taotask/modules/store/store";
import { HttpClient } from "@taotask/modules/shared/infrastructure/http-client";

type BackendTable = {
    id: string;
    restaurantId: string;
    title: string;
    capacity: number;
}

const mapBackendTableToDomain = (backendTable: BackendTable): OrderingDomainModel.Table => {
    return {
        id: backendTable.id,
        title: backendTable.title,
        capacity: backendTable.capacity
    }
}

export class HttpTableGateway implements ITableGateway {
    constructor(
        private readonly httpClient: HttpClient,
        private readonly getState: () => AppState
    ) {}

    async getTables(): Promise<OrderingDomainModel.Table[]> {
        const state = this.getState();
        const restaurantId = state.ordering.restaurantId;
        
        if (!restaurantId) {
            return [];
        }

        const backendTables = await this.httpClient.get<BackendTable[]>(`/tables?restaurantId=${restaurantId}`);
        return backendTables.map(mapBackendTableToDomain);
    }
}