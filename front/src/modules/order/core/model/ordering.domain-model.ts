export namespace OrderingDomainModel {
    
    export type Form = {
        guests: Guest[],
        organizerId: string | number | null
    }
  
    export type RestaurantId = string | number | null;
 
    export type Guest = {
        id: string | number, 
        firstName: string,
        lastName: string,
        age: number,
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
        GUESTS = 0
    }
   
}