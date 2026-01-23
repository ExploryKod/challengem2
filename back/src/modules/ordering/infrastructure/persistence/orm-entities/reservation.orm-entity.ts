import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { RestaurantOrmEntity } from './restaurant.orm-entity';
import { TableOrmEntity } from './table.orm-entity';
import { GuestOrmEntity } from './guest.orm-entity';
import { ReservationStatus } from '../../../domain/enums/reservation-status.enum';

@Entity('reservations')
export class ReservationOrmEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'restaurant_id' })
  restaurantId: number;

  @Column({ name: 'table_id' })
  tableId: number;

  @Column({
    type: 'enum',
    enum: ReservationStatus,
    default: ReservationStatus.PENDING,
  })
  status: ReservationStatus;

  @Column({ name: 'reservation_code', length: 8 })
  reservationCode: string;

  @Column({ type: 'text', nullable: true })
  notes: string | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

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
