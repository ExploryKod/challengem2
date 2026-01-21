import { Reservation } from '../../domain/entities/reservation.entity';

export const RESERVATION_REPOSITORY = Symbol('RESERVATION_REPOSITORY');

export interface IReservationRepository {
  save(reservation: Reservation): Promise<Reservation>;
  findAll(): Promise<Reservation[]>;
  findById(id: number): Promise<Reservation | null>;
}
