import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { AppModule } from '../../../../../../app.module';
import { DataSource } from 'typeorm';
import { RestaurantOrmEntity } from '../../../persistence/orm-entities/restaurant.orm-entity';
import { TableOrmEntity } from '../../../persistence/orm-entities/table.orm-entity';
import { MealOrmEntity } from '../../../persistence/orm-entities/meal.orm-entity';
import { ReservationOrmEntity } from '../../../persistence/orm-entities/reservation.orm-entity';
import { GuestOrmEntity } from '../../../persistence/orm-entities/guest.orm-entity';
import { MealType } from '../../../../domain/enums/meal-type.enum';

describe('Controllers (Integration)', () => {
  let app: INestApplication;
  let dataSource: DataSource;
  let testRestaurant: RestaurantOrmEntity;
  let testTables: TableOrmEntity[];
  let testMeals: MealOrmEntity[];

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ transform: true }));
    await app.init();

    dataSource = moduleFixture.get<DataSource>(DataSource);

    // Seed test data
    await seedTestData();
  });

  afterAll(async () => {
    // Clean up test data
    await cleanupTestData();
    await app.close();
  });

  async function seedTestData(): Promise<void> {
    const restaurantRepo = dataSource.getRepository(RestaurantOrmEntity);
    const tableRepo = dataSource.getRepository(TableOrmEntity);
    const mealRepo = dataSource.getRepository(MealOrmEntity);

    // Create test restaurant
    testRestaurant = await restaurantRepo.save({
      name: 'Test Restaurant',
      type: 'Test Type',
      stars: 4,
    });

    // Create test tables
    testTables = await tableRepo.save([
      { restaurantId: testRestaurant.id, title: 'Test Table 1', capacity: 2 },
      { restaurantId: testRestaurant.id, title: 'Test Table 2', capacity: 4 },
    ]);

    // Create test meals
    testMeals = await mealRepo.save([
      {
        restaurantId: testRestaurant.id,
        title: 'Test Entry',
        type: MealType.ENTRY,
        price: 10,
        requiredAge: null,
        imageUrl: 'https://example.com/entry.jpg',
      },
      {
        restaurantId: testRestaurant.id,
        title: 'Test Main Course',
        type: MealType.MAIN_COURSE,
        price: 20,
        requiredAge: null,
        imageUrl: 'https://example.com/main.jpg',
      },
      {
        restaurantId: testRestaurant.id,
        title: 'Test Wine',
        type: MealType.DRINK,
        price: 15,
        requiredAge: 18,
        imageUrl: 'https://example.com/wine.jpg',
      },
    ]);
  }

  async function cleanupTestData(): Promise<void> {
    const guestRepo = dataSource.getRepository(GuestOrmEntity);
    const reservationRepo = dataSource.getRepository(ReservationOrmEntity);
    const mealRepo = dataSource.getRepository(MealOrmEntity);
    const tableRepo = dataSource.getRepository(TableOrmEntity);
    const restaurantRepo = dataSource.getRepository(RestaurantOrmEntity);

    // Find reservations for this restaurant
    const reservations = await reservationRepo.find({
      where: { restaurantId: testRestaurant.id },
    });

    // Delete guests first (respecting FK constraint)
    for (const reservation of reservations) {
      await guestRepo.delete({ reservationId: reservation.id });
    }

    // Then delete reservations
    await reservationRepo.delete({ restaurantId: testRestaurant.id });

    // Delete remaining entities
    await mealRepo.delete({ restaurantId: testRestaurant.id });
    await tableRepo.delete({ restaurantId: testRestaurant.id });
    await restaurantRepo.delete({ id: testRestaurant.id });
  }

  describe('GET /restaurants', () => {
    it('should return all restaurants', async () => {
      const response = await request(app.getHttpServer())
        .get('/restaurants')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThanOrEqual(1);

      const found = response.body.find(
        (r: RestaurantOrmEntity) => r.id === testRestaurant.id,
      );
      expect(found).toBeDefined();
      expect(found.name).toBe('Test Restaurant');
      expect(found.type).toBe('Test Type');
      expect(found.stars).toBe(4);
    });
  });

  describe('GET /tables', () => {
    it('should return tables for a given restaurant', async () => {
      const response = await request(app.getHttpServer())
        .get(`/tables?restaurantId=${testRestaurant.id}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(2);
      expect(response.body[0].restaurantId).toBe(testRestaurant.id);
      expect(response.body.map((t: TableOrmEntity) => t.title)).toContain(
        'Test Table 1',
      );
    });

    it('should return empty array for unknown restaurant', async () => {
      const fakeId = 999999;
      const response = await request(app.getHttpServer())
        .get(`/tables?restaurantId=${fakeId}`)
        .expect(200);

      expect(response.body).toEqual([]);
    });
  });

  describe('GET /meals', () => {
    it('should return all meals for a restaurant', async () => {
      const response = await request(app.getHttpServer())
        .get(`/meals?restaurantId=${testRestaurant.id}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(3);
    });

    it('should filter meals by type', async () => {
      const response = await request(app.getHttpServer())
        .get(`/meals?restaurantId=${testRestaurant.id}&type=${MealType.ENTRY}`)
        .expect(200);

      expect(response.body.length).toBe(1);
      expect(response.body[0].title).toBe('Test Entry');
      expect(response.body[0].type).toBe(MealType.ENTRY);
    });
  });

  describe('GET /reservations', () => {
    let createdReservationId: number;

    beforeAll(async () => {
      // Create a reservation for testing GET endpoints
      const dto = {
        restaurantId: testRestaurant.id,
        tableId: testTables[0].id,
        guests: [
          {
            firstName: 'Test',
            lastName: 'Guest',
            age: 25,
            isOrganizer: true,
          },
        ],
      };

      const response = await request(app.getHttpServer())
        .post('/reservations')
        .send(dto);

      createdReservationId = response.body.id;
    });

    it('should return all reservations', async () => {
      const response = await request(app.getHttpServer())
        .get('/reservations')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThanOrEqual(1);

      const found = response.body.find(
        (r: { id: number }) => r.id === createdReservationId,
      );
      expect(found).toBeDefined();
      expect(found.restaurantId).toBe(testRestaurant.id);
    });

    it('should return a reservation by id', async () => {
      const response = await request(app.getHttpServer())
        .get(`/reservations/${createdReservationId}`)
        .expect(200);

      expect(response.body.id).toBe(createdReservationId);
      expect(response.body.restaurantId).toBe(testRestaurant.id);
      expect(response.body.guests).toHaveLength(1);
      expect(response.body.guests[0].firstName).toBe('Test');
    });

    it('should return 404 for non-existent reservation', async () => {
      const fakeId = 999999;
      const response = await request(app.getHttpServer())
        .get(`/reservations/${fakeId}`)
        .expect(404);

      expect(response.body.message).toContain('not found');
    });

    it('should return 400 for invalid id format', async () => {
      await request(app.getHttpServer())
        .get('/reservations/not-a-number')
        .expect(400);
    });
  });

  describe('POST /reservations', () => {
    it('should create a reservation with guests', async () => {
      const dto = {
        restaurantId: testRestaurant.id,
        tableId: testTables[0].id,
        guests: [
          {
            firstName: 'John',
            lastName: 'Doe',
            age: 30,
            isOrganizer: true,
            entryId: testMeals[0].id,
            mainCourseId: testMeals[1].id,
          },
          {
            firstName: 'Jane',
            lastName: 'Doe',
            age: 28,
            isOrganizer: false,
          },
        ],
      };

      const response = await request(app.getHttpServer())
        .post('/reservations')
        .send(dto)
        .expect(201);

      expect(response.body.id).toBeDefined();
      expect(response.body.restaurantId).toBe(testRestaurant.id);
      expect(response.body.tableId).toBe(testTables[0].id);
      expect(response.body.guests).toHaveLength(2);
      expect(response.body.createdAt).toBeDefined();

      // Verify organizer guest
      const organizer = response.body.guests.find(
        (g: { isOrganizer: boolean }) => g.isOrganizer,
      );
      expect(organizer.firstName).toBe('John');
      expect(organizer.meals.entry).toBe(testMeals[0].id);
      expect(organizer.meals.mainCourse).toBe(testMeals[1].id);
    });

    it('should reject invalid reservation (missing guests)', async () => {
      const dto = {
        restaurantId: testRestaurant.id,
        tableId: testTables[0].id,
        guests: [],
      };

      const response = await request(app.getHttpServer())
        .post('/reservations')
        .send(dto)
        .expect(400);

      expect(response.body.message).toContain(
        'guests must contain at least 1 elements',
      );
    });

    it('should reject invalid reservation (invalid restaurantId)', async () => {
      const dto = {
        restaurantId: 'not-a-number',
        tableId: testTables[0].id,
        guests: [
          {
            firstName: 'John',
            lastName: 'Doe',
            age: 30,
            isOrganizer: true,
          },
        ],
      };

      const response = await request(app.getHttpServer())
        .post('/reservations')
        .send(dto)
        .expect(400);

      expect(response.body.message).toContain(
        'restaurantId must be an integer number',
      );
    });
  });
});
