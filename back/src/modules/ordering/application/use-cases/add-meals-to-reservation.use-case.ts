import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { Reservation } from '../../domain/entities/reservation.entity';
import { Guest } from '../../domain/entities/guest.entity';
import type { IReservationRepository } from '../ports/reservation.repository.port';
import { RESERVATION_REPOSITORY } from '../ports/reservation.repository.port';

export interface AddMealsGuestInput {
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

export interface AddMealsToReservationInput {
  guests: AddMealsGuestInput[];
}

@Injectable()
export class AddMealsToReservationUseCase {
  constructor(
    @Inject(RESERVATION_REPOSITORY)
    private readonly reservationRepository: IReservationRepository,
  ) {}

  async execute(
    reservationId: number,
    input: AddMealsToReservationInput,
  ): Promise<Reservation> {
    const reservation =
      await this.reservationRepository.findById(reservationId);

    if (!reservation) {
      throw new NotFoundException(
        `Reservation with id ${reservationId} not found`,
      );
    }

    const newGuests = input.guests.map((g) => {
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

    return this.reservationRepository.addGuests(reservationId, newGuests);
  }
}
