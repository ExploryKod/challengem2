import { Guest } from './guest.entity';

export class Reservation {
  id: string;
  restaurantId: string;
  tableId: string;
  guests: Guest[];
  createdAt: Date;
}
