import { DeleteReservationUseCase } from './delete-reservation.use-case';
import { InMemoryAdminReservationRepository } from '../../testing/stubs';
import { Reservation } from '../../../../ordering/domain/entities/reservation.entity';
import { Guest } from '../../../../ordering/domain/entities/guest.entity';

describe('DeleteReservationUseCase', () => {
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

  it('should delete a reservation and return true', async () => {
    // Arrange
    const guest = createGuest(1, 1, 'John', true);
    const reservation = createReservation(1, 1, 1, [guest]);
    const repository = new InMemoryAdminReservationRepository([reservation]);
    const useCase = new DeleteReservationUseCase(repository);

    // Act
    const result = await useCase.execute(1);

    // Assert
    expect(result).toBe(true);
  });

  it('should remove the reservation from storage', async () => {
    // Arrange
    const guest = createGuest(1, 1, 'John', true);
    const reservation = createReservation(1, 1, 1, [guest]);
    const repository = new InMemoryAdminReservationRepository([reservation]);
    const useCase = new DeleteReservationUseCase(repository);

    // Act
    await useCase.execute(1);

    // Assert
    const found = await repository.findById(1);
    expect(found).toBeNull();
  });

  it('should return false when reservation does not exist', async () => {
    // Arrange
    const repository = new InMemoryAdminReservationRepository([]);
    const useCase = new DeleteReservationUseCase(repository);

    // Act
    const result = await useCase.execute(999);

    // Assert
    expect(result).toBe(false);
  });

  it('should not affect other reservations', async () => {
    // Arrange
    const guest1 = createGuest(1, 1, 'John', true);
    const guest2 = createGuest(2, 2, 'Jane', true);
    const reservation1 = createReservation(1, 1, 1, [guest1]);
    const reservation2 = createReservation(2, 1, 2, [guest2]);
    const repository = new InMemoryAdminReservationRepository([
      reservation1,
      reservation2,
    ]);
    const useCase = new DeleteReservationUseCase(repository);

    // Act
    await useCase.execute(1);

    // Assert
    const remaining = await repository.findByRestaurantId(1);
    expect(remaining).toHaveLength(1);
    expect(remaining[0].id).toBe(2);
  });
});
