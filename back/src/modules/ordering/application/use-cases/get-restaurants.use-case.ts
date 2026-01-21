import { Injectable, Inject } from '@nestjs/common';
import { Restaurant } from '../../domain/entities/restaurant.entity';
import type { IRestaurantRepository } from '../ports/restaurant.repository.port';
import { RESTAURANT_REPOSITORY } from '../ports/restaurant.repository.port';

@Injectable()
export class GetRestaurantsUseCase {
  constructor(
    @Inject(RESTAURANT_REPOSITORY)
    private readonly restaurantRepository: IRestaurantRepository,
  ) {}

  async execute(): Promise<Restaurant[]> {
    return this.restaurantRepository.findAll();
  }
}
