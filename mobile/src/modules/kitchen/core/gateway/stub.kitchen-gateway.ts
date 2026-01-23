import { IKitchenGateway } from './kitchen.gateway';
import { KitchenDomainModel } from '../model/kitchen.domain-model';

export class StubKitchenGateway implements IKitchenGateway {
  private completedOrders: KitchenDomainModel.KitchenOrder[] = [];
  private orders: KitchenDomainModel.KitchenOrder[] = [
    {
      id: 1,
      tableId: 5,
      tableTitle: 'Table 5',
      guestCount: 3,
      status: 'SEATED',
      createdAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
      meals: {
        entry: { count: 2, items: ['Salade César', 'Soupe du jour'] },
        mainCourse: { count: 3, items: ['Entrecôte x2', 'Saumon'] },
        dessert: { count: 2, items: ['Tiramisu', 'Fondant chocolat'] },
        drink: { count: 0, items: [] },
      },
      coursesReady: {
        entry: false,
        mainCourse: false,
        dessert: false,
        drink: false,
      },
    },
    {
      id: 2,
      tableId: 2,
      tableTitle: 'Table 2',
      guestCount: 2,
      status: 'IN_PREPARATION',
      createdAt: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
      meals: {
        entry: { count: 2, items: ['Carpaccio', 'Bruschetta'] },
        mainCourse: { count: 2, items: ['Risotto', 'Filet mignon'] },
        dessert: { count: 0, items: [] },
        drink: { count: 2, items: ['Vin rouge x2'] },
      },
      coursesReady: {
        entry: true,
        mainCourse: false,
        dessert: false,
        drink: true,
      },
    },
    {
      id: 3,
      tableId: 8,
      tableTitle: 'Table 8',
      guestCount: 4,
      status: 'SEATED',
      createdAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
      meals: {
        entry: { count: 0, items: [] },
        mainCourse: { count: 4, items: ['Burger x2', 'Pizza x2'] },
        dessert: { count: 4, items: ['Glace x4'] },
        drink: { count: 4, items: ['Coca x2', 'Eau x2'] },
      },
      coursesReady: {
        entry: false,
        mainCourse: false,
        dessert: false,
        drink: false,
      },
    },
  ];

  async getOrders(): Promise<KitchenDomainModel.KitchenOrder[]> {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 300));
    return [...this.orders].sort(
      (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
    );
  }

  async getCompletedOrders(
    _restaurantId: number,
    limit = 20,
  ): Promise<KitchenDomainModel.KitchenOrder[]> {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return [...this.completedOrders].slice(0, limit);
  }

  async markCourseReady(
    reservationId: number,
    course: KitchenDomainModel.CourseType,
  ): Promise<KitchenDomainModel.KitchenOrder> {
    await new Promise((resolve) => setTimeout(resolve, 200));

    const orderIndex = this.orders.findIndex((o) => o.id === reservationId);
    if (orderIndex === -1) {
      throw new Error(`Order ${reservationId} not found`);
    }

    const order = this.orders[orderIndex];
    order.coursesReady[course] = true;

    // Check if all ordered courses are ready
    const hasEntry = order.meals.entry.count > 0;
    const hasMain = order.meals.mainCourse.count > 0;
    const hasDessert = order.meals.dessert.count > 0;
    const hasDrink = order.meals.drink.count > 0;

    const allReady =
      (!hasEntry || order.coursesReady.entry) &&
      (!hasMain || order.coursesReady.mainCourse) &&
      (!hasDessert || order.coursesReady.dessert) &&
      (!hasDrink || order.coursesReady.drink);

    if (allReady) {
      // Move to completed list
      order.status = 'COMPLETED';
      this.completedOrders.unshift(order);
      this.orders.splice(orderIndex, 1);
    } else if (order.status === 'SEATED') {
      order.status = 'IN_PREPARATION';
    }

    return order;
  }
}
