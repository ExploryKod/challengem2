import { IMealGateway } from "@taotask/modules/order/core/gateway/meal.gateway";
import { OrderingDomainModel } from "@taotask/modules/order/core/model/ordering.domain-model";
import { API_CONFIG } from "@taotask/modules/app/config/api.config";
import { AppState } from "@taotask/modules/store/store";
import { ApiError } from "@taotask/modules/shared/error.utils";

type BackendMeal = {
    id: string;
    restaurantId: string;
    title: string;
    type: 'ENTRY' | 'MAIN_COURSE' | 'DESSERT' | 'DRINK';
    price: number;
    requiredAge: number | null;
    imageUrl: string;
}

const mapBackendMealToDomain = (backendMeal: BackendMeal): OrderingDomainModel.Meal => {
    return {
        id: backendMeal.id,
        restaurantId: backendMeal.restaurantId,
        title: backendMeal.title,
        type: backendMeal.type as OrderingDomainModel.MealType,
        price: backendMeal.price,
        requiredAge: backendMeal.requiredAge,
        imageUrl: backendMeal.imageUrl
    }
}

export class HttpMealGateway implements IMealGateway {
    constructor(
        private readonly getState: () => AppState
    ) {}

    async getMeals(): Promise<OrderingDomainModel.Meal[]> {
        const state = this.getState();
        const restaurantId = state.ordering.restaurantId;
        
        if (!restaurantId) {
            return [];
        }

        const url = `${API_CONFIG.baseUrl}/meals?restaurantId=${restaurantId}`;
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new ApiError(`Failed to fetch meals: ${response.statusText}`, response.status);
        }
        
        const backendMeals: BackendMeal[] = await response.json();
        return backendMeals.map(mapBackendMealToDomain);
    }
}