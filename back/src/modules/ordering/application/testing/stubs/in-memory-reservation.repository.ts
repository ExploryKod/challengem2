import { Reservation } from '../../../domain/entities/reservation.entity';
import type { IReservationRepository } from '../../ports/reservation.repository.port';

export class InMemoryReservationRepository implements IReservationRepository {
  private reservations: Reservation[] = [];

  constructor(initialData: Reservation[] = []) {
    this.reservations = [...initialData];
  }

  save(reservation: Reservation): Promise<Reservation> {
    const saved = { ...reservation };
    if (!saved.id) {
      saved.id = crypto.randomUUID();
    }
    if (!saved.createdAt) {
      saved.createdAt = new Date();
    }
    this.reservations.push(saved);
    return Promise.resolve(saved);
  }

  findById(id: string): Promise<Reservation | null> {
    const found = this.reservations.find((r) => r.id === id) ?? null;
    return Promise.resolve(found);
  }

  getAll(): Reservation[] {
    return [...this.reservations];
  }

  count(): number {
    return this.reservations.length;
  }
}
