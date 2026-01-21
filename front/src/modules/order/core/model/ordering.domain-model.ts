export namespace OrderingDomainModel {
    
    export type Form = {
        guests: Guest[],
        organizerId: string | number | null,
        tableId: string | null
    }
  
    // -- Meals - etapeI/1. On commence par ajouter meals dans les types --
    // -- Meals - etapeII/1. On va ensuite aller dans MealsSection et créer son presenter (au plus proche de l'UI)--

    // Alias pour rendre compréhensible nos string dans dessert: string | null (string est en fait un id)
    export type MealId = string;
    export type RestaurantId = string | number | null;
    // Enumération de tous les plats possible
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
        meals: {
            entry: MealId | null,
            mainCourse: MealId | null,
            dessert: MealId | null,
            drink : MealId | null
        }
        restaurantId: RestaurantId,
        isOrganizer: boolean
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
        MEALS = 2,
        SUMMARY = 3,
        RESERVED = 4
    }

    export type Table = {
        id: string, 
        title: string,
        capacity: number
    }
   
}