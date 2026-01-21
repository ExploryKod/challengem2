import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SeedService } from './seed.service';
import { RestaurantOrmEntity } from '../modules/ordering/infrastructure/persistence/orm-entities/restaurant.orm-entity';
import { TableOrmEntity } from '../modules/ordering/infrastructure/persistence/orm-entities/table.orm-entity';
import { MealOrmEntity } from '../modules/ordering/infrastructure/persistence/orm-entities/meal.orm-entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      RestaurantOrmEntity,
      TableOrmEntity,
      MealOrmEntity,
    ]),
  ],
  providers: [SeedService],
  exports: [SeedService],
})
export class SeedModule {}
