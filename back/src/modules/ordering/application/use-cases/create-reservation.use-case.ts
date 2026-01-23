import { Injectable, Inject } from '@nestjs/common';
import { Reservation } from '../../domain/entities/reservation.entity';
import { Guest } from '../../domain/entities/guest.entity';
import { ReservationStatus } from '../../domain/enums/reservation-status.enum';
import { generateReservationCode } from '../../domain/utils/reservation-code.util';
import type { IReservationRepository } from '../ports/reservation.repository.port';
import { RESERVATION_REPOSITORY } from '../ports/reservation.repository.port';

export interface CreateReservationGuestInput {
  firstName: string;
  lastName: string;
  age: number;
  isOrganizer: boolean;
  entryId?: number;
  entryQuantity?: number;
  mainCourseId?: number;
  mainCourseQuantity?: number;
  dessertId?: number;
  dessertQuantity?: number;
  drinkId?: number;
  drinkQuantity?: number;
}

export interface CreateReservationInput {
  restaurantId: number;
  tableId: number;
  guests: CreateReservationGuestInput[];
  notes?: string;
}

@Injectable()
export class CreateReservationUseCase {
  constructor(
    @Inject(RESERVATION_REPOSITORY)
    private readonly reservationRepository: IReservationRepository,
  ) {}

  async execute(input: CreateReservationInput): Promise<Reservation> {
    const reservation = new Reservation();
    reservation.restaurantId = input.restaurantId;
    reservation.tableId = input.tableId;
    reservation.status = ReservationStatus.PENDING;
    reservation.reservationCode = generateReservationCode();
    reservation.notes = input.notes ?? null;
    reservation.guests = input.guests.map((g) => {
      const guest = new Guest();
      guest.firstName = g.firstName;
      guest.lastName = g.lastName;
      guest.age = g.age;
      guest.isOrganizer = g.isOrganizer;
      guest.meals = {
        entry: g.entryId
          ? { mealId: g.entryId, quantity: g.entryQuantity ?? 1 }
          : null,
        mainCourse: g.mainCourseId
          ? { mealId: g.mainCourseId, quantity: g.mainCourseQuantity ?? 1 }
          : null,
        dessert: g.dessertId
          ? { mealId: g.dessertId, quantity: g.dessertQuantity ?? 1 }
          : null,
        drink: g.drinkId
          ? { mealId: g.drinkId, quantity: g.drinkQuantity ?? 1 }
          : null,
      };
      return guest;
    });

    return this.reservationRepository.save(reservation);
  }
}
