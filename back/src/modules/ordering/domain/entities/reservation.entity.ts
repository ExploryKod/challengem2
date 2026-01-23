import { Guest } from './guest.entity';
import { ReservationStatus } from '../enums/reservation-status.enum';

export class Reservation {
  id: number;
  restaurantId: number;
  tableId: number;
  guests: Guest[];
  status: ReservationStatus;
  reservationCode: string;
  notes: string | null;
  createdAt: Date;
  updatedAt: Date;
}
