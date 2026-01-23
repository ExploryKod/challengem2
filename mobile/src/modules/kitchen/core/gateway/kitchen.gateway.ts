import { KitchenDomainModel } from '../model/kitchen.domain-model';

export interface IKitchenGateway {
  getOrders(restaurantId: number): Promise<KitchenDomainModel.KitchenOrder[]>;
  markCourseReady(
    reservationId: number,
    course: KitchenDomainModel.CourseType,
  ): Promise<KitchenDomainModel.KitchenOrder>;
}
