import { Injectable, Inject } from '@nestjs/common';
import { Reservation } from '../../domain/entities/reservation.entity';
import { ReservationStatus } from '../../domain/enums/reservation-status.enum';
import type { IReservationRepository } from '../ports/reservation.repository.port';
import { RESERVATION_REPOSITORY } from '../ports/reservation.repository.port';

export interface UpdateReservationInput {
  tableId?: number;
  status?: ReservationStatus;
  notes?: string | null;
}

@Injectable()
export class UpdateReservationUseCase {
  constructor(
    @Inject(RESERVATION_REPOSITORY)
    private readonly reservationRepository: IReservationRepository,
  ) {}

  async execute(
    id: number,
    input: UpdateReservationInput,
  ): Promise<Reservation | null> {
    const existing = await this.reservationRepository.findById(id);
    if (!existing) {
      return null;
    }

    return this.reservationRepository.update(id, input);
  }
}
