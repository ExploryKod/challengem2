import { Reservation } from '../../domain/entities/reservation.entity';
import { ReservationStatus } from '../../domain/enums/reservation-status.enum';

export const RESERVATION_REPOSITORY = Symbol('RESERVATION_REPOSITORY');

export interface IReservationRepository {
  save(reservation: Reservation): Promise<Reservation>;
  findAll(): Promise<Reservation[]>;
  findById(id: number): Promise<Reservation | null>;
  findByCode(code: string): Promise<Reservation | null>;
  findByRestaurantId(restaurantId: number): Promise<Reservation[]>;
  findByRestaurantIdAndStatus(restaurantId: number, status: ReservationStatus): Promise<Reservation[]>;
  update(id: number, data: Partial<Reservation>): Promise<Reservation | null>;
  updateStatus(id: number, status: ReservationStatus): Promise<Reservation | null>;
  delete(id: number): Promise<void>;
}
