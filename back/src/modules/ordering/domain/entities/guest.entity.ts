export interface MealSelection {
  mealId: number;
  quantity: number;
}

export interface GuestMeals {
  entry: MealSelection | null;
  mainCourse: MealSelection | null;
  dessert: MealSelection | null;
  drink: MealSelection | null;
}

export class Guest {
  id: number;
  reservationId: number;
  firstName: string;
  lastName: string;
  age: number;
  isOrganizer: boolean;
  meals: GuestMeals;
}
