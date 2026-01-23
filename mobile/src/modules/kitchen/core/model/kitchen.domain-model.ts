export namespace KitchenDomainModel {
  export type CourseType = 'entry' | 'mainCourse' | 'dessert' | 'drink';

  export type CoursesReady = {
    entry: boolean;
    mainCourse: boolean;
    dessert: boolean;
    drink: boolean;
  };

  export type MealCount = {
    count: number;
    items: string[];
  };

  export type OrderMeals = {
    entry: MealCount;
    mainCourse: MealCount;
    dessert: MealCount;
    drink: MealCount;
  };

  export type KitchenOrder = {
    id: number;
    tableId: number;
    tableTitle?: string;
    guestCount: number;
    status: 'SEATED' | 'IN_PREPARATION' | 'COMPLETED';
    createdAt: string;
    meals: OrderMeals;
    coursesReady: CoursesReady;
  };

  export type FilterType = 'all' | CourseType;
}
