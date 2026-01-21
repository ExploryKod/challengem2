import { Injectable, Inject } from '@nestjs/common';
import { Restaurant } from '../../../../ordering/domain/entities/restaurant.entity';
import type { IAdminRestaurantRepository } from '../../ports/admin-restaurant.repository.port';
import { ADMIN_RESTAURANT_REPOSITORY } from '../../ports/admin-restaurant.repository.port';

@Injectable()
export class GetRestaurantsUseCase {
  constructor(
    @Inject(ADMIN_RESTAURANT_REPOSITORY)
    private readonly repository: IAdminRestaurantRepository,
  ) {}

  async execute(): Promise<Restaurant[]> {
    return this.repository.findAll();
  }
}
