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
import { ADMIN_TABLE_REPOSITORY } from './application/ports/admin-table.repository.port';
import { ADMIN_MEAL_REPOSITORY } from './application/ports/admin-meal.repository.port';
import { ADMIN_RESERVATION_REPOSITORY } from './application/ports/admin-reservation.repository.port';

// Repositories
import { AdminRestaurantRepository } from './infrastructure/persistence/repositories/admin-restaurant.repository';
import { AdminTableRepository } from './infrastructure/persistence/repositories/admin-table.repository';
import { AdminMealRepository } from './infrastructure/persistence/repositories/admin-meal.repository';
import { AdminReservationRepository } from './infrastructure/persistence/repositories/admin-reservation.repository';

// Use Cases - Restaurant
import { GetRestaurantsUseCase } from './application/use-cases/restaurant/get-restaurants.use-case';
import { GetRestaurantUseCase } from './application/use-cases/restaurant/get-restaurant.use-case';
import { CreateRestaurantUseCase } from './application/use-cases/restaurant/create-restaurant.use-case';
import { UpdateRestaurantUseCase } from './application/use-cases/restaurant/update-restaurant.use-case';
import { DeleteRestaurantUseCase } from './application/use-cases/restaurant/delete-restaurant.use-case';

// Use Cases - Table
import { GetTablesUseCase } from './application/use-cases/table/get-tables.use-case';
import { GetTableUseCase } from './application/use-cases/table/get-table.use-case';
import { CreateTableUseCase } from './application/use-cases/table/create-table.use-case';
import { UpdateTableUseCase } from './application/use-cases/table/update-table.use-case';
import { DeleteTableUseCase } from './application/use-cases/table/delete-table.use-case';

// Use Cases - Meal
import { GetMealsUseCase } from './application/use-cases/meal/get-meals.use-case';
import { GetMealUseCase } from './application/use-cases/meal/get-meal.use-case';
import { CreateMealUseCase } from './application/use-cases/meal/create-meal.use-case';
import { UpdateMealUseCase } from './application/use-cases/meal/update-meal.use-case';
import { DeleteMealUseCase } from './application/use-cases/meal/delete-meal.use-case';

// Use Cases - Reservation
import { GetReservationsUseCase } from './application/use-cases/reservation/get-reservations.use-case';
import { GetReservationUseCase } from './application/use-cases/reservation/get-reservation.use-case';
import { CreateReservationUseCase } from './application/use-cases/reservation/create-reservation.use-case';
import { UpdateReservationUseCase } from './application/use-cases/reservation/update-reservation.use-case';
import { DeleteReservationUseCase } from './application/use-cases/reservation/delete-reservation.use-case';

// Controllers
import { AdminRestaurantController } from './infrastructure/http/controllers/admin-restaurant.controller';
import { AdminTableController } from './infrastructure/http/controllers/admin-table.controller';
import { AdminMealController } from './infrastructure/http/controllers/admin-meal.controller';
import { AdminReservationController } from './infrastructure/http/controllers/admin-reservation.controller';

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
    AdminRestaurantController,
    AdminTableController,
    AdminMealController,
    AdminReservationController,
  ],
  providers: [
    // Repositories
    {
      provide: ADMIN_RESTAURANT_REPOSITORY,
      useClass: AdminRestaurantRepository,
    },
    {
      provide: ADMIN_TABLE_REPOSITORY,
      useClass: AdminTableRepository,
    },
    {
      provide: ADMIN_MEAL_REPOSITORY,
      useClass: AdminMealRepository,
    },
    {
      provide: ADMIN_RESERVATION_REPOSITORY,
      useClass: AdminReservationRepository,
    },
    // Use Cases - Restaurant
    GetRestaurantsUseCase,
    GetRestaurantUseCase,
    CreateRestaurantUseCase,
    UpdateRestaurantUseCase,
    DeleteRestaurantUseCase,
    // Use Cases - Table
    GetTablesUseCase,
    GetTableUseCase,
    CreateTableUseCase,
    UpdateTableUseCase,
    DeleteTableUseCase,
    // Use Cases - Meal
    GetMealsUseCase,
    GetMealUseCase,
    CreateMealUseCase,
    UpdateMealUseCase,
    DeleteMealUseCase,
    // Use Cases - Reservation
    GetReservationsUseCase,
    GetReservationUseCase,
    CreateReservationUseCase,
    UpdateReservationUseCase,
    DeleteReservationUseCase,
  ],
})
export class AdminModule {}
