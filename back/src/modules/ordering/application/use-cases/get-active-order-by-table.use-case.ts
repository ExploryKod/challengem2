import { Injectable, Inject } from '@nestjs/common';
import { Reservation } from '../../domain/entities/reservation.entity';
import { ReservationStatus } from '../../domain/enums/reservation-status.enum';
import type { IReservationRepository } from '../ports/reservation.repository.port';
import { RESERVATION_REPOSITORY } from '../ports/reservation.repository.port';

@Injectable()
export class GetActiveOrderByTableUseCase {
  private static readonly ACTIVE_STATUSES = [
    ReservationStatus.SEATED,
    ReservationStatus.IN_PREPARATION,
  ];

  constructor(
    @Inject(RESERVATION_REPOSITORY)
    private readonly reservationRepository: IReservationRepository,
  ) {}

  async execute(tableId: number): Promise<Reservation | null> {
    return this.reservationRepository.findActiveByTableId(
      tableId,
      GetActiveOrderByTableUseCase.ACTIVE_STATUSES,
    );
  }
}
