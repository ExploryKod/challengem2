import { Reservation } from '../../../../ordering/domain/entities/reservation.entity';
import { Guest } from '../../../../ordering/domain/entities/guest.entity';
import type {
  IAdminReservationRepository,
  CreateReservationData,
  UpdateReservationData,
  CreateGuestData,
} from '../../ports/admin-reservation.repository.port';

export class InMemoryAdminReservationRepository implements IAdminReservationRepository {
  private reservations: Reservation[] = [];
  private nextId = 1;
  private nextGuestId = 1;

  constructor(initialData: Reservation[] = []) {
    this.reservations = initialData.map((r) => this.cloneReservation(r));
    if (initialData.length > 0) {
      this.nextId = Math.max(...initialData.map((r) => r.id)) + 1;
      const allGuestIds = initialData.flatMap((r) => r.guests.map((g) => g.id));
      if (allGuestIds.length > 0) {
        this.nextGuestId = Math.max(...allGuestIds) + 1;
      }
    }
  }

  private cloneReservation(r: Reservation): Reservation {
    const reservation = new Reservation();
    reservation.id = r.id;
    reservation.restaurantId = r.restaurantId;
    reservation.tableId = r.tableId;
    reservation.createdAt = r.createdAt;
    reservation.guests = r.guests.map((g) => this.cloneGuest(g));
    return reservation;
  }

  private cloneGuest(g: Guest): Guest {
    const guest = new Guest();
    guest.id = g.id;
    guest.reservationId = g.reservationId;
    guest.firstName = g.firstName;
    guest.lastName = g.lastName;
    guest.age = g.age;
    guest.isOrganizer = g.isOrganizer;
    guest.meals = { ...g.meals };
    return guest;
  }

  private createGuestFromData(
    data: CreateGuestData,
    reservationId: number,
  ): Guest {
    const guest = new Guest();
    guest.id = this.nextGuestId++;
    guest.reservationId = reservationId;
    guest.firstName = data.firstName;
    guest.lastName = data.lastName;
    guest.age = data.age;
    guest.isOrganizer = data.isOrganizer;
    guest.meals = {
      entry: data.entryId ? { mealId: data.entryId, quantity: 1 } : null,
      mainCourse: data.mainCourseId
        ? { mealId: data.mainCourseId, quantity: 1 }
        : null,
      dessert: data.dessertId ? { mealId: data.dessertId, quantity: 1 } : null,
      drink: data.drinkId ? { mealId: data.drinkId, quantity: 1 } : null,
    };
    return guest;
  }

  findByRestaurantId(restaurantId: number): Promise<Reservation[]> {
    const found = this.reservations.filter(
      (r) => r.restaurantId === restaurantId,
    );
    return Promise.resolve(found.map((r) => this.cloneReservation(r)));
  }

  findById(id: number): Promise<Reservation | null> {
    const found = this.reservations.find((r) => r.id === id);
    return Promise.resolve(found ? this.cloneReservation(found) : null);
  }

  create(data: CreateReservationData): Promise<Reservation> {
    const reservation = new Reservation();
    reservation.id = this.nextId++;
    reservation.restaurantId = data.restaurantId;
    reservation.tableId = data.tableId;
    reservation.createdAt = new Date();
    reservation.guests = data.guests.map((g) =>
      this.createGuestFromData(g, reservation.id),
    );
    this.reservations.push(reservation);
    return Promise.resolve(this.cloneReservation(reservation));
  }

  update(id: number, data: UpdateReservationData): Promise<Reservation | null> {
    const index = this.reservations.findIndex((r) => r.id === id);
    if (index === -1) return Promise.resolve(null);

    const existing = this.reservations[index];
    if (data.restaurantId !== undefined)
      existing.restaurantId = data.restaurantId;
    if (data.tableId !== undefined) existing.tableId = data.tableId;
    if (data.guests !== undefined) {
      existing.guests = data.guests.map((g) =>
        this.createGuestFromData(g, existing.id),
      );
    }

    return Promise.resolve(this.cloneReservation(existing));
  }

  delete(id: number): Promise<boolean> {
    const index = this.reservations.findIndex((r) => r.id === id);
    if (index === -1) return Promise.resolve(false);
    this.reservations.splice(index, 1);
    return Promise.resolve(true);
  }
}
