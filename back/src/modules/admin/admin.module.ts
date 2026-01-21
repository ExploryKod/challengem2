import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RestaurantOrmEntity } from '../ordering/infrastructure/persistence/orm-entities/restaurant.orm-entity';
import { TableOrmEntity } from '../ordering/infrastructure/persistence/orm-entities/table.orm-entity';
import { MealOrmEntity } from '../ordering/infrastructure/persistence/orm-entities/meal.orm-entity';
import { ReservationOrmEntity } from '../ordering/infrastructure/persistence/orm-entities/reservation.orm-entity';
import { GuestOrmEntity } from '../ordering/infrastructure/persistence/orm-entities/guest.orm-entity';

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
  controllers: [],
  providers: [],
})
export class AdminModule {}
