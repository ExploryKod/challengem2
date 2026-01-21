import { GetReservationByIdUseCase } from './get-reservation-by-id.use-case';
import { InMemoryReservationRepository } from '../testing/stubs';
import { Reservation } from '../../domain/entities/reservation.entity';

describe('GetReservationByIdUseCase', () => {
  it('should return reservation when found', async () => {
    const reservation: Reservation = {
      id: 1,
      restaurantId: 1,
      tableId: 1,
      guests: [
        {
          id: 1,
          reservationId: 1,
          firstName: 'John',
          lastName: 'Doe',
          age: 30,
          isOrganizer: true,
          meals: {
            entry: null,
            mainCourse: null,
            dessert: null,
            drink: null,
          },
        },
      ],
      createdAt: new Date('2024-01-15'),
    };

    const repository = new InMemoryReservationRepository([reservation]);
    const useCase = new GetReservationByIdUseCase(repository);

    const result = await useCase.execute(1);

    expect(result).toEqual(reservation);
  });

  it('should return null when reservation not found', async () => {
    const repository = new InMemoryReservationRepository([]);
    const useCase = new GetReservationByIdUseCase(repository);

    const result = await useCase.execute(999);

    expect(result).toBeNull();
  });
});
