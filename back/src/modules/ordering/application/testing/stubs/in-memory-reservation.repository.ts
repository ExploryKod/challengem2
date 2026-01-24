import { Reservation } from '../../../domain/entities/reservation.entity';
import { Guest } from '../../../domain/entities/guest.entity';
import { ReservationStatus } from '../../../domain/enums/reservation-status.enum';
import type { IReservationRepository } from '../../ports/reservation.repository.port';

export class InMemoryReservationRepository implements IReservationRepository {
  private reservations: Reservation[] = [];

  constructor(initialData: Reservation[] = []) {
    this.reservations = [...initialData];
  }

  private nextId = 1;

  save(reservation: Reservation): Promise<Reservation> {
    const saved = { ...reservation };
    if (!saved.id) {
      saved.id = this.nextId++;
    }
    if (!saved.createdAt) {
      saved.createdAt = new Date();
    }
    if (!saved.updatedAt) {
      saved.updatedAt = new Date();
    }
    if (!saved.coursesReady) {
      saved.coursesReady = {
        entry: false,
        mainCourse: false,
        dessert: false,
        drink: false,
      };
    }
    this.reservations.push(saved);
    return Promise.resolve(saved);
  }

  findAll(): Promise<Reservation[]> {
    return Promise.resolve([...this.reservations]);
  }

  findById(id: number): Promise<Reservation | null> {
    const found = this.reservations.find((r) => r.id === id) ?? null;
    return Promise.resolve(found);
  }

  findByCode(code: string): Promise<Reservation | null> {
    const upperCode = code.toUpperCase();
    const found =
      this.reservations.find(
        (r) => r.reservationCode?.toUpperCase() === upperCode,
      ) ?? null;
    return Promise.resolve(found);
  }

  findByRestaurantId(restaurantId: number): Promise<Reservation[]> {
    const found = this.reservations.filter(
      (r) => r.restaurantId === restaurantId,
    );
    return Promise.resolve(found);
  }

  findByRestaurantIdAndStatus(
    restaurantId: number,
    status: ReservationStatus,
  ): Promise<Reservation[]> {
    const found = this.reservations.filter(
      (r) => r.restaurantId === restaurantId && r.status === status,
    );
    return Promise.resolve(found);
  }

  findByRestaurantIdAndStatuses(
    restaurantId: number,
    statuses: ReservationStatus[],
  ): Promise<Reservation[]> {
    const found = this.reservations.filter(
      (r) => r.restaurantId === restaurantId && statuses.includes(r.status),
    );
    return Promise.resolve(found);
  }

  findActiveByTableId(
    tableId: number,
    statuses: ReservationStatus[],
  ): Promise<Reservation | null> {
    const found = this.reservations.find(
      (r) => r.tableId === tableId && statuses.includes(r.status),
    );
    return Promise.resolve(found ?? null);
  }

  addGuests(reservationId: number, guests: Guest[]): Promise<Reservation> {
    const index = this.reservations.findIndex((r) => r.id === reservationId);
    if (index === -1) {
      throw new Error(`Reservation ${reservationId} not found`);
    }
    const reservation = this.reservations[index];
    reservation.guests = [...(reservation.guests || []), ...guests];
    reservation.updatedAt = new Date();
    return Promise.resolve(reservation);
  }

  update(id: number, data: Partial<Reservation>): Promise<Reservation | null> {
    const index = this.reservations.findIndex((r) => r.id === id);
    if (index === -1) {
      return Promise.resolve(null);
    }
    this.reservations[index] = {
      ...this.reservations[index],
      ...data,
      updatedAt: new Date(),
    };
    return Promise.resolve(this.reservations[index]);
  }

  updateStatus(
    id: number,
    status: ReservationStatus,
  ): Promise<Reservation | null> {
    return this.update(id, { status });
  }

  delete(id: number): Promise<void> {
    this.reservations = this.reservations.filter((r) => r.id !== id);
    return Promise.resolve();
  }
}
