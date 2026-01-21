import { GetReservationUseCase } from './get-reservation.use-case';
import { InMemoryAdminReservationRepository } from '../../testing/stubs';
import { Reservation } from '../../../../ordering/domain/entities/reservation.entity';
import { Guest } from '../../../../ordering/domain/entities/guest.entity';

describe('GetReservationUseCase', () => {
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

  it('should return a reservation by id', async () => {
    // Arrange
    const guest = createGuest(1, 1, 'John', true);
    const reservation = createReservation(1, 1, 1, [guest]);
    const repository = new InMemoryAdminReservationRepository([reservation]);
    const useCase = new GetReservationUseCase(repository);

    // Act
    const result = await useCase.execute(1);

    // Assert
    expect(result).not.toBeNull();
    expect(result?.id).toBe(1);
    expect(result?.restaurantId).toBe(1);
    expect(result?.tableId).toBe(1);
    expect(result?.guests).toHaveLength(1);
  });

  it('should return null when reservation does not exist', async () => {
    // Arrange
    const repository = new InMemoryAdminReservationRepository([]);
    const useCase = new GetReservationUseCase(repository);

    // Act
    const result = await useCase.execute(999);

    // Assert
    expect(result).toBeNull();
  });

  it('should include all guest meal information', async () => {
    // Arrange
    const guest = new Guest();
    guest.id = 1;
    guest.reservationId = 1;
    guest.firstName = 'John';
    guest.lastName = 'Doe';
    guest.age = 30;
    guest.isOrganizer = true;
    guest.meals = {
      entry: 1,
      mainCourse: 2,
      dessert: 3,
      drink: 4,
    };
    const reservation = createReservation(1, 1, 1, [guest]);
    const repository = new InMemoryAdminReservationRepository([reservation]);
    const useCase = new GetReservationUseCase(repository);

    // Act
    const result = await useCase.execute(1);

    // Assert
    expect(result?.guests[0].meals).toEqual({
      entry: 1,
      mainCourse: 2,
      dessert: 3,
      drink: 4,
    });
  });
});
