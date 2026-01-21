import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { RestaurantOrmEntity } from './restaurant.orm-entity';
import { TableOrmEntity } from './table.orm-entity';
import { GuestOrmEntity } from './guest.orm-entity';

@Entity('reservations')
export class ReservationOrmEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'restaurant_id' })
  restaurantId: number;

  @Column({ name: 'table_id' })
  tableId: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @ManyToOne(() => RestaurantOrmEntity)
  @JoinColumn({ name: 'restaurant_id' })
  restaurant: RestaurantOrmEntity;

  @ManyToOne(() => TableOrmEntity)
  @JoinColumn({ name: 'table_id' })
  table: TableOrmEntity;

  @OneToMany(() => GuestOrmEntity, (guest) => guest.reservation, {
    cascade: true,
  })
  guests: GuestOrmEntity[];
}
