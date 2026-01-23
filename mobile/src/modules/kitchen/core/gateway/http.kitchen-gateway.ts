import { IKitchenGateway } from './kitchen.gateway';
import { KitchenDomainModel } from '../model/kitchen.domain-model';

export class HttpKitchenGateway implements IKitchenGateway {
  constructor(private readonly baseUrl: string) {}

  async getOrders(
    restaurantId: number,
  ): Promise<KitchenDomainModel.KitchenOrder[]> {
    const response = await fetch(
      `${this.baseUrl}/kitchen/orders?restaurantId=${restaurantId}`,
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch kitchen orders: ${response.status}`);
    }

    return response.json();
  }

  async getCompletedOrders(
    restaurantId: number,
    limit = 20,
  ): Promise<KitchenDomainModel.KitchenOrder[]> {
    const response = await fetch(
      `${this.baseUrl}/kitchen/orders/completed?restaurantId=${restaurantId}&limit=${limit}`,
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch completed orders: ${response.status}`);
    }

    return response.json();
  }

  async markCourseReady(
    reservationId: number,
    course: KitchenDomainModel.CourseType,
  ): Promise<KitchenDomainModel.KitchenOrder> {
    const response = await fetch(
      `${this.baseUrl}/kitchen/orders/${reservationId}/course-ready`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ course }),
      },
    );

    if (!response.ok) {
      throw new Error(`Failed to mark course ready: ${response.status}`);
    }

    return response.json();
  }
}
