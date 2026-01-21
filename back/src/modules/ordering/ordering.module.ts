import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// ORM Entities
import { RestaurantOrmEntity } from './infrastructure/persistence/orm-entities/restaurant.orm-entity';
import { TableOrmEntity } from './infrastructure/persistence/orm-entities/table.orm-entity';
import { MealOrmEntity } from './infrastructure/persistence/orm-entities/meal.orm-entity';
import { ReservationOrmEntity } from './infrastructure/persistence/orm-entities/reservation.orm-entity';
import { GuestOrmEntity } from './infrastructure/persistence/orm-entities/guest.orm-entity';

// Repositories
import { RestaurantRepository } from './infrastructure/persistence/repositories/restaurant.repository';
import { TableRepository } from './infrastructure/persistence/repositories/table.repository';
import { MealRepository } from './infrastructure/persistence/repositories/meal.repository';
import { ReservationRepository } from './infrastructure/persistence/repositories/reservation.repository';

// Ports
import { RESTAURANT_REPOSITORY } from './application/ports/restaurant.repository.port';
import { TABLE_REPOSITORY } from './application/ports/table.repository.port';
import { MEAL_REPOSITORY } from './application/ports/meal.repository.port';
import { RESERVATION_REPOSITORY } from './application/ports/reservation.repository.port';

// Use Cases
import { GetRestaurantsUseCase } from './application/use-cases/get-restaurants.use-case';
import { GetTablesUseCase } from './application/use-cases/get-tables.use-case';
import { GetMealsUseCase } from './application/use-cases/get-meals.use-case';
import { CreateReservationUseCase } from './application/use-cases/create-reservation.use-case';

// Controllers
import { RestaurantController } from './infrastructure/http/controllers/restaurant.controller';
import { TableController } from './infrastructure/http/controllers/table.controller';
import { MealController } from './infrastructure/http/controllers/meal.controller';
import { ReservationController } from './infrastructure/http/controllers/reservation.controller';

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
  controllers: [
    RestaurantController,
    TableController,
    MealController,
    ReservationController,
  ],
  providers: [
    // Repositories
    {
      provide: RESTAURANT_REPOSITORY,
      useClass: RestaurantRepository,
    },
    {
      provide: TABLE_REPOSITORY,
      useClass: TableRepository,
    },
    {
      provide: MEAL_REPOSITORY,
      useClass: MealRepository,
    },
    {
      provide: RESERVATION_REPOSITORY,
      useClass: ReservationRepository,
    },
    // Use Cases
    GetRestaurantsUseCase,
    GetTablesUseCase,
    GetMealsUseCase,
    CreateReservationUseCase,
  ],
  exports: [
    RESTAURANT_REPOSITORY,
    TABLE_REPOSITORY,
    MEAL_REPOSITORY,
    RESERVATION_REPOSITORY,
  ],
})
export class OrderingModule {}
