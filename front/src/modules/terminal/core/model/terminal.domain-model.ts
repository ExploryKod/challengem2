export namespace TerminalDomainModel {
    export enum TerminalStep {
        WELCOME = 0,
        IDENTIFY = 1,
        MENU_BROWSE = 2,
        PRE_ORDER = 3,
        CONFIRMATION = 4,
    }

    export type IdentifyMode = 'reservation' | 'walkin';

    export enum ReservationStatus {
        PENDING = 'PENDING',
        CONFIRMED = 'CONFIRMED',
        SEATED = 'SEATED',
        CANCELLED = 'CANCELLED',
    }

    export type MealSelection = {
        mealId: string;
        quantity: number;
    };

    export type GuestMeals = {
        entry: MealSelection | null;
        mainCourse: MealSelection | null;
        dessert: MealSelection | null;
        drink: MealSelection | null;
    };

    export type Guest = {
        id: number;
        firstName: string;
        lastName: string;
        age: number;
        isOrganizer: boolean;
        meals: GuestMeals;
    };

    export type Reservation = {
        id: number;
        code: string;
        status: ReservationStatus;
        restaurantId: number;
        tableId: number;
        guests: Guest[];
    };

    export function hasPreOrders(reservation: Reservation): boolean {
        return reservation.guests.some(guest =>
            guest.meals.entry !== null ||
            guest.meals.mainCourse !== null ||
            guest.meals.dessert !== null ||
            guest.meals.drink !== null
        );
    }

    export type TerminalState = {
        step: TerminalStep;
        restaurantId: string | null;
        identifyMode: IdentifyMode | null;
        reservationCode: string | null;
        guestCount: number;
        reservation: Reservation | null;
    };
}
