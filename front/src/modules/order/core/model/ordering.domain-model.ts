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

    export type MealSelection = {
        mealId: MealId;
        quantity: number;
    }
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

    export type MenuItem = {
        mealType: MealType;
        quantity: number;
    }

    export type Menu = {
        id: string;
        restaurantId: RestaurantId;
        title: string;
        description: string;
        price: number;
        imageUrl: string;
        items: MenuItem[];
    }

    export type Guest = {
        id: string | number,
        firstName: string,
        lastName: string,
        age: number,
        meals: {
            entry: MealSelection | null,
            mainCourse: MealSelection | null,
            dessert: MealSelection | null,
            drink : MealSelection | null
        }
        restaurantId: RestaurantId,
        isOrganizer: boolean,
        menuId: string | null  // null means à la carte
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
        RESTAURANT = 0,
        MEALS_PREVIEW = 1,
        TABLE = 2,
        GUESTS = 3,
        MEALS = 4,
        SUMMARY = 5,
        RESERVED = 6
    }

    export type Table = {
        id: string, 
        title: string,
        capacity: number
    }
   
}