import { IRestaurantManagementGateway } from '@taotask/modules/backoffice/core/gateway/restaurant.gateway';
import { BackofficeDomainModel } from '@taotask/modules/backoffice/core/model/backoffice.domain-model';
import { DemoRestaurantsStore, isDemoRestaurantId } from '@taotask/modules/shared/demo/demo-restaurants.store';
import { mapDemoToBackofficeRestaurant } from '@taotask/modules/backoffice/core/model/demo-restaurant.mapper';

const mergeRestaurants = (
  demo: BackofficeDomainModel.Restaurant[],
  api: BackofficeDomainModel.Restaurant[],
): BackofficeDomainModel.Restaurant[] => {
  const map = new Map<number, BackofficeDomainModel.Restaurant>();
  demo.forEach((restaurant) => map.set(restaurant.id, restaurant));
  api.forEach((restaurant) => map.set(restaurant.id, restaurant));
  return Array.from(map.values());
};

export class DemoRestaurantManagementGateway implements IRestaurantManagementGateway {
  private lastError: unknown = null;

  constructor(
    private readonly primary: IRestaurantManagementGateway | null,
    private readonly demoStore: DemoRestaurantsStore,
  ) {}

  getLastError(): unknown {
    return this.lastError;
  }

  async getRestaurants(): Promise<BackofficeDomainModel.Restaurant[]> {
    let apiRestaurants: BackofficeDomainModel.Restaurant[] = [];

    if (this.primary) {
      try {
        apiRestaurants = await this.primary.getRestaurants();
        this.lastError = null;
      } catch (error) {
        this.lastError = error;
      }
    } else {
      this.lastError = null;
    }

    const demoRestaurants = this.demoStore.list().map(mapDemoToBackofficeRestaurant);
    return mergeRestaurants(demoRestaurants, apiRestaurants);
  }

  async getRestaurant(id: number): Promise<BackofficeDomainModel.Restaurant> {
    if (isDemoRestaurantId(id)) {
      const restaurant = this.demoStore.getById(id);
      if (!restaurant) {
        throw new Error('Demo restaurant not found');
      }
      return mapDemoToBackofficeRestaurant(restaurant);
    }

    if (!this.primary) {
      throw new Error('Restaurant management gateway not available');
    }

    return this.primary.getRestaurant(id);
  }

  async createRestaurant(
    dto: BackofficeDomainModel.CreateRestaurantDTO,
  ): Promise<BackofficeDomainModel.Restaurant> {
    if (!this.primary) {
      const created = this.demoStore.create(dto);
      return mapDemoToBackofficeRestaurant(created);
    }

    return this.primary.createRestaurant(dto);
  }

  async updateRestaurant(
    id: number,
    dto: Partial<BackofficeDomainModel.CreateRestaurantDTO>,
  ): Promise<BackofficeDomainModel.Restaurant> {
    if (isDemoRestaurantId(id)) {
      const updated = this.demoStore.update(id, dto);
      return mapDemoToBackofficeRestaurant(updated);
    }

    if (!this.primary) {
      throw new Error('Restaurant management gateway not available');
    }

    return this.primary.updateRestaurant(id, dto);
  }

  async deleteRestaurant(id: number): Promise<void> {
    if (isDemoRestaurantId(id)) {
      this.demoStore.delete(id);
      return;
    }

    if (!this.primary) {
      throw new Error('Restaurant management gateway not available');
    }

    await this.primary.deleteRestaurant(id);
  }
}
