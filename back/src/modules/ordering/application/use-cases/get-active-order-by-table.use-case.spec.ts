import { GetActiveOrderByTableUseCase } from './get-active-order-by-table.use-case';
import { InMemoryReservationRepository } from '../testing/stubs';
import { Reservation } from '../../domain/entities/reservation.entity';
import { ReservationStatus } from '../../domain/enums/reservation-status.enum';

describe('GetActiveOrderByTableUseCase', () => {
  const createReservation = (
    overrides: Partial<Reservation> = {},
  ): Reservation => {
    const reservation = new Reservation();
    reservation.id = 1;
    reservation.restaurantId = 1;
    reservation.tableId = 1;
    reservation.reservationCode = 'ABC123';
    reservation.status = ReservationStatus.PENDING;
    reservation.guests = [];
    reservation.createdAt = new Date();
    reservation.updatedAt = new Date();
    Object.assign(reservation, overrides);
    return reservation;
  };

  it('should return reservation when table has SEATED order', async () => {
    // Arrange
    const seatedReservation = createReservation({
      id: 1,
      tableId: 5,
      status: ReservationStatus.SEATED,
      reservationCode: 'SEATED1',
    });
    const repository = new InMemoryReservationRepository([seatedReservation]);
    const useCase = new GetActiveOrderByTableUseCase(repository);

    // Act
    const result = await useCase.execute(5);

    // Assert
    expect(result).not.toBeNull();
    expect(result!.id).toBe(1);
    expect(result!.reservationCode).toBe('SEATED1');
    expect(result!.status).toBe(ReservationStatus.SEATED);
  });

  it('should return reservation when table has IN_PREPARATION order', async () => {
    // Arrange
    const preparingReservation = createReservation({
      id: 2,
      tableId: 7,
      status: ReservationStatus.IN_PREPARATION,
      reservationCode: 'PREP01',
    });
    const repository = new InMemoryReservationRepository([preparingReservation]);
    const useCase = new GetActiveOrderByTableUseCase(repository);

    // Act
    const result = await useCase.execute(7);

    // Assert
    expect(result).not.toBeNull();
    expect(result!.id).toBe(2);
    expect(result!.status).toBe(ReservationStatus.IN_PREPARATION);
  });

  it('should return null when table has no active orders', async () => {
    // Arrange
    const completedReservation = createReservation({
      id: 3,
      tableId: 10,
      status: ReservationStatus.COMPLETED,
    });
    const repository = new InMemoryReservationRepository([completedReservation]);
    const useCase = new GetActiveOrderByTableUseCase(repository);

    // Act
    const result = await useCase.execute(10);

    // Assert
    expect(result).toBeNull();
  });

  it('should return null when table has no reservations at all', async () => {
    // Arrange
    const repository = new InMemoryReservationRepository([]);
    const useCase = new GetActiveOrderByTableUseCase(repository);

    // Act
    const result = await useCase.execute(999);

    // Assert
    expect(result).toBeNull();
  });

  it('should not return PENDING reservations as active', async () => {
    // Arrange
    const pendingReservation = createReservation({
      id: 4,
      tableId: 15,
      status: ReservationStatus.PENDING,
    });
    const repository = new InMemoryReservationRepository([pendingReservation]);
    const useCase = new GetActiveOrderByTableUseCase(repository);

    // Act
    const result = await useCase.execute(15);

    // Assert
    expect(result).toBeNull();
  });

  it('should return the active order for the correct table only', async () => {
    // Arrange
    const table1Active = createReservation({
      id: 10,
      tableId: 1,
      status: ReservationStatus.SEATED,
      reservationCode: 'TABLE1',
    });
    const table2Active = createReservation({
      id: 20,
      tableId: 2,
      status: ReservationStatus.SEATED,
      reservationCode: 'TABLE2',
    });
    const repository = new InMemoryReservationRepository([
      table1Active,
      table2Active,
    ]);
    const useCase = new GetActiveOrderByTableUseCase(repository);

    // Act
    const result = await useCase.execute(2);

    // Assert
    expect(result).not.toBeNull();
    expect(result!.id).toBe(20);
    expect(result!.reservationCode).toBe('TABLE2');
  });
});
