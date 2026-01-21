import { Injectable, Inject } from '@nestjs/common';
import { Reservation } from '../../../../ordering/domain/entities/reservation.entity';
import type { IAdminReservationRepository, UpdateReservationData } from '../../ports/admin-reservation.repository.port';
import { ADMIN_RESERVATION_REPOSITORY } from '../../ports/admin-reservation.repository.port';

@Injectable()
export class UpdateReservationUseCase {
  constructor(
    @Inject(ADMIN_RESERVATION_REPOSITORY)
    private readonly repository: IAdminReservationRepository,
  ) {}

  async execute(
    id: number,
    data: UpdateReservationData,
  ): Promise<Reservation | null> {
    return this.repository.update(id, data);
  }
}
