import { Injectable, Inject } from '@nestjs/common';
import { Reservation } from '../../domain/entities/reservation.entity';
import { Guest } from '../../domain/entities/guest.entity';
import type { IReservationRepository } from '../ports/reservation.repository.port';
import { RESERVATION_REPOSITORY } from '../ports/reservation.repository.port';

export interface CreateReservationGuestInput {
  firstName: string;
  lastName: string;
  age: number;
  isOrganizer: boolean;
  entryId?: number;
  mainCourseId?: number;
  dessertId?: number;
  drinkId?: number;
}

export interface CreateReservationInput {
  restaurantId: number;
  tableId: number;
  guests: CreateReservationGuestInput[];
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
    reservation.guests = input.guests.map((g) => {
      const guest = new Guest();
      guest.firstName = g.firstName;
      guest.lastName = g.lastName;
      guest.age = g.age;
      guest.isOrganizer = g.isOrganizer;
      guest.meals = {
        entry: g.entryId ?? null,
        mainCourse: g.mainCourseId ?? null,
        dessert: g.dessertId ?? null,
        drink: g.drinkId ?? null,
      };
      return guest;
    });

    return this.reservationRepository.save(reservation);
  }
}
