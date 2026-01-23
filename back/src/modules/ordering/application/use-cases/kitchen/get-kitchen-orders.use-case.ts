import { Injectable, Inject } from '@nestjs/common';
import type { IReservationRepository } from '../../ports/reservation.repository.port';
import { RESERVATION_REPOSITORY } from '../../ports/reservation.repository.port';
import { Reservation } from '../../../domain/entities/reservation.entity';
import { ReservationStatus } from '../../../domain/enums/reservation-status.enum';

@Injectable()
export class GetKitchenOrdersUseCase {
  constructor(
    @Inject(RESERVATION_REPOSITORY)
    private readonly reservationRepository: IReservationRepository,
  ) {}

  async execute(restaurantId: number): Promise<Reservation[]> {
    const reservations =
      await this.reservationRepository.findByRestaurantIdAndStatuses(
        restaurantId,
        [ReservationStatus.SEATED, ReservationStatus.IN_PREPARATION],
      );

    // Sort by createdAt ascending (oldest first - FIFO)
    return reservations.sort(
      (a, b) => a.createdAt.getTime() - b.createdAt.getTime(),
    );
  }
}
