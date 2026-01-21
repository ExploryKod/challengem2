import { MealType } from '../enums/meal-type.enum';

export class Meal {
  id: number;
  restaurantId: number;
  title: string;
  type: MealType;
  price: number;
  requiredAge: number | null;
  imageUrl: string;
}
