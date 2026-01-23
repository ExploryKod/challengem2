export namespace TerminalDomainModel {
    export enum TerminalStep {
        WELCOME = 0,
        IDENTIFY = 1,
        MENU_BROWSE = 2,
        PRE_ORDER = 3,
        CONFIRMATION = 4,
    }

    export type IdentifyMode = 'reservation' | 'walkin';

    export type TerminalState = {
        step: TerminalStep;
        restaurantId: string | null;
        identifyMode: IdentifyMode | null;
        reservationCode: string | null;
        guestCount: number;
        reservation: Reservation | null;
    };

    export type Reservation = {
        id: number;
        code: string;
        status: string;
        guestCount: number;
    };
}
