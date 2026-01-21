import { Guest } from './guest.entity';

export class Reservation {
  id: number;
  restaurantId: number;
  tableId: number;
  guests: Guest[];
  createdAt: Date;
}
