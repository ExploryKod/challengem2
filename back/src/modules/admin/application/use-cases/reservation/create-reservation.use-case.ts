import { Injectable, Inject } from '@nestjs/common';
import { Reservation } from '../../../../ordering/domain/entities/reservation.entity';
import type { IAdminReservationRepository, CreateReservationData } from '../../ports/admin-reservation.repository.port';
import { ADMIN_RESERVATION_REPOSITORY } from '../../ports/admin-reservation.repository.port';

@Injectable()
export class CreateReservationUseCase {
  constructor(
    @Inject(ADMIN_RESERVATION_REPOSITORY)
    private readonly repository: IAdminReservationRepository,
  ) {}

  async execute(data: CreateReservationData): Promise<Reservation> {
    return this.repository.create(data);
  }
}
