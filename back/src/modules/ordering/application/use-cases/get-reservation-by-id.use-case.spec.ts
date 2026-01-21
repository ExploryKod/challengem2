import { GetReservationByIdUseCase } from './get-reservation-by-id.use-case';
import { InMemoryReservationRepository } from '../testing/stubs';
import { Reservation } from '../../domain/entities/reservation.entity';

describe('GetReservationByIdUseCase', () => {
  it('should return reservation when found', async () => {
    const reservation: Reservation = {
      id: 'res-1',
      restaurantId: 'restaurant-1',
      tableId: 'table-1',
      guests: [
        {
          id: 'guest-1',
          reservationId: 'res-1',
          firstName: 'John',
          lastName: 'Doe',
          age: 30,
          isOrganizer: true,
          entryId: null,
          mainCourseId: null,
          dessertId: null,
          drinkId: null,
        },
      ],
      createdAt: new Date('2024-01-15'),
    };

    const repository = new InMemoryReservationRepository([reservation]);
    const useCase = new GetReservationByIdUseCase(repository);

    const result = await useCase.execute('res-1');

    expect(result).toEqual(reservation);
  });

  it('should return null when reservation not found', async () => {
    const repository = new InMemoryReservationRepository([]);
    const useCase = new GetReservationByIdUseCase(repository);

    const result = await useCase.execute('non-existent-id');

    expect(result).toBeNull();
  });
});
