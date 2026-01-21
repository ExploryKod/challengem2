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
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'reservation_id', type: 'uuid' })
  reservationId: string;

  @Column({ name: 'first_name' })
  firstName: string;

  @Column({ name: 'last_name' })
  lastName: string;

  @Column({ type: 'int' })
  age: number;

  @Column({ name: 'is_organizer' })
  isOrganizer: boolean;

  @Column({ name: 'entry_id', type: 'uuid', nullable: true })
  entryId: string | null;

  @Column({ name: 'main_course_id', type: 'uuid', nullable: true })
  mainCourseId: string | null;

  @Column({ name: 'dessert_id', type: 'uuid', nullable: true })
  dessertId: string | null;

  @Column({ name: 'drink_id', type: 'uuid', nullable: true })
  drinkId: string | null;

  @ManyToOne(() => ReservationOrmEntity, (reservation) => reservation.guests)
  @JoinColumn({ name: 'reservation_id' })
  reservation: ReservationOrmEntity;
}
