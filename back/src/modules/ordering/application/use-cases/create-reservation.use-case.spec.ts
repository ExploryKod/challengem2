import {
  CreateReservationUseCase,
  CreateReservationInput,
} from './create-reservation.use-case';
import { InMemoryReservationRepository } from '../testing/stubs';

describe('CreateReservationUseCase', () => {
  it('should create reservation with guests and their meal selections', async () => {
    // Arrange
    const repository = new InMemoryReservationRepository();
    const useCase = new CreateReservationUseCase(repository);
    const input: CreateReservationInput = {
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
        {
          firstName: 'Jane',
          lastName: 'Doe',
          age: 28,
          isOrganizer: false,
          entryId: 5,
          mainCourseId: 6,
        },
      ],
    };

    // Act
    const result = await useCase.execute(input);

    // Assert
    expect(result.id).toBeDefined();
    expect(result.restaurantId).toBe(1);
    expect(result.tableId).toBe(1);
    expect(result.guests).toHaveLength(2);
    expect(result.createdAt).toBeInstanceOf(Date);
    expect((await repository.findAll()).length).toBe(1);
  });

  it('should assign guest meal selections correctly', async () => {
    // Arrange
    const repository = new InMemoryReservationRepository();
    const useCase = new CreateReservationUseCase(repository);
    const input: CreateReservationInput = {
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
        {
          firstName: 'Jane',
          lastName: 'Doe',
          age: 28,
          isOrganizer: false,
          // No meals selected
        },
      ],
    };

    // Act
    const result = await useCase.execute(input);

    // Assert
    const organizer = result.guests.find((g) => g.isOrganizer);
    const guest = result.guests.find((g) => !g.isOrganizer);

    expect(organizer).toBeDefined();
    expect(organizer!.meals).toEqual({
      entry: 1,
      mainCourse: 2,
      dessert: 3,
      drink: 4,
    });

    expect(guest).toBeDefined();
    expect(guest!.meals).toEqual({
      entry: null,
      mainCourse: null,
      dessert: null,
      drink: null,
    });
  });
});
