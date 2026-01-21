import { Injectable, Inject } from '@nestjs/common';
import { Reservation } from '../../domain/entities/reservation.entity';
import type { IReservationRepository } from '../ports/reservation.repository.port';
import { RESERVATION_REPOSITORY } from '../ports/reservation.repository.port';

@Injectable()
export class GetReservationsUseCase {
  constructor(
    @Inject(RESERVATION_REPOSITORY)
    private readonly reservationRepository: IReservationRepository,
  ) {}

  async execute(): Promise<Reservation[]> {
    return this.reservationRepository.findAll();
  }
}
