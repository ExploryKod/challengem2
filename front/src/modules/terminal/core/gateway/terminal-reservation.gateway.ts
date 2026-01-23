import { TerminalDomainModel } from '../model/terminal.domain-model';

export type UpdateGuestMealsInput = {
    firstName: string;
    lastName: string;
    age: number;
    isOrganizer: boolean;
    entryId?: number;
    mainCourseId?: number;
    dessertId?: number;
    drinkId?: number;
};

export interface ITerminalReservationGateway {
    getByCode(code: string): Promise<TerminalDomainModel.Reservation | null>;
    updateStatus(id: number, status: TerminalDomainModel.ReservationStatus): Promise<void>;
    updateGuestsMeals(id: number, guests: UpdateGuestMealsInput[]): Promise<TerminalDomainModel.Reservation>;
}
