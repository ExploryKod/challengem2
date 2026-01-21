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

// Repositories
import { AdminRestaurantRepository } from './infrastructure/persistence/repositories/admin-restaurant.repository';
import { AdminTableRepository } from './infrastructure/persistence/repositories/admin-table.repository';

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

// Controllers
import { AdminRestaurantController } from './infrastructure/http/controllers/admin-restaurant.controller';
import { AdminTableController } from './infrastructure/http/controllers/admin-table.controller';

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
  controllers: [AdminRestaurantController, AdminTableController],
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
  ],
})
export class AdminModule {}
