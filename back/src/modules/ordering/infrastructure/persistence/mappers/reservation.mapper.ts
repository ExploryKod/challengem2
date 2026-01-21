import { Reservation } from '../../../domain/entities/reservation.entity';
import { Guest } from '../../../domain/entities/guest.entity';
import { ReservationOrmEntity } from '../orm-entities/reservation.orm-entity';
import { GuestOrmEntity } from '../orm-entities/guest.orm-entity';

export class ReservationMapper {
  static toDomain(ormEntity: ReservationOrmEntity): Reservation {
    const reservation = new Reservation();
    reservation.id = ormEntity.id;
    reservation.restaurantId = ormEntity.restaurantId;
    reservation.tableId = ormEntity.tableId;
    reservation.createdAt = ormEntity.createdAt;
    reservation.guests =
      ormEntity.guests?.map((g) => this.guestToDomain(g)) ?? [];
    return reservation;
  }

  static guestToDomain(ormEntity: GuestOrmEntity): Guest {
    const guest = new Guest();
    guest.id = ormEntity.id;
    guest.reservationId = ormEntity.reservationId;
    guest.firstName = ormEntity.firstName;
    guest.lastName = ormEntity.lastName;
    guest.age = ormEntity.age;
    guest.isOrganizer = ormEntity.isOrganizer;
    guest.meals = {
      entry: ormEntity.entryId,
      mainCourse: ormEntity.mainCourseId,
      dessert: ormEntity.dessertId,
      drink: ormEntity.drinkId,
    };
    return guest;
  }

  static toOrm(domain: Reservation): ReservationOrmEntity {
    const ormEntity = new ReservationOrmEntity();
    if (domain.id) {
      ormEntity.id = domain.id;
    }
    ormEntity.restaurantId = domain.restaurantId;
    ormEntity.tableId = domain.tableId;
    ormEntity.guests =
      domain.guests?.map((g) => this.guestToOrm(g, domain.id)) ?? [];
    return ormEntity;
  }

  static guestToOrm(domain: Guest, reservationId?: string): GuestOrmEntity {
    const ormEntity = new GuestOrmEntity();
    if (domain.id) {
      ormEntity.id = domain.id;
    }
    if (reservationId) {
      ormEntity.reservationId = reservationId;
    }
    ormEntity.firstName = domain.firstName;
    ormEntity.lastName = domain.lastName;
    ormEntity.age = domain.age;
    ormEntity.isOrganizer = domain.isOrganizer;
    ormEntity.entryId = domain.meals?.entry ?? null;
    ormEntity.mainCourseId = domain.meals?.mainCourse ?? null;
    ormEntity.dessertId = domain.meals?.dessert ?? null;
    ormEntity.drinkId = domain.meals?.drink ?? null;
    return ormEntity;
  }
}
