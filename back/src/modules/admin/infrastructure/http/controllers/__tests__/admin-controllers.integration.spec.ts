import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../../../../../../app.module';
import { DataSource } from 'typeorm';
import { RestaurantOrmEntity } from '../../../../../ordering/infrastructure/persistence/orm-entities/restaurant.orm-entity';
import { TableOrmEntity } from '../../../../../ordering/infrastructure/persistence/orm-entities/table.orm-entity';
import { MealOrmEntity } from '../../../../../ordering/infrastructure/persistence/orm-entities/meal.orm-entity';
import { ReservationOrmEntity } from '../../../../../ordering/infrastructure/persistence/orm-entities/reservation.orm-entity';
import { GuestOrmEntity } from '../../../../../ordering/infrastructure/persistence/orm-entities/guest.orm-entity';
import { MealType } from '../../../../../ordering/domain/enums/meal-type.enum';

interface RestaurantResponse {
  id: number;
  name: string;
  type: string;
  stars: number;
}

interface TableResponse {
  id: number;
  restaurantId: number;
  title: string;
  capacity: number;
}

interface MealResponse {
  id: number;
  restaurantId: number;
  title: string;
  type: MealType;
  price: number;
  requiredAge: number | null;
  imageUrl: string;
}

interface GuestResponse {
  id: number;
  firstName: string;
  lastName: string;
  age: number;
  isOrganizer: boolean;
  meals: {
    entry: number | null;
    mainCourse: number | null;
    dessert: number | null;
    drink: number | null;
  };
}

interface ReservationResponse {
  id: number;
  restaurantId: number;
  tableId: number;
  guests: GuestResponse[];
  createdAt: string;
}

interface ErrorResponse {
  message: string | string[];
  error: string;
  statusCode: number;
}

describe('Admin Controllers (Integration)', () => {
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
      name: 'Admin Test Restaurant',
      type: 'Admin Test Type',
      stars: 3,
    });

    // Create test tables
    testTables = await tableRepo.save([
      {
        restaurantId: testRestaurant.id,
        title: 'Admin Test Table 1',
        capacity: 2,
      },
      {
        restaurantId: testRestaurant.id,
        title: 'Admin Test Table 2',
        capacity: 4,
      },
    ]);

    // Create test meals
    testMeals = await mealRepo.save([
      {
        restaurantId: testRestaurant.id,
        title: 'Admin Test Entry',
        type: MealType.ENTRY,
        price: 10,
        requiredAge: null,
        imageUrl: 'https://example.com/entry.jpg',
      },
      {
        restaurantId: testRestaurant.id,
        title: 'Admin Test Main Course',
        type: MealType.MAIN_COURSE,
        price: 20,
        requiredAge: null,
        imageUrl: 'https://example.com/main.jpg',
      },
      {
        restaurantId: testRestaurant.id,
        title: 'Admin Test Dessert',
        type: MealType.DESSERT,
        price: 8,
        requiredAge: null,
        imageUrl: 'https://example.com/dessert.jpg',
      },
      {
        restaurantId: testRestaurant.id,
        title: 'Admin Test Wine',
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

  // ===========================================
  // RESTAURANT TESTS
  // ===========================================

  describe('Admin Restaurant Endpoints', () => {
    describe('POST /admin/restaurants', () => {
      let createdRestaurantId: number;

      afterAll(async () => {
        // Clean up created restaurant
        if (createdRestaurantId) {
          const restaurantRepo = dataSource.getRepository(RestaurantOrmEntity);
          await restaurantRepo.delete({ id: createdRestaurantId });
        }
      });

      it('should create a restaurant', async () => {
        const dto = {
          name: 'New Admin Restaurant',
          type: 'Italian',
          stars: 4,
        };

        const response = await request(app.getHttpServer() as App)
          .post('/admin/restaurants')
          .send(dto)
          .expect(201);

        const restaurant = response.body as RestaurantResponse;
        createdRestaurantId = restaurant.id;

        expect(restaurant.id).toBeDefined();
        expect(restaurant.name).toBe('New Admin Restaurant');
        expect(restaurant.type).toBe('Italian');
        expect(restaurant.stars).toBe(4);
      });

      it('should return 400 for invalid input (missing name)', async () => {
        const dto = {
          type: 'Italian',
          stars: 4,
        };

        const response = await request(app.getHttpServer() as App)
          .post('/admin/restaurants')
          .send(dto)
          .expect(400);

        const error = response.body as ErrorResponse;
        expect(error.message).toContain('name must be a string');
      });

      it('should return 400 for invalid stars (out of range)', async () => {
        const dto = {
          name: 'Test',
          type: 'Italian',
          stars: 10,
        };

        const response = await request(app.getHttpServer() as App)
          .post('/admin/restaurants')
          .send(dto)
          .expect(400);

        const error = response.body as ErrorResponse;
        expect(error.message).toContain('stars must not be greater than 5');
      });
    });

    describe('GET /admin/restaurants', () => {
      it('should return all restaurants', async () => {
        const response = await request(app.getHttpServer() as App)
          .get('/admin/restaurants')
          .expect(200);

        const restaurants = response.body as RestaurantResponse[];
        expect(Array.isArray(restaurants)).toBe(true);
        expect(restaurants.length).toBeGreaterThanOrEqual(1);

        const found = restaurants.find((r) => r.id === testRestaurant.id);
        expect(found).toBeDefined();
        expect(found?.name).toBe('Admin Test Restaurant');
      });
    });

    describe('GET /admin/restaurants/:id', () => {
      it('should return a restaurant by id', async () => {
        const response = await request(app.getHttpServer() as App)
          .get(`/admin/restaurants/${testRestaurant.id}`)
          .expect(200);

        const restaurant = response.body as RestaurantResponse;
        expect(restaurant.id).toBe(testRestaurant.id);
        expect(restaurant.name).toBe('Admin Test Restaurant');
        expect(restaurant.type).toBe('Admin Test Type');
        expect(restaurant.stars).toBe(3);
      });

      it('should return 404 for non-existent restaurant', async () => {
        const fakeId = 999999;
        const response = await request(app.getHttpServer() as App)
          .get(`/admin/restaurants/${fakeId}`)
          .expect(404);

        const error = response.body as ErrorResponse;
        expect(error.message).toContain('not found');
      });

      it('should return 400 for invalid id format', async () => {
        await request(app.getHttpServer() as App)
          .get('/admin/restaurants/not-a-number')
          .expect(400);
      });
    });

    describe('PUT /admin/restaurants/:id', () => {
      it('should update a restaurant', async () => {
        const dto = {
          name: 'Updated Admin Test Restaurant',
          stars: 5,
        };

        const response = await request(app.getHttpServer() as App)
          .put(`/admin/restaurants/${testRestaurant.id}`)
          .send(dto)
          .expect(200);

        const restaurant = response.body as RestaurantResponse;
        expect(restaurant.id).toBe(testRestaurant.id);
        expect(restaurant.name).toBe('Updated Admin Test Restaurant');
        expect(restaurant.stars).toBe(5);
        expect(restaurant.type).toBe('Admin Test Type'); // Unchanged

        // Restore original values for other tests
        await request(app.getHttpServer() as App)
          .put(`/admin/restaurants/${testRestaurant.id}`)
          .send({ name: 'Admin Test Restaurant', stars: 3 });
      });

      it('should return 404 for non-existent restaurant', async () => {
        const fakeId = 999999;
        const response = await request(app.getHttpServer() as App)
          .put(`/admin/restaurants/${fakeId}`)
          .send({ name: 'Updated' })
          .expect(404);

        const error = response.body as ErrorResponse;
        expect(error.message).toContain('not found');
      });
    });

    describe('DELETE /admin/restaurants/:id', () => {
      it('should delete a restaurant and cascade delete related entities', async () => {
        // Create a temporary restaurant with related entities
        const restaurantRepo = dataSource.getRepository(RestaurantOrmEntity);
        const tableRepo = dataSource.getRepository(TableOrmEntity);
        const mealRepo = dataSource.getRepository(MealOrmEntity);

        const tempRestaurant = await restaurantRepo.save({
          name: 'Temp Restaurant To Delete',
          type: 'Temp',
          stars: 2,
        });

        await tableRepo.save({
          restaurantId: tempRestaurant.id,
          title: 'Temp Table',
          capacity: 2,
        });

        await mealRepo.save({
          restaurantId: tempRestaurant.id,
          title: 'Temp Meal',
          type: MealType.ENTRY,
          price: 5,
          requiredAge: null,
          imageUrl: 'https://example.com/temp.jpg',
        });

        // Delete the restaurant via API
        await request(app.getHttpServer() as App)
          .delete(`/admin/restaurants/${tempRestaurant.id}`)
          .expect(200);

        // Verify restaurant is deleted
        const deletedRestaurant = await restaurantRepo.findOne({
          where: { id: tempRestaurant.id },
        });
        expect(deletedRestaurant).toBeNull();

        // Verify cascade delete of related tables
        const relatedTables = await tableRepo.find({
          where: { restaurantId: tempRestaurant.id },
        });
        expect(relatedTables).toHaveLength(0);

        // Verify cascade delete of related meals
        const relatedMeals = await mealRepo.find({
          where: { restaurantId: tempRestaurant.id },
        });
        expect(relatedMeals).toHaveLength(0);
      });

      it('should return 404 for non-existent restaurant', async () => {
        const fakeId = 999999;
        const response = await request(app.getHttpServer() as App)
          .delete(`/admin/restaurants/${fakeId}`)
          .expect(404);

        const error = response.body as ErrorResponse;
        expect(error.message).toContain('not found');
      });
    });
  });

  // ===========================================
  // TABLE TESTS
  // ===========================================

  describe('Admin Table Endpoints', () => {
    describe('POST /admin/tables', () => {
      let createdTableId: number;

      afterAll(async () => {
        // Clean up created table
        if (createdTableId) {
          const tableRepo = dataSource.getRepository(TableOrmEntity);
          await tableRepo.delete({ id: createdTableId });
        }
      });

      it('should create a table', async () => {
        const dto = {
          restaurantId: testRestaurant.id,
          title: 'New Admin Table',
          capacity: 6,
        };

        const response = await request(app.getHttpServer() as App)
          .post('/admin/tables')
          .send(dto)
          .expect(201);

        const table = response.body as TableResponse;
        createdTableId = table.id;

        expect(table.id).toBeDefined();
        expect(table.restaurantId).toBe(testRestaurant.id);
        expect(table.title).toBe('New Admin Table');
        expect(table.capacity).toBe(6);
      });

      it('should return 400 for invalid input (missing restaurantId)', async () => {
        const dto = {
          title: 'New Table',
          capacity: 4,
        };

        const response = await request(app.getHttpServer() as App)
          .post('/admin/tables')
          .send(dto)
          .expect(400);

        const error = response.body as ErrorResponse;
        expect(error.message).toContain(
          'restaurantId must be an integer number',
        );
      });

      it('should return 400 for invalid capacity (less than 1)', async () => {
        const dto = {
          restaurantId: testRestaurant.id,
          title: 'Test Table',
          capacity: 0,
        };

        const response = await request(app.getHttpServer() as App)
          .post('/admin/tables')
          .send(dto)
          .expect(400);

        const error = response.body as ErrorResponse;
        expect(error.message).toContain('capacity must not be less than 1');
      });
    });

    describe('GET /admin/tables', () => {
      it('should return tables for a given restaurant', async () => {
        const response = await request(app.getHttpServer() as App)
          .get(`/admin/tables?restaurantId=${testRestaurant.id}`)
          .expect(200);

        const tables = response.body as TableResponse[];
        expect(Array.isArray(tables)).toBe(true);
        expect(tables.length).toBeGreaterThanOrEqual(2);
        expect(tables.every((t) => t.restaurantId === testRestaurant.id)).toBe(
          true,
        );
      });

      it('should return empty array for unknown restaurant', async () => {
        const fakeId = 999999;
        const response = await request(app.getHttpServer() as App)
          .get(`/admin/tables?restaurantId=${fakeId}`)
          .expect(200);

        expect(response.body).toEqual([]);
      });

      it('should return 400 when restaurantId is missing', async () => {
        await request(app.getHttpServer() as App)
          .get('/admin/tables')
          .expect(400);
      });
    });

    describe('GET /admin/tables/:id', () => {
      it('should return a table by id', async () => {
        const response = await request(app.getHttpServer() as App)
          .get(`/admin/tables/${testTables[0].id}`)
          .expect(200);

        const table = response.body as TableResponse;
        expect(table.id).toBe(testTables[0].id);
        expect(table.restaurantId).toBe(testRestaurant.id);
        expect(table.title).toBe('Admin Test Table 1');
      });

      it('should return 404 for non-existent table', async () => {
        const fakeId = 999999;
        const response = await request(app.getHttpServer() as App)
          .get(`/admin/tables/${fakeId}`)
          .expect(404);

        const error = response.body as ErrorResponse;
        expect(error.message).toContain('not found');
      });
    });

    describe('PUT /admin/tables/:id', () => {
      it('should update a table', async () => {
        const dto = {
          title: 'Updated Admin Test Table',
          capacity: 8,
        };

        const response = await request(app.getHttpServer() as App)
          .put(`/admin/tables/${testTables[0].id}`)
          .send(dto)
          .expect(200);

        const table = response.body as TableResponse;
        expect(table.id).toBe(testTables[0].id);
        expect(table.title).toBe('Updated Admin Test Table');
        expect(table.capacity).toBe(8);

        // Restore original values
        await request(app.getHttpServer() as App)
          .put(`/admin/tables/${testTables[0].id}`)
          .send({ title: 'Admin Test Table 1', capacity: 2 });
      });

      it('should return 404 for non-existent table', async () => {
        const fakeId = 999999;
        const response = await request(app.getHttpServer() as App)
          .put(`/admin/tables/${fakeId}`)
          .send({ title: 'Updated' })
          .expect(404);

        const error = response.body as ErrorResponse;
        expect(error.message).toContain('not found');
      });
    });

    describe('DELETE /admin/tables/:id', () => {
      it('should delete a table and cascade delete reservations', async () => {
        // Create a temporary table with a reservation
        const tableRepo = dataSource.getRepository(TableOrmEntity);
        const reservationRepo = dataSource.getRepository(ReservationOrmEntity);
        const guestRepo = dataSource.getRepository(GuestOrmEntity);

        const tempTable = await tableRepo.save({
          restaurantId: testRestaurant.id,
          title: 'Temp Table To Delete',
          capacity: 2,
        });

        const tempReservation = await reservationRepo.save({
          restaurantId: testRestaurant.id,
          tableId: tempTable.id,
        });

        await guestRepo.save({
          reservationId: tempReservation.id,
          firstName: 'Temp',
          lastName: 'Guest',
          age: 25,
          isOrganizer: true,
        });

        // Delete the table via API
        await request(app.getHttpServer() as App)
          .delete(`/admin/tables/${tempTable.id}`)
          .expect(200);

        // Verify table is deleted
        const deletedTable = await tableRepo.findOne({
          where: { id: tempTable.id },
        });
        expect(deletedTable).toBeNull();

        // Verify cascade delete of reservations
        const relatedReservations = await reservationRepo.find({
          where: { tableId: tempTable.id },
        });
        expect(relatedReservations).toHaveLength(0);
      });

      it('should return 404 for non-existent table', async () => {
        const fakeId = 999999;
        const response = await request(app.getHttpServer() as App)
          .delete(`/admin/tables/${fakeId}`)
          .expect(404);

        const error = response.body as ErrorResponse;
        expect(error.message).toContain('not found');
      });
    });
  });

  // ===========================================
  // MEAL TESTS
  // ===========================================

  describe('Admin Meal Endpoints', () => {
    describe('POST /admin/meals', () => {
      let createdMealId: number;

      afterAll(async () => {
        // Clean up created meal
        if (createdMealId) {
          const mealRepo = dataSource.getRepository(MealOrmEntity);
          await mealRepo.delete({ id: createdMealId });
        }
      });

      it('should create a meal', async () => {
        const dto = {
          restaurantId: testRestaurant.id,
          title: 'New Admin Meal',
          type: MealType.ENTRY,
          price: 12,
          requiredAge: null,
          imageUrl: 'https://example.com/new-meal.jpg',
        };

        const response = await request(app.getHttpServer() as App)
          .post('/admin/meals')
          .send(dto)
          .expect(201);

        const meal = response.body as MealResponse;
        createdMealId = meal.id;

        expect(meal.id).toBeDefined();
        expect(meal.restaurantId).toBe(testRestaurant.id);
        expect(meal.title).toBe('New Admin Meal');
        expect(meal.type).toBe(MealType.ENTRY);
        expect(meal.price).toBe(12);
      });

      it('should create a meal with age restriction', async () => {
        const dto = {
          restaurantId: testRestaurant.id,
          title: 'New Admin Cocktail',
          type: MealType.DRINK,
          price: 10,
          requiredAge: 21,
          imageUrl: 'https://example.com/cocktail.jpg',
        };

        const response = await request(app.getHttpServer() as App)
          .post('/admin/meals')
          .send(dto)
          .expect(201);

        const meal = response.body as MealResponse;
        expect(meal.requiredAge).toBe(21);

        // Clean up
        const mealRepo = dataSource.getRepository(MealOrmEntity);
        await mealRepo.delete({ id: meal.id });
      });

      it('should return 400 for invalid input (missing title)', async () => {
        const dto = {
          restaurantId: testRestaurant.id,
          type: MealType.ENTRY,
          price: 12,
          imageUrl: 'https://example.com/meal.jpg',
        };

        const response = await request(app.getHttpServer() as App)
          .post('/admin/meals')
          .send(dto)
          .expect(400);

        const error = response.body as ErrorResponse;
        expect(error.message).toContain('title must be a string');
      });

      it('should return 400 for invalid meal type', async () => {
        const dto = {
          restaurantId: testRestaurant.id,
          title: 'Invalid Meal',
          type: 'INVALID_TYPE',
          price: 12,
          imageUrl: 'https://example.com/meal.jpg',
        };

        const response = await request(app.getHttpServer() as App)
          .post('/admin/meals')
          .send(dto)
          .expect(400);

        const error = response.body as ErrorResponse;
        const messages = Array.isArray(error.message)
          ? error.message
          : [error.message];
        expect(
          messages.some((m) => m.includes('type must be one of the following')),
        ).toBe(true);
      });
    });

    describe('GET /admin/meals', () => {
      it('should return meals for a given restaurant', async () => {
        const response = await request(app.getHttpServer() as App)
          .get(`/admin/meals?restaurantId=${testRestaurant.id}`)
          .expect(200);

        const meals = response.body as MealResponse[];
        expect(Array.isArray(meals)).toBe(true);
        expect(meals.length).toBeGreaterThanOrEqual(4);
        expect(meals.every((m) => m.restaurantId === testRestaurant.id)).toBe(
          true,
        );
      });

      it('should return empty array for unknown restaurant', async () => {
        const fakeId = 999999;
        const response = await request(app.getHttpServer() as App)
          .get(`/admin/meals?restaurantId=${fakeId}`)
          .expect(200);

        expect(response.body).toEqual([]);
      });

      it('should return 400 when restaurantId is missing', async () => {
        await request(app.getHttpServer() as App)
          .get('/admin/meals')
          .expect(400);
      });
    });

    describe('GET /admin/meals/:id', () => {
      it('should return a meal by id', async () => {
        const response = await request(app.getHttpServer() as App)
          .get(`/admin/meals/${testMeals[0].id}`)
          .expect(200);

        const meal = response.body as MealResponse;
        expect(meal.id).toBe(testMeals[0].id);
        expect(meal.restaurantId).toBe(testRestaurant.id);
        expect(meal.title).toBe('Admin Test Entry');
      });

      it('should return 404 for non-existent meal', async () => {
        const fakeId = 999999;
        const response = await request(app.getHttpServer() as App)
          .get(`/admin/meals/${fakeId}`)
          .expect(404);

        const error = response.body as ErrorResponse;
        expect(error.message).toContain('not found');
      });
    });

    describe('PUT /admin/meals/:id', () => {
      it('should update a meal', async () => {
        const dto = {
          title: 'Updated Admin Test Entry',
          price: 15,
        };

        const response = await request(app.getHttpServer() as App)
          .put(`/admin/meals/${testMeals[0].id}`)
          .send(dto)
          .expect(200);

        const meal = response.body as MealResponse;
        expect(meal.id).toBe(testMeals[0].id);
        expect(meal.title).toBe('Updated Admin Test Entry');
        expect(meal.price).toBe(15);

        // Restore original values
        await request(app.getHttpServer() as App)
          .put(`/admin/meals/${testMeals[0].id}`)
          .send({ title: 'Admin Test Entry', price: 10 });
      });

      it('should return 404 for non-existent meal', async () => {
        const fakeId = 999999;
        const response = await request(app.getHttpServer() as App)
          .put(`/admin/meals/${fakeId}`)
          .send({ title: 'Updated' })
          .expect(404);

        const error = response.body as ErrorResponse;
        expect(error.message).toContain('not found');
      });
    });

    describe('DELETE /admin/meals/:id', () => {
      it('should delete a meal', async () => {
        // Create a temporary meal
        const mealRepo = dataSource.getRepository(MealOrmEntity);

        const tempMeal = await mealRepo.save({
          restaurantId: testRestaurant.id,
          title: 'Temp Meal To Delete',
          type: MealType.DESSERT,
          price: 5,
          requiredAge: null,
          imageUrl: 'https://example.com/temp.jpg',
        });

        // Delete the meal via API
        await request(app.getHttpServer() as App)
          .delete(`/admin/meals/${tempMeal.id}`)
          .expect(200);

        // Verify meal is deleted
        const deletedMeal = await mealRepo.findOne({
          where: { id: tempMeal.id },
        });
        expect(deletedMeal).toBeNull();
      });

      it('should return 404 for non-existent meal', async () => {
        const fakeId = 999999;
        const response = await request(app.getHttpServer() as App)
          .delete(`/admin/meals/${fakeId}`)
          .expect(404);

        const error = response.body as ErrorResponse;
        expect(error.message).toContain('not found');
      });
    });
  });

  // ===========================================
  // RESERVATION TESTS
  // ===========================================

  describe('Admin Reservation Endpoints', () => {
    let testReservationId: number;

    describe('POST /admin/reservations', () => {
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
              dessertId: testMeals[2].id,
            },
          ],
        };

        const response = await request(app.getHttpServer() as App)
          .post('/admin/reservations')
          .send(dto)
          .expect(201);

        const reservation = response.body as ReservationResponse;
        testReservationId = reservation.id;

        expect(reservation.id).toBeDefined();
        expect(reservation.restaurantId).toBe(testRestaurant.id);
        expect(reservation.tableId).toBe(testTables[0].id);
        expect(reservation.guests).toHaveLength(2);
        expect(reservation.createdAt).toBeDefined();

        const organizer = reservation.guests.find((g) => g.isOrganizer);
        expect(organizer?.firstName).toBe('John');
        expect(organizer?.meals.entry).toEqual({
          mealId: testMeals[0].id,
          quantity: 1,
        });
        expect(organizer?.meals.mainCourse).toEqual({
          mealId: testMeals[1].id,
          quantity: 1,
        });
      });

      it('should return 400 for invalid input (empty guests)', async () => {
        const dto = {
          restaurantId: testRestaurant.id,
          tableId: testTables[0].id,
          guests: [],
        };

        const response = await request(app.getHttpServer() as App)
          .post('/admin/reservations')
          .send(dto)
          .expect(400);

        const error = response.body as ErrorResponse;
        expect(error.message).toContain(
          'guests must contain at least 1 elements',
        );
      });

      it('should return 400 for invalid restaurantId', async () => {
        const dto = {
          restaurantId: 'not-a-number',
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

        const response = await request(app.getHttpServer() as App)
          .post('/admin/reservations')
          .send(dto)
          .expect(400);

        const error = response.body as ErrorResponse;
        expect(error.message).toContain(
          'restaurantId must be an integer number',
        );
      });
    });

    describe('GET /admin/reservations', () => {
      it('should return reservations for a given restaurant', async () => {
        const response = await request(app.getHttpServer() as App)
          .get(`/admin/reservations?restaurantId=${testRestaurant.id}`)
          .expect(200);

        const reservations = response.body as ReservationResponse[];
        expect(Array.isArray(reservations)).toBe(true);
        expect(reservations.length).toBeGreaterThanOrEqual(1);
        expect(
          reservations.every((r) => r.restaurantId === testRestaurant.id),
        ).toBe(true);
      });

      it('should return empty array for unknown restaurant', async () => {
        const fakeId = 999999;
        const response = await request(app.getHttpServer() as App)
          .get(`/admin/reservations?restaurantId=${fakeId}`)
          .expect(200);

        expect(response.body).toEqual([]);
      });

      it('should return 400 when restaurantId is missing', async () => {
        await request(app.getHttpServer() as App)
          .get('/admin/reservations')
          .expect(400);
      });
    });

    describe('GET /admin/reservations/:id', () => {
      it('should return a reservation by id with guests', async () => {
        const response = await request(app.getHttpServer() as App)
          .get(`/admin/reservations/${testReservationId}`)
          .expect(200);

        const reservation = response.body as ReservationResponse;
        expect(reservation.id).toBe(testReservationId);
        expect(reservation.restaurantId).toBe(testRestaurant.id);
        expect(reservation.guests).toBeDefined();
        expect(reservation.guests.length).toBeGreaterThanOrEqual(1);
      });

      it('should return 404 for non-existent reservation', async () => {
        const fakeId = 999999;
        const response = await request(app.getHttpServer() as App)
          .get(`/admin/reservations/${fakeId}`)
          .expect(404);

        const error = response.body as ErrorResponse;
        expect(error.message).toContain('not found');
      });
    });

    describe('PUT /admin/reservations/:id', () => {
      it('should update a reservation', async () => {
        const dto = {
          tableId: testTables[1].id,
        };

        const response = await request(app.getHttpServer() as App)
          .put(`/admin/reservations/${testReservationId}`)
          .send(dto)
          .expect(200);

        const reservation = response.body as ReservationResponse;
        expect(reservation.id).toBe(testReservationId);
        expect(reservation.tableId).toBe(testTables[1].id);

        // Restore original table
        await request(app.getHttpServer() as App)
          .put(`/admin/reservations/${testReservationId}`)
          .send({ tableId: testTables[0].id });
      });

      it('should update reservation guests', async () => {
        const dto = {
          guests: [
            {
              firstName: 'Updated',
              lastName: 'Guest',
              age: 35,
              isOrganizer: true,
            },
          ],
        };

        const response = await request(app.getHttpServer() as App)
          .put(`/admin/reservations/${testReservationId}`)
          .send(dto)
          .expect(200);

        const reservation = response.body as ReservationResponse;
        expect(reservation.guests).toHaveLength(1);
        expect(reservation.guests[0].firstName).toBe('Updated');
        expect(reservation.guests[0].age).toBe(35);
      });

      it('should return 404 for non-existent reservation', async () => {
        const fakeId = 999999;
        const response = await request(app.getHttpServer() as App)
          .put(`/admin/reservations/${fakeId}`)
          .send({ tableId: testTables[0].id })
          .expect(404);

        const error = response.body as ErrorResponse;
        expect(error.message).toContain('not found');
      });
    });

    describe('DELETE /admin/reservations/:id', () => {
      it('should delete a reservation', async () => {
        // Create a temporary reservation
        const reservationRepo = dataSource.getRepository(ReservationOrmEntity);
        const guestRepo = dataSource.getRepository(GuestOrmEntity);

        const tempReservation = await reservationRepo.save({
          restaurantId: testRestaurant.id,
          tableId: testTables[1].id,
        });

        await guestRepo.save({
          reservationId: tempReservation.id,
          firstName: 'Temp',
          lastName: 'Guest',
          age: 25,
          isOrganizer: true,
        });

        // Delete the reservation via API
        await request(app.getHttpServer() as App)
          .delete(`/admin/reservations/${tempReservation.id}`)
          .expect(200);

        // Verify reservation is deleted
        const deletedReservation = await reservationRepo.findOne({
          where: { id: tempReservation.id },
        });
        expect(deletedReservation).toBeNull();

        // Verify guests are also deleted
        const relatedGuests = await guestRepo.find({
          where: { reservationId: tempReservation.id },
        });
        expect(relatedGuests).toHaveLength(0);
      });

      it('should return 404 for non-existent reservation', async () => {
        const fakeId = 999999;
        const response = await request(app.getHttpServer() as App)
          .delete(`/admin/reservations/${fakeId}`)
          .expect(404);

        const error = response.body as ErrorResponse;
        expect(error.message).toContain('not found');
      });
    });

    // Cleanup test reservation at the end
    afterAll(async () => {
      if (testReservationId) {
        const guestRepo = dataSource.getRepository(GuestOrmEntity);
        const reservationRepo = dataSource.getRepository(ReservationOrmEntity);

        await guestRepo.delete({ reservationId: testReservationId });
        await reservationRepo.delete({ id: testReservationId });
      }
    });
  });
});
