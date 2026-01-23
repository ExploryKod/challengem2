import { GetReservationByCodeUseCase } from './get-reservation-by-code.use-case';
import { InMemoryReservationRepository } from '../testing/stubs/in-memory-reservation.repository';
import { Reservation } from '../../domain/entities/reservation.entity';
import { ReservationStatus } from '../../domain/enums/reservation-status.enum';

describe('GetReservationByCodeUseCase', () => {
  let useCase: GetReservationByCodeUseCase;
  let repository: InMemoryReservationRepository;

  beforeEach(() => {
    repository = new InMemoryReservationRepository();
    useCase = new GetReservationByCodeUseCase(repository);
  });

  it('should find reservation by code', async () => {
    const reservation = new Reservation();
    reservation.id = 1;
    reservation.restaurantId = 1;
    reservation.tableId = 1;
    reservation.status = ReservationStatus.PENDING;
    reservation.reservationCode = 'XYZ789';
    reservation.guests = [];
    await repository.save(reservation);

    const result = await useCase.execute('XYZ789');

    expect(result).not.toBeNull();
    expect(result!.reservationCode).toBe('XYZ789');
  });

  it('should return null if code not found', async () => {
    const result = await useCase.execute('NOTFOUND');
    expect(result).toBeNull();
  });
});
