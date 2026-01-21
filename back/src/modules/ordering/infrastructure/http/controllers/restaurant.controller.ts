import { Controller, Get } from '@nestjs/common';
import { GetRestaurantsUseCase } from '../../../application/use-cases/get-restaurants.use-case';
import { Restaurant } from '../../../domain/entities/restaurant.entity';

@Controller('restaurants')
export class RestaurantController {
  constructor(private readonly getRestaurantsUseCase: GetRestaurantsUseCase) {}

  @Get()
  async findAll(): Promise<Restaurant[]> {
    return this.getRestaurantsUseCase.execute();
  }
}
