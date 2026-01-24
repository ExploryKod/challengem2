import { NotFoundException } from '@nestjs/common';
import {
  AddMealsToReservationUseCase,
  AddMealsToReservationInput,
} from './add-meals-to-reservation.use-case';
import { InMemoryReservationRepository } from '../testing/stubs';
import { Reservation } from '../../domain/entities/reservation.entity';
import { ReservationStatus } from '../../domain/enums/reservation-status.enum';

describe('AddMealsToReservationUseCase', () => {
  const createReservation = (): Reservation => {
    const reservation = new Reservation();
    reservation.id = 1;
    reservation.restaurantId = 1;
    reservation.tableId = 1;
    reservation.reservationCode = 'ABC123';
    reservation.status = ReservationStatus.SEATED;
    reservation.guests = [];
    reservation.createdAt = new Date();
    reservation.updatedAt = new Date();
    return reservation;
  };

  it('should add guests with meals to an existing reservation', async () => {
    // Arrange
    const existingReservation = createReservation();
    const repository = new InMemoryReservationRepository([existingReservation]);
    const useCase = new AddMealsToReservationUseCase(repository);
    const input: AddMealsToReservationInput = {
      guests: [
        {
          firstName: 'Alice',
          lastName: 'Smith',
          age: 25,
          isOrganizer: false,
          entryId: 1,
          entryQuantity: 1,
          mainCourseId: 2,
          mainCourseQuantity: 1,
        },
      ],
    };

    // Act
    const result = await useCase.execute(1, input);

    // Assert
    expect(result.guests).toHaveLength(1);
    expect(result.guests[0].firstName).toBe('Alice');
    expect(result.guests[0].lastName).toBe('Smith');
    expect(result.guests[0].meals.entry).toEqual({ mealId: 1, quantity: 1 });
    expect(result.guests[0].meals.mainCourse).toEqual({
      mealId: 2,
      quantity: 1,
    });
  });

  it('should add multiple guests to reservation', async () => {
    // Arrange
    const existingReservation = createReservation();
    const repository = new InMemoryReservationRepository([existingReservation]);
    const useCase = new AddMealsToReservationUseCase(repository);
    const input: AddMealsToReservationInput = {
      guests: [
        {
          firstName: 'Alice',
          lastName: 'Smith',
          age: 25,
          isOrganizer: false,
          mainCourseId: 1,
        },
        {
          firstName: 'Bob',
          lastName: 'Jones',
          age: 30,
          isOrganizer: false,
          mainCourseId: 2,
          dessertId: 3,
        },
      ],
    };

    // Act
    const result = await useCase.execute(1, input);

    // Assert
    expect(result.guests).toHaveLength(2);
    expect(result.guests[0].firstName).toBe('Alice');
    expect(result.guests[1].firstName).toBe('Bob');
  });

  it('should set null for unspecified meal selections', async () => {
    // Arrange
    const existingReservation = createReservation();
    const repository = new InMemoryReservationRepository([existingReservation]);
    const useCase = new AddMealsToReservationUseCase(repository);
    const input: AddMealsToReservationInput = {
      guests: [
        {
          firstName: 'Charlie',
          lastName: 'Brown',
          age: 20,
          isOrganizer: false,
          // Only mainCourse selected
          mainCourseId: 5,
        },
      ],
    };

    // Act
    const result = await useCase.execute(1, input);

    // Assert
    expect(result.guests[0].meals).toEqual({
      entry: null,
      mainCourse: { mealId: 5, quantity: 1 },
      dessert: null,
      drink: null,
    });
  });

  it('should use custom quantities when provided', async () => {
    // Arrange
    const existingReservation = createReservation();
    const repository = new InMemoryReservationRepository([existingReservation]);
    const useCase = new AddMealsToReservationUseCase(repository);
    const input: AddMealsToReservationInput = {
      guests: [
        {
          firstName: 'David',
          lastName: 'Lee',
          age: 35,
          isOrganizer: false,
          drinkId: 10,
          drinkQuantity: 3,
        },
      ],
    };

    // Act
    const result = await useCase.execute(1, input);

    // Assert
    expect(result.guests[0].meals.drink).toEqual({ mealId: 10, quantity: 3 });
  });

  it('should throw NotFoundException when reservation does not exist', async () => {
    // Arrange
    const repository = new InMemoryReservationRepository([]);
    const useCase = new AddMealsToReservationUseCase(repository);
    const input: AddMealsToReservationInput = {
      guests: [
        {
          firstName: 'Eve',
          lastName: 'Wilson',
          age: 28,
          isOrganizer: false,
        },
      ],
    };

    // Act & Assert
    await expect(useCase.execute(999, input)).rejects.toThrow(NotFoundException);
    await expect(useCase.execute(999, input)).rejects.toThrow(
      'Reservation with id 999 not found',
    );
  });
});
