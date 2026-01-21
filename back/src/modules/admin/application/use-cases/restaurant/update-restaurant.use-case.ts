import { Injectable, Inject } from '@nestjs/common';
import { Restaurant } from '../../../../ordering/domain/entities/restaurant.entity';
import type { IAdminRestaurantRepository } from '../../ports/admin-restaurant.repository.port';
import { ADMIN_RESTAURANT_REPOSITORY } from '../../ports/admin-restaurant.repository.port';

export interface UpdateRestaurantInput {
  name?: string;
  type?: string;
  stars?: number;
}

@Injectable()
export class UpdateRestaurantUseCase {
  constructor(
    @Inject(ADMIN_RESTAURANT_REPOSITORY)
    private readonly repository: IAdminRestaurantRepository,
  ) {}

  async execute(id: number, input: UpdateRestaurantInput): Promise<Restaurant | null> {
    return this.repository.update(id, input);
  }
}
