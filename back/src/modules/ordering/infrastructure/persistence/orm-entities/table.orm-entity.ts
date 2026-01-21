import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { RestaurantOrmEntity } from './restaurant.orm-entity';

@Entity('tables')
export class TableOrmEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'restaurant_id' })
  restaurantId: number;

  @Column()
  title: string;

  @Column()
  capacity: number;

  @ManyToOne(() => RestaurantOrmEntity, (restaurant) => restaurant.tables)
  @JoinColumn({ name: 'restaurant_id' })
  restaurant: RestaurantOrmEntity;
}
