import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ReservationOrmEntity } from './reservation.orm-entity';

@Entity('guests')
export class GuestOrmEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'reservation_id' })
  reservationId: number;

  @Column({ name: 'first_name' })
  firstName: string;

  @Column({ name: 'last_name' })
  lastName: string;

  @Column({ type: 'int' })
  age: number;

  @Column({ name: 'is_organizer' })
  isOrganizer: boolean;

  @Column({ name: 'entry_id', type: 'int', nullable: true })
  entryId: number | null;

  @Column({ name: 'entry_quantity', type: 'int', nullable: true, default: 1 })
  entryQuantity: number | null;

  @Column({ name: 'main_course_id', type: 'int', nullable: true })
  mainCourseId: number | null;

  @Column({ name: 'main_course_quantity', type: 'int', nullable: true, default: 1 })
  mainCourseQuantity: number | null;

  @Column({ name: 'dessert_id', type: 'int', nullable: true })
  dessertId: number | null;

  @Column({ name: 'dessert_quantity', type: 'int', nullable: true, default: 1 })
  dessertQuantity: number | null;

  @Column({ name: 'drink_id', type: 'int', nullable: true })
  drinkId: number | null;

  @Column({ name: 'drink_quantity', type: 'int', nullable: true, default: 1 })
  drinkQuantity: number | null;

  @ManyToOne(() => ReservationOrmEntity, (reservation) => reservation.guests)
  @JoinColumn({ name: 'reservation_id' })
  reservation: ReservationOrmEntity;
}
