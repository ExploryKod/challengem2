import { MealType } from '../enums/meal-type.enum';

export class MenuItem {
  id: number;
  menuId: number;
  mealType: MealType;
  quantity: number;
}
