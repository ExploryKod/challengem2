import { BackofficeDomainModel } from '@taotask/modules/backoffice/core/model/backoffice.domain-model';
import { DemoRestaurant } from '@taotask/modules/shared/demo/demo-restaurants.store';

export const mapDemoToBackofficeRestaurant = (
  restaurant: DemoRestaurant,
): BackofficeDomainModel.Restaurant => ({
  id: restaurant.id,
  name: restaurant.name,
  type: restaurant.type,
  stars: restaurant.stars,
  tableCount: 0,
  mealCount: 0,
});
