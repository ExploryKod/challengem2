import { CreateReservationUseCase } from './create-reservation.use-case';
import { InMemoryAdminReservationRepository } from '../../testing/stubs';
import type { CreateReservationData } from '../../ports/admin-reservation.repository.port';

describe('CreateReservationUseCase', () => {
  it('should create a reservation with guests', async () => {
    // Arrange
    const repository = new InMemoryAdminReservationRepository([]);
    const useCase = new CreateReservationUseCase(repository);
    const data: CreateReservationData = {
      restaurantId: 1,
      tableId: 1,
      guests: [
        {
          firstName: 'John',
          lastName: 'Doe',
          age: 30,
          isOrganizer: true,
          entryId: 1,
          mainCourseId: 2,
          dessertId: null,
          drinkId: 4,
        },
        {
          firstName: 'Jane',
          lastName: 'Doe',
          age: 28,
          isOrganizer: false,
          entryId: null,
          mainCourseId: 2,
          dessertId: 3,
          drinkId: null,
        },
      ],
    };

    // Act
    const result = await useCase.execute(data);

    // Assert
    expect(result.id).toBeDefined();
    expect(result.restaurantId).toBe(1);
    expect(result.tableId).toBe(1);
    expect(result.guests).toHaveLength(2);
    expect(result.createdAt).toBeDefined();
  });

  it('should assign ids to the created guests', async () => {
    // Arrange
    const repository = new InMemoryAdminReservationRepository([]);
    const useCase = new CreateReservationUseCase(repository);
    const data: CreateReservationData = {
      restaurantId: 1,
      tableId: 1,
      guests: [
        {
          firstName: 'John',
          lastName: 'Doe',
          age: 30,
          isOrganizer: true,
        },
      ],
    };

    // Act
    const result = await useCase.execute(data);

    // Assert
    expect(result.guests[0].id).toBeDefined();
    expect(result.guests[0].reservationId).toBe(result.id);
  });

  it('should persist the reservation with meals', async () => {
    // Arrange
    const repository = new InMemoryAdminReservationRepository([]);
    const useCase = new CreateReservationUseCase(repository);
    const data: CreateReservationData = {
      restaurantId: 1,
      tableId: 1,
      guests: [
        {
          firstName: 'John',
          lastName: 'Doe',
          age: 30,
          isOrganizer: true,
          entryId: 1,
          mainCourseId: 2,
          dessertId: 3,
          drinkId: 4,
        },
      ],
    };

    // Act
    const created = await useCase.execute(data);
    const retrieved = await repository.findById(created.id);

    // Assert
    expect(retrieved).not.toBeNull();
    expect(retrieved?.guests[0].meals).toEqual({
      entry: { mealId: 1, quantity: 1 },
      mainCourse: { mealId: 2, quantity: 1 },
      dessert: { mealId: 3, quantity: 1 },
      drink: { mealId: 4, quantity: 1 },
    });
  });
});
