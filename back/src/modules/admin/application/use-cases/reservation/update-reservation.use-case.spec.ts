import { UpdateReservationUseCase } from './update-reservation.use-case';
import { InMemoryAdminReservationRepository } from '../../testing/stubs';
import { Reservation } from '../../../../ordering/domain/entities/reservation.entity';
import { Guest } from '../../../../ordering/domain/entities/guest.entity';
import type { UpdateReservationData } from '../../ports/admin-reservation.repository.port';

describe('UpdateReservationUseCase', () => {
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

  it('should update reservation tableId', async () => {
    // Arrange
    const guest = createGuest(1, 1, 'John', true);
    const reservation = createReservation(1, 1, 1, [guest]);
    const repository = new InMemoryAdminReservationRepository([reservation]);
    const useCase = new UpdateReservationUseCase(repository);
    const updateData: UpdateReservationData = { tableId: 2 };

    // Act
    const result = await useCase.execute(1, updateData);

    // Assert
    expect(result).not.toBeNull();
    expect(result?.tableId).toBe(2);
    expect(result?.restaurantId).toBe(1); // unchanged
  });

  it('should update reservation restaurantId', async () => {
    // Arrange
    const guest = createGuest(1, 1, 'John', true);
    const reservation = createReservation(1, 1, 1, [guest]);
    const repository = new InMemoryAdminReservationRepository([reservation]);
    const useCase = new UpdateReservationUseCase(repository);
    const updateData: UpdateReservationData = { restaurantId: 2 };

    // Act
    const result = await useCase.execute(1, updateData);

    // Assert
    expect(result).not.toBeNull();
    expect(result?.restaurantId).toBe(2);
  });

  it('should replace guests when provided', async () => {
    // Arrange
    const guest = createGuest(1, 1, 'John', true);
    const reservation = createReservation(1, 1, 1, [guest]);
    const repository = new InMemoryAdminReservationRepository([reservation]);
    const useCase = new UpdateReservationUseCase(repository);
    const updateData: UpdateReservationData = {
      guests: [
        {
          firstName: 'Alice',
          lastName: 'Smith',
          age: 25,
          isOrganizer: true,
          entryId: 1,
          mainCourseId: 2,
          dessertId: null,
          drinkId: null,
        },
        {
          firstName: 'Bob',
          lastName: 'Jones',
          age: 35,
          isOrganizer: false,
          entryId: null,
          mainCourseId: 3,
          dessertId: 4,
          drinkId: 5,
        },
      ],
    };

    // Act
    const result = await useCase.execute(1, updateData);

    // Assert
    expect(result).not.toBeNull();
    expect(result?.guests).toHaveLength(2);
    expect(result?.guests[0].firstName).toBe('Alice');
    expect(result?.guests[1].firstName).toBe('Bob');
    expect(result?.guests[0].meals.entry).toBe(1);
    expect(result?.guests[1].meals.dessert).toBe(4);
  });

  it('should return null when reservation does not exist', async () => {
    // Arrange
    const repository = new InMemoryAdminReservationRepository([]);
    const useCase = new UpdateReservationUseCase(repository);
    const updateData: UpdateReservationData = { tableId: 2 };

    // Act
    const result = await useCase.execute(999, updateData);

    // Assert
    expect(result).toBeNull();
  });
});
