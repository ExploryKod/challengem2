import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SeedService } from './seed.service';
import { RestaurantOrmEntity } from '../modules/ordering/infrastructure/persistence/orm-entities/restaurant.orm-entity';
import { TableOrmEntity } from '../modules/ordering/infrastructure/persistence/orm-entities/table.orm-entity';
import { MealOrmEntity } from '../modules/ordering/infrastructure/persistence/orm-entities/meal.orm-entity';
import { ReservationOrmEntity } from '../modules/ordering/infrastructure/persistence/orm-entities/reservation.orm-entity';
import { GuestOrmEntity } from '../modules/ordering/infrastructure/persistence/orm-entities/guest.orm-entity';
import { MenuOrmEntity } from '../modules/ordering/infrastructure/persistence/orm-entities/menu.orm-entity';
import { MenuItemOrmEntity } from '../modules/ordering/infrastructure/persistence/orm-entities/menu-item.orm-entity';

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
  providers: [SeedService],
  exports: [SeedService],
})
export class SeedModule {}
