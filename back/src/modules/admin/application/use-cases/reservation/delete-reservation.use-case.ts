import { Injectable, Inject } from '@nestjs/common';
import type { IAdminReservationRepository } from '../../ports/admin-reservation.repository.port';
import { ADMIN_RESERVATION_REPOSITORY } from '../../ports/admin-reservation.repository.port';

@Injectable()
export class DeleteReservationUseCase {
  constructor(
    @Inject(ADMIN_RESERVATION_REPOSITORY)
    private readonly repository: IAdminReservationRepository,
  ) {}

  async execute(id: number): Promise<boolean> {
    return this.repository.delete(id);
  }
}
