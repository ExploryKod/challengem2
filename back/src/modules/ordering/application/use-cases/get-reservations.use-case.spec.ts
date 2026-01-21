import { GetReservationsUseCase } from './get-reservations.use-case';
import { InMemoryReservationRepository } from '../testing/stubs';
import { Reservation } from '../../domain/entities/reservation.entity';

describe('GetReservationsUseCase', () => {
  it('should return all reservations', async () => {
    const reservations: Reservation[] = [
      {
        id: 'res-1',
        restaurantId: 'restaurant-1',
        tableId: 'table-1',
        guests: [],
        createdAt: new Date('2024-01-15'),
      },
      {
        id: 'res-2',
        restaurantId: 'restaurant-1',
        tableId: 'table-2',
        guests: [],
        createdAt: new Date('2024-01-16'),
      },
    ];

    const repository = new InMemoryReservationRepository(reservations);
    const useCase = new GetReservationsUseCase(repository);

    const result = await useCase.execute();

    expect(result).toHaveLength(2);
    expect(result).toEqual(reservations);
  });

  it('should return empty array when no reservations exist', async () => {
    const repository = new InMemoryReservationRepository([]);
    const useCase = new GetReservationsUseCase(repository);

    const result = await useCase.execute();

    expect(result).toEqual([]);
  });
});
