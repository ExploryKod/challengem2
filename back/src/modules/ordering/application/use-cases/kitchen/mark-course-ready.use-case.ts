import { Injectable, Inject } from '@nestjs/common';
import type { IReservationRepository } from '../../ports/reservation.repository.port';
import { RESERVATION_REPOSITORY } from '../../ports/reservation.repository.port';
import type {
  Reservation,
  CoursesReady,
} from '../../../domain/entities/reservation.entity';
import { ReservationStatus } from '../../../domain/enums/reservation-status.enum';

export type CourseType = 'entry' | 'mainCourse' | 'dessert' | 'drink';

@Injectable()
export class MarkCourseReadyUseCase {
  constructor(
    @Inject(RESERVATION_REPOSITORY)
    private readonly reservationRepository: IReservationRepository,
  ) {}

  async execute(
    reservationId: number,
    course: CourseType,
  ): Promise<Reservation | null> {
    const reservation =
      await this.reservationRepository.findById(reservationId);
    if (!reservation) {
      return null;
    }

    // Mark the course as ready
    const updatedCoursesReady: CoursesReady = {
      ...reservation.coursesReady,
      [course]: true,
    };

    // Determine the new status
    let newStatus = reservation.status;

    if (reservation.status === ReservationStatus.SEATED) {
      // First course being marked ready → IN_PREPARATION
      newStatus = ReservationStatus.IN_PREPARATION;
    }

    // Check if all ordered courses are ready
    if (this.areAllOrderedCoursesReady(reservation, updatedCoursesReady)) {
      newStatus = ReservationStatus.COMPLETED;
    }

    return this.reservationRepository.update(reservationId, {
      coursesReady: updatedCoursesReady,
      status: newStatus,
    });
  }

  private areAllOrderedCoursesReady(
    reservation: Reservation,
    coursesReady: CoursesReady,
  ): boolean {
    // Determine which courses were ordered by checking all guests' meals
    const orderedCourses = {
      entry: false,
      mainCourse: false,
      dessert: false,
      drink: false,
    };

    for (const guest of reservation.guests) {
      if (guest.meals.entry) orderedCourses.entry = true;
      if (guest.meals.mainCourse) orderedCourses.mainCourse = true;
      if (guest.meals.dessert) orderedCourses.dessert = true;
      if (guest.meals.drink) orderedCourses.drink = true;
    }

    // Check if all ordered courses are marked as ready
    for (const courseType of [
      'entry',
      'mainCourse',
      'dessert',
      'drink',
    ] as const) {
      if (orderedCourses[courseType] && !coursesReady[courseType]) {
        return false;
      }
    }

    return true;
  }
}
