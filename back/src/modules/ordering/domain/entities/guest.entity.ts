export interface GuestMeals {
  entry: number | null;
  mainCourse: number | null;
  dessert: number | null;
  drink: number | null;
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
