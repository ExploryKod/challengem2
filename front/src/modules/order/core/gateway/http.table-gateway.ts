import { ITableGateway } from "@taotask/modules/order/core/gateway/table.gateway";
import { OrderingDomainModel } from "@taotask/modules/order/core/model/ordering.domain-model";
import { API_CONFIG } from "@taotask/modules/app/config/api.config";
import { AppState } from "@taotask/modules/store/store";
import { ApiError } from "@taotask/modules/shared/error.utils";

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
        private readonly getState: () => AppState
    ) {}

    async getTables(): Promise<OrderingDomainModel.Table[]> {
        const state = this.getState();
        const restaurantId = state.ordering.restaurantId;
        
        if (!restaurantId) {
            return [];
        }

        const url = `${API_CONFIG.baseUrl}/tables?restaurantId=${restaurantId}`;
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new ApiError(`Failed to fetch tables: ${response.statusText}`, response.status);
        }
        
        const backendTables: BackendTable[] = await response.json();
        return backendTables.map(mapBackendTableToDomain);
    }
}