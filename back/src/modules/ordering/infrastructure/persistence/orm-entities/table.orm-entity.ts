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
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'restaurant_id' })
  restaurantId: string;

  @Column()
  title: string;

  @Column()
  capacity: number;

  @ManyToOne(() => RestaurantOrmEntity, (restaurant) => restaurant.tables)
  @JoinColumn({ name: 'restaurant_id' })
  restaurant: RestaurantOrmEntity;
}
