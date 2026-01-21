import { Injectable, Inject } from '@nestjs/common';
import { Reservation } from '../../../../ordering/domain/entities/reservation.entity';
import type { IAdminReservationRepository } from '../../ports/admin-reservation.repository.port';
import { ADMIN_RESERVATION_REPOSITORY } from '../../ports/admin-reservation.repository.port';

@Injectable()
export class GetReservationUseCase {
  constructor(
    @Inject(ADMIN_RESERVATION_REPOSITORY)
    private readonly repository: IAdminReservationRepository,
  ) {}

  async execute(id: number): Promise<Reservation | null> {
    return this.repository.findById(id);
  }
}
