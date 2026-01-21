import { Injectable, Inject } from '@nestjs/common';
import { Restaurant } from '../../../../ordering/domain/entities/restaurant.entity';
import type { IAdminRestaurantRepository } from '../../ports/admin-restaurant.repository.port';
import { ADMIN_RESTAURANT_REPOSITORY } from '../../ports/admin-restaurant.repository.port';

export interface CreateRestaurantInput {
  name: string;
  type: string;
  stars: number;
}

@Injectable()
export class CreateRestaurantUseCase {
  constructor(
    @Inject(ADMIN_RESTAURANT_REPOSITORY)
    private readonly repository: IAdminRestaurantRepository,
  ) {}

  async execute(input: CreateRestaurantInput): Promise<Restaurant> {
    return this.repository.create(input);
  }
}
