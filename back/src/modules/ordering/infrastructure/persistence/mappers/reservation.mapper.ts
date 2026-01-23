import { Reservation } from '../../../domain/entities/reservation.entity';
import { Guest } from '../../../domain/entities/guest.entity';
import { ReservationOrmEntity } from '../orm-entities/reservation.orm-entity';
import { GuestOrmEntity } from '../orm-entities/guest.orm-entity';
import { ReservationStatus } from '../../../domain/enums/reservation-status.enum';

export class ReservationMapper {
  static toDomain(ormEntity: ReservationOrmEntity): Reservation {
    const reservation = new Reservation();
    reservation.id = ormEntity.id;
    reservation.restaurantId = ormEntity.restaurantId;
    reservation.tableId = ormEntity.tableId;
    reservation.status = ormEntity.status;
    reservation.reservationCode = ormEntity.reservationCode;
    reservation.notes = ormEntity.notes;
    reservation.coursesReady = ormEntity.coursesReady ?? {
      entry: false,
      mainCourse: false,
      dessert: false,
      drink: false,
    };
    reservation.createdAt = ormEntity.createdAt;
    reservation.updatedAt = ormEntity.updatedAt;
    reservation.guests =
      ormEntity.guests?.map((g) => ReservationMapper.guestToDomain(g)) ?? [];
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
      entry: ormEntity.entryId
        ? { mealId: ormEntity.entryId, quantity: ormEntity.entryQuantity ?? 1 }
        : null,
      mainCourse: ormEntity.mainCourseId
        ? { mealId: ormEntity.mainCourseId, quantity: ormEntity.mainCourseQuantity ?? 1 }
        : null,
      dessert: ormEntity.dessertId
        ? { mealId: ormEntity.dessertId, quantity: ormEntity.dessertQuantity ?? 1 }
        : null,
      drink: ormEntity.drinkId
        ? { mealId: ormEntity.drinkId, quantity: ormEntity.drinkQuantity ?? 1 }
        : null,
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
    ormEntity.status = domain.status ?? ReservationStatus.PENDING;
    ormEntity.reservationCode = domain.reservationCode;
    ormEntity.notes = domain.notes ?? null;
    ormEntity.coursesReady = domain.coursesReady ?? {
      entry: false,
      mainCourse: false,
      dessert: false,
      drink: false,
    };
    ormEntity.guests =
      domain.guests?.map((g) => ReservationMapper.guestToOrm(g, domain.id)) ??
      [];
    return ormEntity;
  }

  static guestToOrm(domain: Guest, reservationId?: number): GuestOrmEntity {
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
    ormEntity.entryId = domain.meals?.entry?.mealId ?? null;
    ormEntity.entryQuantity = domain.meals?.entry?.quantity ?? null;
    ormEntity.mainCourseId = domain.meals?.mainCourse?.mealId ?? null;
    ormEntity.mainCourseQuantity = domain.meals?.mainCourse?.quantity ?? null;
    ormEntity.dessertId = domain.meals?.dessert?.mealId ?? null;
    ormEntity.dessertQuantity = domain.meals?.dessert?.quantity ?? null;
    ormEntity.drinkId = domain.meals?.drink?.mealId ?? null;
    ormEntity.drinkQuantity = domain.meals?.drink?.quantity ?? null;
    return ormEntity;
  }
}
