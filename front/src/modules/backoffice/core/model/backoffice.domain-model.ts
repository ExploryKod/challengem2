export namespace BackofficeDomainModel {

     export type Restaurant = {
        id: number;
        name: string;
        type: string;
        stars: number;
    }
   
    export type CreateRestaurantDTO = {
        name: string;
        type: string;
        stars: number;
    }

    export type RestaurantForm = {
        name: string;
        type: string;
        stars: number;
    }
}
