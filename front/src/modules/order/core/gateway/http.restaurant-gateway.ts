import { IRestaurantGateway } from "@taotask/modules/order/core/gateway/restaurant.gateway";
import { OrderingDomainModel } from "@taotask/modules/order/core/model/ordering.domain-model";
import { API_CONFIG } from "@taotask/modules/app/config/api.config";
import { ApiError } from "@taotask/modules/shared/error.utils";

type BackendRestaurant = {
    id: number;
    name: string;
    type: string;
    stars: number;
}

const mapBackendRestaurantToDomain = (backendRestaurant: BackendRestaurant): OrderingDomainModel.Restaurant => {
    return {
        id: backendRestaurant.id.toString(),
        restaurantName: backendRestaurant.name,
        restaurantType: backendRestaurant.type,
        stars: backendRestaurant.stars
    }
}

export class HttpRestaurantGateway implements IRestaurantGateway {
    async getRestaurants(): Promise<OrderingDomainModel.Restaurant[]> {
        const url = `${API_CONFIG.baseUrl}/restaurants`;
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new ApiError(`Failed to fetch restaurants: ${response.statusText}`, response.status);
        }
        
        const backendRestaurants: BackendRestaurant[] = await response.json();
        return backendRestaurants.map(mapBackendRestaurantToDomain);
    }
}
