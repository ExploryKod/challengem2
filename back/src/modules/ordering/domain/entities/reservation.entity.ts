import { Guest } from './guest.entity';
import { ReservationStatus } from '../enums/reservation-status.enum';

export interface CoursesReady {
  entry: boolean;
  mainCourse: boolean;
  dessert: boolean;
  drink: boolean;
}

export class Reservation {
  id: number;
  restaurantId: number;
  tableId: number;
  guests: Guest[];
  status: ReservationStatus;
  reservationCode: string;
  notes: string | null;
  coursesReady: CoursesReady;
  createdAt: Date;
  updatedAt: Date;
}
