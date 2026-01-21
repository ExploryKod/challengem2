export namespace OrderingDomainModel {
    
    export type Form = {
        guests: Guest[],
        organizerId: string | number | null,
        tableId: string | null
    }
  
    export type RestaurantId = string | number | null;
    export type MealId = string;

    export enum MealType {
        ENTRY = "ENTRY",
        MAIN_COURSE = "MAIN_COURSE",
        DESSERT = "DESSERT",
        DRINK = "DRINK"
    }

    export type Meal = {
        id: MealId,
        restaurantId: RestaurantId,
        title: string,
        type: MealType,
        price: number,
        requiredAge: number | null,
        imageUrl: string
    }

    export type Guest = {
        id: string | number, 
        firstName: string,
        lastName: string,
        age: number,
        restaurantId: RestaurantId,
        isOrganizer: boolean,
        meals: {
            entry: MealId | null,
            mainCourse: MealId | null,
            dessert: MealId | null,
            drink: MealId | null
        }
    }

    export type RestaurantList = {
        restaurants: Restaurant[],
        restaurantId: RestaurantId 
    }

    export type Restaurant = {
        id: string | number, 
        restaurantName: string,
        restaurantType: string,
        stars: number
    }

    export enum OrderingStep {
        GUESTS = 0,
        TABLE = 1,
        MEALS = 2
    }

    export type Table = {
        id: string, 
        title: string,
        capacity: number
    }
   
}