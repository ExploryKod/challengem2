import { GetReservationsUseCase } from './get-reservations.use-case';
import { InMemoryReservationRepository } from '../testing/stubs';
import { Reservation } from '../../domain/entities/reservation.entity';

describe('GetReservationsUseCase', () => {
  it('should return all reservations', async () => {
    const reservations: Reservation[] = [
      {
        id: 1,
        restaurantId: 1,
        tableId: 1,
        guests: [],
        createdAt: new Date('2024-01-15'),
      },
      {
        id: 2,
        restaurantId: 1,
        tableId: 2,
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
