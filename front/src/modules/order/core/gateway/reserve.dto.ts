type MealSelection = {
    mealId: string;
    quantity: number;
} | null;

type Guest = {
    id?: string | number,
    firstName: string,
    lastName: string,
    age: number,
    isOrganizer?: boolean,
    meals: {
        entry: MealSelection,
        mainCourse: MealSelection,
        dessert: MealSelection,
        drink: MealSelection
    }
}

export type ReserveDTO = {
    tableId: string,
    guests: Array<Guest>
}