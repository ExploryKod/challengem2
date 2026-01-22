export namespace BackofficeDomainModel {
    // ============ RESTAURANT ============
    export type Restaurant = {
        id: number;
        name: string;
        type: string;
        stars: number;
        tableCount?: number;
    };

    export type CreateRestaurantDTO = {
        name: string;
        type: string;
        stars: number;
    };

    export type RestaurantForm = {
        name: string;
        type: string;
        stars: number;
    };

    // ============ TABLE ============
    export type Table = {
        id: number;
        restaurantId: number;
        title: string;
        capacity: number;
    };

    export type CreateTableDTO = {
        restaurantId: number;
        title: string;
        capacity: number;
    };

    export type UpdateTableDTO = Partial<Omit<CreateTableDTO, 'restaurantId'>>;

    // ============ MEAL ============
    export type MealType = 'ENTRY' | 'MAIN_COURSE' | 'DESSERT' | 'DRINK';

    export type Meal = {
        id: number;
        restaurantId: number;
        title: string;
        type: MealType;
        price: number;
        requiredAge: number | null;
        imageUrl: string;
    };

    export type CreateMealDTO = {
        restaurantId: number;
        title: string;
        type: MealType;
        price: number;
        requiredAge?: number | null;
        imageUrl: string;
    };

    export type UpdateMealDTO = Partial<Omit<CreateMealDTO, 'restaurantId'>>;

    // ============ GUEST ============
    export type Guest = {
        firstName: string;
        lastName: string;
        age: number;
        isOrganizer: boolean;
        entryId?: number;
        mainCourseId?: number;
        dessertId?: number;
        drinkId?: number;
    };

    // ============ RESERVATION ============
    export type Reservation = {
        id: number;
        restaurantId: number;
        tableId: number;
        guests: Guest[];
        createdAt: string;
    };

    export type CreateReservationDTO = {
        restaurantId: number;
        tableId: number;
        guests: Guest[];
    };

    export type UpdateReservationDTO = Partial<Omit<CreateReservationDTO, 'restaurantId'>>;

    // ============ HELPERS ============
    export const MealTypeLabels: Record<MealType, string> = {
        ENTRY: 'Entree',
        MAIN_COURSE: 'Plat',
        DESSERT: 'Dessert',
        DRINK: 'Boisson',
    };
}
