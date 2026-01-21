export interface GuestMeals {
  entry: string | null;
  mainCourse: string | null;
  dessert: string | null;
  drink: string | null;
}

export class Guest {
  id: string;
  reservationId: string;
  firstName: string;
  lastName: string;
  age: number;
  isOrganizer: boolean;
  meals: GuestMeals;
}
