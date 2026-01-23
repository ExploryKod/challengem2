import { Injectable, Inject } from '@nestjs/common';
import { Reservation } from '../../domain/entities/reservation.entity';
import type { IReservationRepository } from '../ports/reservation.repository.port';
import { RESERVATION_REPOSITORY } from '../ports/reservation.repository.port';

@Injectable()
export class GetReservationByCodeUseCase {
  constructor(
    @Inject(RESERVATION_REPOSITORY)
    private readonly reservationRepository: IReservationRepository,
  ) {}

  async execute(code: string): Promise<Reservation | null> {
    return this.reservationRepository.findByCode(code.toUpperCase());
  }
}
