import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// ORM Entities (shared from ordering)
import { RestaurantOrmEntity } from '../ordering/infrastructure/persistence/orm-entities/restaurant.orm-entity';
import { TableOrmEntity } from '../ordering/infrastructure/persistence/orm-entities/table.orm-entity';
import { MealOrmEntity } from '../ordering/infrastructure/persistence/orm-entities/meal.orm-entity';
import { ReservationOrmEntity } from '../ordering/infrastructure/persistence/orm-entities/reservation.orm-entity';
import { GuestOrmEntity } from '../ordering/infrastructure/persistence/orm-entities/guest.orm-entity';

// Ports
import { ADMIN_RESTAURANT_REPOSITORY } from './application/ports/admin-restaurant.repository.port';

// Repositories
import { AdminRestaurantRepository } from './infrastructure/persistence/repositories/admin-restaurant.repository';

// Use Cases - Restaurant
import { GetRestaurantsUseCase } from './application/use-cases/restaurant/get-restaurants.use-case';
import { GetRestaurantUseCase } from './application/use-cases/restaurant/get-restaurant.use-case';
import { CreateRestaurantUseCase } from './application/use-cases/restaurant/create-restaurant.use-case';
import { UpdateRestaurantUseCase } from './application/use-cases/restaurant/update-restaurant.use-case';
import { DeleteRestaurantUseCase } from './application/use-cases/restaurant/delete-restaurant.use-case';

// Controllers
import { AdminRestaurantController } from './infrastructure/http/controllers/admin-restaurant.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      RestaurantOrmEntity,
      TableOrmEntity,
      MealOrmEntity,
      ReservationOrmEntity,
      GuestOrmEntity,
    ]),
  ],
  controllers: [AdminRestaurantController],
  providers: [
    // Repositories
    {
      provide: ADMIN_RESTAURANT_REPOSITORY,
      useClass: AdminRestaurantRepository,
    },
    // Use Cases - Restaurant
    GetRestaurantsUseCase,
    GetRestaurantUseCase,
    CreateRestaurantUseCase,
    UpdateRestaurantUseCase,
    DeleteRestaurantUseCase,
  ],
})
export class AdminModule {}
