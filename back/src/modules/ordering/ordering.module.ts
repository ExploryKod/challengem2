import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// ORM Entities
import { RestaurantOrmEntity } from './infrastructure/persistence/orm-entities/restaurant.orm-entity';
import { TableOrmEntity } from './infrastructure/persistence/orm-entities/table.orm-entity';
import { MealOrmEntity } from './infrastructure/persistence/orm-entities/meal.orm-entity';
import { ReservationOrmEntity } from './infrastructure/persistence/orm-entities/reservation.orm-entity';
import { GuestOrmEntity } from './infrastructure/persistence/orm-entities/guest.orm-entity';
import { MenuOrmEntity } from './infrastructure/persistence/orm-entities/menu.orm-entity';
import { MenuItemOrmEntity } from './infrastructure/persistence/orm-entities/menu-item.orm-entity';

// Repositories
import { RestaurantRepository } from './infrastructure/persistence/repositories/restaurant.repository';
import { TableRepository } from './infrastructure/persistence/repositories/table.repository';
import { MealRepository } from './infrastructure/persistence/repositories/meal.repository';
import { ReservationRepository } from './infrastructure/persistence/repositories/reservation.repository';
import { MenuRepository } from './infrastructure/persistence/repositories/menu.repository';

// Ports
import { RESTAURANT_REPOSITORY } from './application/ports/restaurant.repository.port';
import { TABLE_REPOSITORY } from './application/ports/table.repository.port';
import { MEAL_REPOSITORY } from './application/ports/meal.repository.port';
import { RESERVATION_REPOSITORY } from './application/ports/reservation.repository.port';
import { MENU_REPOSITORY } from './application/ports/menu.repository.port';

// Use Cases
import { GetRestaurantsUseCase } from './application/use-cases/get-restaurants.use-case';
import { GetTablesUseCase } from './application/use-cases/get-tables.use-case';
import { GetMealsUseCase } from './application/use-cases/get-meals.use-case';
import { GetReservationsUseCase } from './application/use-cases/get-reservations.use-case';
import { GetReservationByIdUseCase } from './application/use-cases/get-reservation-by-id.use-case';
import { CreateReservationUseCase } from './application/use-cases/create-reservation.use-case';
import { UpdateReservationUseCase } from './application/use-cases/update-reservation.use-case';
import { GetReservationByCodeUseCase } from './application/use-cases/get-reservation-by-code.use-case';
import { GetMenusUseCase } from './application/use-cases/get-menus.use-case';
import { CreateMenuUseCase } from './application/use-cases/create-menu.use-case';
import { UpdateMenuUseCase } from './application/use-cases/update-menu.use-case';
import { DeleteMenuUseCase } from './application/use-cases/delete-menu.use-case';
import { GetKitchenOrdersUseCase } from './application/use-cases/kitchen/get-kitchen-orders.use-case';
import { GetCompletedOrdersUseCase } from './application/use-cases/kitchen/get-completed-orders.use-case';
import { MarkCourseReadyUseCase } from './application/use-cases/kitchen/mark-course-ready.use-case';

// Controllers
import { RestaurantController } from './infrastructure/http/controllers/restaurant.controller';
import { TableController } from './infrastructure/http/controllers/table.controller';
import { MealController } from './infrastructure/http/controllers/meal.controller';
import { ReservationController } from './infrastructure/http/controllers/reservation.controller';
import { MenuController } from './infrastructure/http/controllers/menu.controller';
import { KitchenController } from './infrastructure/http/controllers/kitchen/kitchen.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      RestaurantOrmEntity,
      TableOrmEntity,
      MealOrmEntity,
      ReservationOrmEntity,
      GuestOrmEntity,
      MenuOrmEntity,
      MenuItemOrmEntity,
    ]),
  ],
  controllers: [
    RestaurantController,
    TableController,
    MealController,
    ReservationController,
    MenuController,
    KitchenController,
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
    {
      provide: MENU_REPOSITORY,
      useClass: MenuRepository,
    },
    // Use Cases
    GetRestaurantsUseCase,
    GetTablesUseCase,
    GetMealsUseCase,
    GetReservationsUseCase,
    GetReservationByIdUseCase,
    CreateReservationUseCase,
    UpdateReservationUseCase,
    GetReservationByCodeUseCase,
    GetMenusUseCase,
    CreateMenuUseCase,
    UpdateMenuUseCase,
    DeleteMenuUseCase,
    GetKitchenOrdersUseCase,
    GetCompletedOrdersUseCase,
    MarkCourseReadyUseCase,
  ],
  exports: [
    RESTAURANT_REPOSITORY,
    TABLE_REPOSITORY,
    MEAL_REPOSITORY,
    RESERVATION_REPOSITORY,
    MENU_REPOSITORY,
  ],
})
export class OrderingModule {}
