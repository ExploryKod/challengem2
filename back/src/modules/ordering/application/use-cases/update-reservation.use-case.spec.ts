import { UpdateReservationUseCase } from './update-reservation.use-case';
import { InMemoryReservationRepository } from '../testing/stubs/in-memory-reservation.repository';
import { Reservation } from '../../domain/entities/reservation.entity';
import { ReservationStatus } from '../../domain/enums/reservation-status.enum';

describe('UpdateReservationUseCase', () => {
  let useCase: UpdateReservationUseCase;
  let repository: InMemoryReservationRepository;

  beforeEach(() => {
    repository = new InMemoryReservationRepository();
    useCase = new UpdateReservationUseCase(repository);
  });

  it('should update reservation status', async () => {
    const reservation = new Reservation();
    reservation.id = 1;
    reservation.restaurantId = 1;
    reservation.tableId = 1;
    reservation.status = ReservationStatus.PENDING;
    reservation.reservationCode = 'ABC123';
    reservation.guests = [];
    await repository.save(reservation);

    const result = await useCase.execute(1, {
      status: ReservationStatus.CONFIRMED,
    });

    expect(result).not.toBeNull();
    expect(result!.status).toBe(ReservationStatus.CONFIRMED);
  });

  it('should update reservation notes', async () => {
    const reservation = new Reservation();
    reservation.id = 1;
    reservation.restaurantId = 1;
    reservation.tableId = 1;
    reservation.status = ReservationStatus.PENDING;
    reservation.reservationCode = 'ABC123';
    reservation.notes = null;
    reservation.guests = [];
    await repository.save(reservation);

    const result = await useCase.execute(1, { notes: 'VIP guest' });

    expect(result).not.toBeNull();
    expect(result!.notes).toBe('VIP guest');
  });

  it('should return null if reservation not found', async () => {
    const result = await useCase.execute(999, {
      status: ReservationStatus.CONFIRMED,
    });
    expect(result).toBeNull();
  });
});
