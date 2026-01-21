import { MealType } from '../enums/meal-type.enum';

export class Meal {
  id: string;
  restaurantId: string;
  title: string;
  type: MealType;
  price: number;
  requiredAge: number | null;
  imageUrl: string;
}
