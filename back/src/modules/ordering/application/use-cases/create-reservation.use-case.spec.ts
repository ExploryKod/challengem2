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
      restaurantId: 'restaurant-1',
      tableId: 'table-1',
      guests: [
        {
          firstName: 'John',
          lastName: 'Doe',
          age: 30,
          isOrganizer: true,
          entryId: 'meal-entry-1',
          mainCourseId: 'meal-main-1',
          dessertId: 'meal-dessert-1',
          drinkId: 'meal-drink-1',
        },
        {
          firstName: 'Jane',
          lastName: 'Doe',
          age: 28,
          isOrganizer: false,
          entryId: 'meal-entry-2',
          mainCourseId: 'meal-main-2',
        },
      ],
    };

    // Act
    const result = await useCase.execute(input);

    // Assert
    expect(result.id).toBeDefined();
    expect(result.restaurantId).toBe('restaurant-1');
    expect(result.tableId).toBe('table-1');
    expect(result.guests).toHaveLength(2);
    expect(result.createdAt).toBeInstanceOf(Date);
    expect((await repository.findAll()).length).toBe(1);
  });

  it('should assign guest meal selections correctly', async () => {
    // Arrange
    const repository = new InMemoryReservationRepository();
    const useCase = new CreateReservationUseCase(repository);
    const input: CreateReservationInput = {
      restaurantId: 'restaurant-1',
      tableId: 'table-1',
      guests: [
        {
          firstName: 'John',
          lastName: 'Doe',
          age: 30,
          isOrganizer: true,
          entryId: 'entry-1',
          mainCourseId: 'main-1',
          dessertId: 'dessert-1',
          drinkId: 'drink-1',
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
      entry: 'entry-1',
      mainCourse: 'main-1',
      dessert: 'dessert-1',
      drink: 'drink-1',
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
