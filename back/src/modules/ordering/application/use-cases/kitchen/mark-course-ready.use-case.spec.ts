import { MarkCourseReadyUseCase } from './mark-course-ready.use-case';
import { InMemoryReservationRepository } from '../../testing/stubs/in-memory-reservation.repository';
import { Reservation } from '../../../domain/entities/reservation.entity';
import { ReservationStatus } from '../../../domain/enums/reservation-status.enum';

describe('MarkCourseReadyUseCase', () => {
  let useCase: MarkCourseReadyUseCase;
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
          drink: null,
        },
      },
    ];
    return { ...reservation, ...overrides };
  };

  beforeEach(() => {
    reservationRepository = new InMemoryReservationRepository();
    useCase = new MarkCourseReadyUseCase(reservationRepository);
  });

  it('should mark entry course as ready', async () => {
    await reservationRepository.save(createReservation({ id: 1 }));

    const result = await useCase.execute(1, 'entry');

    expect(result?.coursesReady.entry).toBe(true);
    expect(result?.coursesReady.mainCourse).toBe(false);
  });

  it('should mark mainCourse as ready', async () => {
    await reservationRepository.save(createReservation({ id: 1 }));

    const result = await useCase.execute(1, 'mainCourse');

    expect(result?.coursesReady.mainCourse).toBe(true);
  });

  it('should mark dessert as ready', async () => {
    await reservationRepository.save(createReservation({ id: 1 }));

    const result = await useCase.execute(1, 'dessert');

    expect(result?.coursesReady.dessert).toBe(true);
  });

  it('should mark drink as ready', async () => {
    await reservationRepository.save(createReservation({ id: 1 }));

    const result = await useCase.execute(1, 'drink');

    expect(result?.coursesReady.drink).toBe(true);
  });

  it('should change status to IN_PREPARATION when first course is marked ready', async () => {
    await reservationRepository.save(
      createReservation({ id: 1, status: ReservationStatus.SEATED }),
    );

    const result = await useCase.execute(1, 'entry');

    expect(result?.status).toBe(ReservationStatus.IN_PREPARATION);
  });

  it('should keep status as IN_PREPARATION when another course is marked ready but more courses remain', async () => {
    // Guest ordered entry, mainCourse, AND dessert - so completing mainCourse shouldn't complete the order
    await reservationRepository.save(
      createReservation({
        id: 1,
        status: ReservationStatus.IN_PREPARATION,
        coursesReady: {
          entry: true,
          mainCourse: false,
          dessert: false,
          drink: false,
        },
        guests: [
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
              dessert: { mealId: 3, quantity: 1 },
              drink: null,
            },
          },
        ],
      }),
    );

    const result = await useCase.execute(1, 'mainCourse');

    expect(result?.status).toBe(ReservationStatus.IN_PREPARATION);
  });

  it('should change status to COMPLETED when all ordered courses are ready', async () => {
    // Guest only ordered entry and mainCourse (no dessert, no drink)
    await reservationRepository.save(
      createReservation({
        id: 1,
        status: ReservationStatus.IN_PREPARATION,
        coursesReady: {
          entry: true,
          mainCourse: false,
          dessert: false,
          drink: false,
        },
        guests: [
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
              drink: null,
            },
          },
        ],
      }),
    );

    const result = await useCase.execute(1, 'mainCourse');

    expect(result?.status).toBe(ReservationStatus.COMPLETED);
  });

  it('should NOT complete if there are still ordered courses not ready', async () => {
    // Guest ordered entry, mainCourse, and dessert
    await reservationRepository.save(
      createReservation({
        id: 1,
        status: ReservationStatus.IN_PREPARATION,
        coursesReady: {
          entry: true,
          mainCourse: false,
          dessert: false,
          drink: false,
        },
        guests: [
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
              dessert: { mealId: 3, quantity: 1 },
              drink: null,
            },
          },
        ],
      }),
    );

    const result = await useCase.execute(1, 'mainCourse');

    expect(result?.status).toBe(ReservationStatus.IN_PREPARATION);
  });

  it('should return null for non-existent reservation', async () => {
    const result = await useCase.execute(999, 'entry');

    expect(result).toBeNull();
  });
});
