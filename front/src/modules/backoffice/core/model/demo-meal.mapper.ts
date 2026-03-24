import { BackofficeDomainModel } from '@taotask/modules/backoffice/core/model/backoffice.domain-model';
import { DemoMeal } from '@taotask/modules/shared/demo/demo-meals.store';

export const mapDemoToBackofficeMeal = (meal: DemoMeal): BackofficeDomainModel.Meal => ({
  id: meal.id,
  restaurantId: meal.restaurantId,
  title: meal.title,
  type: meal.type,
  price: meal.price,
  requiredAge: meal.requiredAge,
  imageUrl: meal.imageUrl,
});
