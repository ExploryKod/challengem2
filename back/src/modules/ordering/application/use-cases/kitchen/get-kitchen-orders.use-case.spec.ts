import { GetKitchenOrdersUseCase } from './get-kitchen-orders.use-case';
import { InMemoryReservationRepository } from '../../testing/stubs/in-memory-reservation.repository';
import { Reservation } from '../../../domain/entities/reservation.entity';
import { ReservationStatus } from '../../../domain/enums/reservation-status.enum';

describe('GetKitchenOrdersUseCase', () => {
  let useCase: GetKitchenOrdersUseCase;
  let reservationRepository: InMemoryReservationRepository;

  const createReservation = (
    overrides: Partial<Reservation> = {},
  ): Reservation => {
    const reservation = new Reservation();
    reservation.id = 1;
    reservation.restaurantId = 1;
    reservation.tableId = 1;
    reservation.status = ReservationStatus.SEATED;
    reservation.reservationCode = 'ABC123';
    reservation.notes = null;
    reservation.coursesReady = {
      entry: false,
      mainCourse: false,
      dessert: false,
      drink: false,
    };
    reservation.createdAt = new Date();
    reservation.updatedAt = new Date();
    reservation.guests = [
      {
        id: 1,
        reservationId: 1,
        firstName: 'John',
        lastName: 'Doe',
        age: 30,
        isOrganizer: true,
        meals: {
          entry: { mealId: 1, quantity: 1 },
          mainCourse: { mealId: 2, quantity: 1 },
          dessert: null,
          drink: { mealId: 4, quantity: 2 },
        },
      },
    ];
    return { ...reservation, ...overrides };
  };

  beforeEach(() => {
    reservationRepository = new InMemoryReservationRepository();
    useCase = new GetKitchenOrdersUseCase(reservationRepository);
  });

  it('should return reservations with SEATED status', async () => {
    const seatedReservation = createReservation({
      id: 1,
      status: ReservationStatus.SEATED,
    });
    await reservationRepository.save(seatedReservation);

    const result = await useCase.execute(1);

    expect(result).toHaveLength(1);
    expect(result[0].id).toBe(1);
    expect(result[0].status).toBe(ReservationStatus.SEATED);
  });

  it('should return reservations with IN_PREPARATION status', async () => {
    const inPrepReservation = createReservation({
      id: 2,
      status: ReservationStatus.IN_PREPARATION,
    });
    await reservationRepository.save(inPrepReservation);

    const result = await useCase.execute(1);

    expect(result).toHaveLength(1);
    expect(result[0].status).toBe(ReservationStatus.IN_PREPARATION);
  });

  it('should return both SEATED and IN_PREPARATION reservations', async () => {
    await reservationRepository.save(
      createReservation({ id: 1, status: ReservationStatus.SEATED }),
    );
    await reservationRepository.save(
      createReservation({ id: 2, status: ReservationStatus.IN_PREPARATION }),
    );

    const result = await useCase.execute(1);

    expect(result).toHaveLength(2);
  });

  it('should NOT return PENDING reservations', async () => {
    await reservationRepository.save(
      createReservation({ id: 1, status: ReservationStatus.PENDING }),
    );

    const result = await useCase.execute(1);

    expect(result).toHaveLength(0);
  });

  it('should NOT return COMPLETED reservations', async () => {
    await reservationRepository.save(
      createReservation({ id: 1, status: ReservationStatus.COMPLETED }),
    );

    const result = await useCase.execute(1);

    expect(result).toHaveLength(0);
  });

  it('should NOT return CANCELLED reservations', async () => {
    await reservationRepository.save(
      createReservation({ id: 1, status: ReservationStatus.CANCELLED }),
    );

    const result = await useCase.execute(1);

    expect(result).toHaveLength(0);
  });

  it('should filter by restaurant ID', async () => {
    await reservationRepository.save(
      createReservation({
        id: 1,
        restaurantId: 1,
        status: ReservationStatus.SEATED,
      }),
    );
    await reservationRepository.save(
      createReservation({
        id: 2,
        restaurantId: 2,
        status: ReservationStatus.SEATED,
      }),
    );

    const result = await useCase.execute(1);

    expect(result).toHaveLength(1);
    expect(result[0].restaurantId).toBe(1);
  });

  it('should sort by createdAt ascending (oldest first - FIFO)', async () => {
    const older = createReservation({
      id: 1,
      createdAt: new Date('2026-01-23T10:00:00Z'),
    });
    const newer = createReservation({
      id: 2,
      createdAt: new Date('2026-01-23T11:00:00Z'),
    });

    await reservationRepository.save(newer);
    await reservationRepository.save(older);

    const result = await useCase.execute(1);

    expect(result[0].id).toBe(1); // older first
    expect(result[1].id).toBe(2);
  });
});
