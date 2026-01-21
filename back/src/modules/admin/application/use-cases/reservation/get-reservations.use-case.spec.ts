import { GetReservationsUseCase } from './get-reservations.use-case';
import { InMemoryAdminReservationRepository } from '../../testing/stubs';
import { Reservation } from '../../../../ordering/domain/entities/reservation.entity';
import { Guest } from '../../../../ordering/domain/entities/guest.entity';

describe('GetReservationsUseCase', () => {
  const createGuest = (
    id: number,
    reservationId: number,
    firstName: string,
    isOrganizer: boolean,
  ): Guest => {
    const guest = new Guest();
    guest.id = id;
    guest.reservationId = reservationId;
    guest.firstName = firstName;
    guest.lastName = 'Doe';
    guest.age = 30;
    guest.isOrganizer = isOrganizer;
    guest.meals = { entry: null, mainCourse: null, dessert: null, drink: null };
    return guest;
  };

  const createReservation = (
    id: number,
    restaurantId: number,
    tableId: number,
    guests: Guest[],
  ): Reservation => {
    const reservation = new Reservation();
    reservation.id = id;
    reservation.restaurantId = restaurantId;
    reservation.tableId = tableId;
    reservation.guests = guests;
    reservation.createdAt = new Date('2024-01-15');
    return reservation;
  };

  it('should return all reservations for a restaurant', async () => {
    // Arrange
    const guest1 = createGuest(1, 1, 'John', true);
    const guest2 = createGuest(2, 2, 'Jane', true);
    const guest3 = createGuest(3, 3, 'Bob', true);

    const reservation1 = createReservation(1, 1, 1, [guest1]);
    const reservation2 = createReservation(2, 1, 2, [guest2]);
    const reservation3 = createReservation(3, 2, 3, [guest3]);

    const repository = new InMemoryAdminReservationRepository([
      reservation1,
      reservation2,
      reservation3,
    ]);
    const useCase = new GetReservationsUseCase(repository);

    // Act
    const result = await useCase.execute(1);

    // Assert
    expect(result).toHaveLength(2);
    expect(result[0].id).toBe(1);
    expect(result[1].id).toBe(2);
  });

  it('should return empty array when no reservations exist for restaurant', async () => {
    // Arrange
    const repository = new InMemoryAdminReservationRepository([]);
    const useCase = new GetReservationsUseCase(repository);

    // Act
    const result = await useCase.execute(1);

    // Assert
    expect(result).toEqual([]);
  });

  it('should include guests in the returned reservations', async () => {
    // Arrange
    const guest1 = createGuest(1, 1, 'John', true);
    const guest2 = createGuest(2, 1, 'Jane', false);
    const reservation = createReservation(1, 1, 1, [guest1, guest2]);

    const repository = new InMemoryAdminReservationRepository([reservation]);
    const useCase = new GetReservationsUseCase(repository);

    // Act
    const result = await useCase.execute(1);

    // Assert
    expect(result).toHaveLength(1);
    expect(result[0].guests).toHaveLength(2);
    expect(result[0].guests[0].firstName).toBe('John');
    expect(result[0].guests[1].firstName).toBe('Jane');
  });
});
