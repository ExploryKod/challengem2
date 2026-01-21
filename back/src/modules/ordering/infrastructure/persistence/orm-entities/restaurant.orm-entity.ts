import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { TableOrmEntity } from './table.orm-entity';
import { MealOrmEntity } from './meal.orm-entity';

@Entity('restaurants')
export class RestaurantOrmEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  type: string;

  @Column()
  stars: number;

  @OneToMany(() => TableOrmEntity, (table) => table.restaurant)
  tables: TableOrmEntity[];

  @OneToMany(() => MealOrmEntity, (meal) => meal.restaurant)
  meals: MealOrmEntity[];
}
