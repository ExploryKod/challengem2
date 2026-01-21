import { Injectable, Inject } from '@nestjs/common';
import type { IAdminRestaurantRepository } from '../../ports/admin-restaurant.repository.port';
import { ADMIN_RESTAURANT_REPOSITORY } from '../../ports/admin-restaurant.repository.port';

@Injectable()
export class DeleteRestaurantUseCase {
  constructor(
    @Inject(ADMIN_RESTAURANT_REPOSITORY)
    private readonly repository: IAdminRestaurantRepository,
  ) {}

  async execute(id: number): Promise<boolean> {
    return this.repository.delete(id);
  }
}
