import { ITerminalReservationGateway, UpdateGuestMealsInput } from '../gateway/terminal-reservation.gateway';
import { TerminalDomainModel } from '../model/terminal.domain-model';

export class StubTerminalReservationGateway implements ITerminalReservationGateway {
    private reservations: Map<string, TerminalDomainModel.Reservation> = new Map();
    private updatedStatuses: Array<{ id: number; status: TerminalDomainModel.ReservationStatus }> = [];
    private updatedGuestsMeals: Array<{ id: number; guests: UpdateGuestMealsInput[] }> = [];

    constructor(reservations: TerminalDomainModel.Reservation[] = []) {
        reservations.forEach(r => this.reservations.set(r.code, r));
    }

    async getByCode(code: string): Promise<TerminalDomainModel.Reservation | null> {
        return this.reservations.get(code) ?? null;
    }

    async updateStatus(id: number, status: TerminalDomainModel.ReservationStatus): Promise<void> {
        this.updatedStatuses.push({ id, status });
        // Also update the in-memory reservation
        this.reservations.forEach((reservation, code) => {
            if (reservation.id === id) {
                this.reservations.set(code, { ...reservation, status });
            }
        });
    }

    // Test helper methods
    getUpdatedStatuses(): Array<{ id: number; status: TerminalDomainModel.ReservationStatus }> {
        return this.updatedStatuses;
    }

    expectUpdateStatusCalledWith(id: number, status: TerminalDomainModel.ReservationStatus): void {
        expect(this.updatedStatuses).toContainEqual({ id, status });
    }

    async updateGuestsMeals(id: number, guests: UpdateGuestMealsInput[]): Promise<TerminalDomainModel.Reservation> {
        this.updatedGuestsMeals.push({ id, guests });

        // Find and update the reservation
        let updatedReservation: TerminalDomainModel.Reservation | null = null;
        this.reservations.forEach((reservation, code) => {
            if (reservation.id === id) {
                const newGuests = guests.map((g, index) => ({
                    id: reservation.guests[index]?.id ?? index,
                    firstName: g.firstName,
                    lastName: g.lastName,
                    age: g.age,
                    isOrganizer: g.isOrganizer,
                    meals: {
                        entry: g.entryId ? { mealId: g.entryId.toString(), quantity: 1 } : null,
                        mainCourse: g.mainCourseId ? { mealId: g.mainCourseId.toString(), quantity: 1 } : null,
                        dessert: g.dessertId ? { mealId: g.dessertId.toString(), quantity: 1 } : null,
                        drink: g.drinkId ? { mealId: g.drinkId.toString(), quantity: 1 } : null,
                    },
                }));
                updatedReservation = { ...reservation, guests: newGuests };
                this.reservations.set(code, updatedReservation);
            }
        });

        if (!updatedReservation) {
            throw new Error(`Reservation with id ${id} not found`);
        }

        return updatedReservation;
    }

    getUpdatedGuestsMeals(): Array<{ id: number; guests: UpdateGuestMealsInput[] }> {
        return this.updatedGuestsMeals;
    }
}
