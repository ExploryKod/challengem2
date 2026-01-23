import { Injectable, Inject } from '@nestjs/common';
import type { IReservationRepository } from '../../ports/reservation.repository.port';
import { RESERVATION_REPOSITORY } from '../../ports/reservation.repository.port';
import { Reservation } from '../../../domain/entities/reservation.entity';
import { ReservationStatus } from '../../../domain/enums/reservation-status.enum';

@Injectable()
export class GetCompletedOrdersUseCase {
  constructor(
    @Inject(RESERVATION_REPOSITORY)
    private readonly reservationRepository: IReservationRepository,
  ) {}

  async execute(restaurantId: number, limit = 20): Promise<Reservation[]> {
    const reservations =
      await this.reservationRepository.findByRestaurantIdAndStatuses(
        restaurantId,
        [ReservationStatus.COMPLETED],
      );

    // Sort by createdAt descending (most recent first) and limit
    return reservations
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, limit);
  }
}
