import { Reservation } from '../../../ordering/domain/entities/reservation.entity';
import { Guest } from '../../../ordering/domain/entities/guest.entity';

export const ADMIN_RESERVATION_REPOSITORY = Symbol(
  'ADMIN_RESERVATION_REPOSITORY',
);

export interface CreateGuestData {
  firstName: string;
  lastName: string;
  age: number;
  isOrganizer: boolean;
  entryId?: number | null;
  mainCourseId?: number | null;
  dessertId?: number | null;
  drinkId?: number | null;
}

export interface CreateReservationData {
  restaurantId: number;
  tableId: number;
  guests: CreateGuestData[];
}

export interface UpdateReservationData {
  restaurantId?: number;
  tableId?: number;
  guests?: CreateGuestData[];
}

export interface IAdminReservationRepository {
  findByRestaurantId(restaurantId: number): Promise<Reservation[]>;
  findById(id: number): Promise<Reservation | null>;
  create(data: CreateReservationData): Promise<Reservation>;
  update(id: number, data: UpdateReservationData): Promise<Reservation | null>;
  delete(id: number): Promise<boolean>;
}
