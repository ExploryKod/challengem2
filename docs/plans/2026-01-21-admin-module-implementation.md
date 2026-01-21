# Admin Module Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add a separate `admin` NestJS module with full CRUD operations for restaurants, tables, meals, and reservations.

**Architecture:** New `admin` module under `back/src/modules/admin/` following Clean Architecture. Reuses domain entities, enums, ORM entities, and mappers from `ordering` module. All endpoints prefixed with `/admin`.

**Tech Stack:** NestJS, TypeORM, class-validator, Jest (unit tests), supertest (integration tests)

---

## Phase 1: Module Foundation & Restaurant CRUD

### Task 1: Create Admin Module Skeleton

**Files:**
- Create: `back/src/modules/admin/admin.module.ts`

**Step 1: Create the admin module file**

```typescript
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RestaurantOrmEntity } from '../ordering/infrastructure/persistence/orm-entities/restaurant.orm-entity';
import { TableOrmEntity } from '../ordering/infrastructure/persistence/orm-entities/table.orm-entity';
import { MealOrmEntity } from '../ordering/infrastructure/persistence/orm-entities/meal.orm-entity';
import { ReservationOrmEntity } from '../ordering/infrastructure/persistence/orm-entities/reservation.orm-entity';
import { GuestOrmEntity } from '../ordering/infrastructure/persistence/orm-entities/guest.orm-entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      RestaurantOrmEntity,
      TableOrmEntity,
      MealOrmEntity,
      ReservationOrmEntity,
      GuestOrmEntity,
    ]),
  ],
  controllers: [],
  providers: [],
})
export class AdminModule {}
```

**Step 2: Register AdminModule in AppModule**

Modify: `back/src/app.module.ts`

```typescript
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './shared/database/database.module';
import { OrderingModule } from './modules/ordering/ordering.module';
import { AdminModule } from './modules/admin/admin.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    OrderingModule,
    AdminModule,
  ],
})
export class AppModule {}
```

**Step 3: Verify application starts**

Run: `cd back && pnpm start:dev`
Expected: Application starts without errors

**Step 4: Commit**

```bash
git add back/src/modules/admin/admin.module.ts back/src/app.module.ts
git commit -m "feat(admin): create admin module skeleton"
```

---

### Task 2: Create Admin Restaurant Repository Port

**Files:**
- Create: `back/src/modules/admin/application/ports/admin-restaurant.repository.port.ts`

**Step 1: Create the port interface**

```typescript
import { Restaurant } from '../../../ordering/domain/entities/restaurant.entity';

export const ADMIN_RESTAURANT_REPOSITORY = Symbol('ADMIN_RESTAURANT_REPOSITORY');

export interface IAdminRestaurantRepository {
  findAll(): Promise<Restaurant[]>;
  findById(id: number): Promise<Restaurant | null>;
  create(restaurant: Omit<Restaurant, 'id'>): Promise<Restaurant>;
  update(id: number, restaurant: Partial<Omit<Restaurant, 'id'>>): Promise<Restaurant | null>;
  delete(id: number): Promise<boolean>;
}
```

**Step 2: Commit**

```bash
git add back/src/modules/admin/application/ports/admin-restaurant.repository.port.ts
git commit -m "feat(admin): add admin restaurant repository port"
```

---

### Task 3: Create In-Memory Admin Restaurant Repository (for testing)

**Files:**
- Create: `back/src/modules/admin/application/testing/stubs/in-memory-admin-restaurant.repository.ts`
- Create: `back/src/modules/admin/application/testing/stubs/index.ts`

**Step 1: Create the in-memory repository**

```typescript
import { Restaurant } from '../../../../ordering/domain/entities/restaurant.entity';
import type { IAdminRestaurantRepository } from '../../ports/admin-restaurant.repository.port';

export class InMemoryAdminRestaurantRepository implements IAdminRestaurantRepository {
  private restaurants: Restaurant[] = [];
  private nextId = 1;

  constructor(initialData: Restaurant[] = []) {
    this.restaurants = [...initialData];
    if (initialData.length > 0) {
      this.nextId = Math.max(...initialData.map((r) => r.id)) + 1;
    }
  }

  findAll(): Promise<Restaurant[]> {
    return Promise.resolve([...this.restaurants]);
  }

  findById(id: number): Promise<Restaurant | null> {
    const found = this.restaurants.find((r) => r.id === id) ?? null;
    return Promise.resolve(found);
  }

  create(data: Omit<Restaurant, 'id'>): Promise<Restaurant> {
    const restaurant = new Restaurant();
    restaurant.id = this.nextId++;
    restaurant.name = data.name;
    restaurant.type = data.type;
    restaurant.stars = data.stars;
    this.restaurants.push(restaurant);
    return Promise.resolve(restaurant);
  }

  update(id: number, data: Partial<Omit<Restaurant, 'id'>>): Promise<Restaurant | null> {
    const index = this.restaurants.findIndex((r) => r.id === id);
    if (index === -1) return Promise.resolve(null);

    const existing = this.restaurants[index];
    if (data.name !== undefined) existing.name = data.name;
    if (data.type !== undefined) existing.type = data.type;
    if (data.stars !== undefined) existing.stars = data.stars;

    return Promise.resolve(existing);
  }

  delete(id: number): Promise<boolean> {
    const index = this.restaurants.findIndex((r) => r.id === id);
    if (index === -1) return Promise.resolve(false);
    this.restaurants.splice(index, 1);
    return Promise.resolve(true);
  }
}
```

**Step 2: Create the index file**

```typescript
export { InMemoryAdminRestaurantRepository } from './in-memory-admin-restaurant.repository';
```

**Step 3: Commit**

```bash
git add back/src/modules/admin/application/testing/stubs/
git commit -m "feat(admin): add in-memory admin restaurant repository stub"
```

---

### Task 4: Create GetRestaurants Use Case (with TDD)

**Files:**
- Create: `back/src/modules/admin/application/use-cases/restaurant/get-restaurants.use-case.spec.ts`
- Create: `back/src/modules/admin/application/use-cases/restaurant/get-restaurants.use-case.ts`

**Step 1: Write the failing test**

```typescript
import { GetRestaurantsUseCase } from './get-restaurants.use-case';
import { InMemoryAdminRestaurantRepository } from '../../testing/stubs';
import { Restaurant } from '../../../../ordering/domain/entities/restaurant.entity';

describe('GetRestaurantsUseCase', () => {
  it('should return all restaurants', async () => {
    // Arrange
    const restaurant1: Restaurant = { id: 1, name: 'Bistro', type: 'French', stars: 3 };
    const restaurant2: Restaurant = { id: 2, name: 'Sushi', type: 'Japanese', stars: 4 };
    const repository = new InMemoryAdminRestaurantRepository([restaurant1, restaurant2]);
    const useCase = new GetRestaurantsUseCase(repository);

    // Act
    const result = await useCase.execute();

    // Assert
    expect(result).toHaveLength(2);
    expect(result).toEqual([restaurant1, restaurant2]);
  });

  it('should return empty array when no restaurants exist', async () => {
    // Arrange
    const repository = new InMemoryAdminRestaurantRepository([]);
    const useCase = new GetRestaurantsUseCase(repository);

    // Act
    const result = await useCase.execute();

    // Assert
    expect(result).toEqual([]);
  });
});
```

**Step 2: Run test to verify it fails**

Run: `cd back && pnpm test -- --testPathPattern="admin.*get-restaurants"`
Expected: FAIL - Cannot find module

**Step 3: Write minimal implementation**

```typescript
import { Injectable, Inject } from '@nestjs/common';
import { Restaurant } from '../../../../ordering/domain/entities/restaurant.entity';
import type { IAdminRestaurantRepository } from '../../ports/admin-restaurant.repository.port';
import { ADMIN_RESTAURANT_REPOSITORY } from '../../ports/admin-restaurant.repository.port';

@Injectable()
export class GetRestaurantsUseCase {
  constructor(
    @Inject(ADMIN_RESTAURANT_REPOSITORY)
    private readonly repository: IAdminRestaurantRepository,
  ) {}

  async execute(): Promise<Restaurant[]> {
    return this.repository.findAll();
  }
}
```

**Step 4: Run test to verify it passes**

Run: `cd back && pnpm test -- --testPathPattern="admin.*get-restaurants"`
Expected: PASS

**Step 5: Commit**

```bash
git add back/src/modules/admin/application/use-cases/restaurant/
git commit -m "feat(admin): add get-restaurants use case"
```

---

### Task 5: Create GetRestaurant Use Case (with TDD)

**Files:**
- Create: `back/src/modules/admin/application/use-cases/restaurant/get-restaurant.use-case.spec.ts`
- Create: `back/src/modules/admin/application/use-cases/restaurant/get-restaurant.use-case.ts`

**Step 1: Write the failing test**

```typescript
import { GetRestaurantUseCase } from './get-restaurant.use-case';
import { InMemoryAdminRestaurantRepository } from '../../testing/stubs';
import { Restaurant } from '../../../../ordering/domain/entities/restaurant.entity';

describe('GetRestaurantUseCase', () => {
  it('should return restaurant by id', async () => {
    // Arrange
    const restaurant: Restaurant = { id: 1, name: 'Bistro', type: 'French', stars: 3 };
    const repository = new InMemoryAdminRestaurantRepository([restaurant]);
    const useCase = new GetRestaurantUseCase(repository);

    // Act
    const result = await useCase.execute(1);

    // Assert
    expect(result).toEqual(restaurant);
  });

  it('should return null when restaurant not found', async () => {
    // Arrange
    const repository = new InMemoryAdminRestaurantRepository([]);
    const useCase = new GetRestaurantUseCase(repository);

    // Act
    const result = await useCase.execute(999);

    // Assert
    expect(result).toBeNull();
  });
});
```

**Step 2: Run test to verify it fails**

Run: `cd back && pnpm test -- --testPathPattern="admin.*get-restaurant.use-case.spec"`
Expected: FAIL

**Step 3: Write minimal implementation**

```typescript
import { Injectable, Inject } from '@nestjs/common';
import { Restaurant } from '../../../../ordering/domain/entities/restaurant.entity';
import type { IAdminRestaurantRepository } from '../../ports/admin-restaurant.repository.port';
import { ADMIN_RESTAURANT_REPOSITORY } from '../../ports/admin-restaurant.repository.port';

@Injectable()
export class GetRestaurantUseCase {
  constructor(
    @Inject(ADMIN_RESTAURANT_REPOSITORY)
    private readonly repository: IAdminRestaurantRepository,
  ) {}

  async execute(id: number): Promise<Restaurant | null> {
    return this.repository.findById(id);
  }
}
```

**Step 4: Run test to verify it passes**

Run: `cd back && pnpm test -- --testPathPattern="admin.*get-restaurant.use-case.spec"`
Expected: PASS

**Step 5: Commit**

```bash
git add back/src/modules/admin/application/use-cases/restaurant/get-restaurant*
git commit -m "feat(admin): add get-restaurant use case"
```

---

### Task 6: Create CreateRestaurant Use Case (with TDD)

**Files:**
- Create: `back/src/modules/admin/application/use-cases/restaurant/create-restaurant.use-case.spec.ts`
- Create: `back/src/modules/admin/application/use-cases/restaurant/create-restaurant.use-case.ts`

**Step 1: Write the failing test**

```typescript
import { CreateRestaurantUseCase } from './create-restaurant.use-case';
import { InMemoryAdminRestaurantRepository } from '../../testing/stubs';

describe('CreateRestaurantUseCase', () => {
  it('should create a restaurant and return it with id', async () => {
    // Arrange
    const repository = new InMemoryAdminRestaurantRepository([]);
    const useCase = new CreateRestaurantUseCase(repository);
    const input = { name: 'New Bistro', type: 'French', stars: 4 };

    // Act
    const result = await useCase.execute(input);

    // Assert
    expect(result.id).toBeDefined();
    expect(result.name).toBe('New Bistro');
    expect(result.type).toBe('French');
    expect(result.stars).toBe(4);
  });

  it('should persist the created restaurant', async () => {
    // Arrange
    const repository = new InMemoryAdminRestaurantRepository([]);
    const useCase = new CreateRestaurantUseCase(repository);
    const input = { name: 'New Bistro', type: 'French', stars: 4 };

    // Act
    const created = await useCase.execute(input);
    const found = await repository.findById(created.id);

    // Assert
    expect(found).toEqual(created);
  });
});
```

**Step 2: Run test to verify it fails**

Run: `cd back && pnpm test -- --testPathPattern="admin.*create-restaurant"`
Expected: FAIL

**Step 3: Write minimal implementation**

```typescript
import { Injectable, Inject } from '@nestjs/common';
import { Restaurant } from '../../../../ordering/domain/entities/restaurant.entity';
import type { IAdminRestaurantRepository } from '../../ports/admin-restaurant.repository.port';
import { ADMIN_RESTAURANT_REPOSITORY } from '../../ports/admin-restaurant.repository.port';

export interface CreateRestaurantInput {
  name: string;
  type: string;
  stars: number;
}

@Injectable()
export class CreateRestaurantUseCase {
  constructor(
    @Inject(ADMIN_RESTAURANT_REPOSITORY)
    private readonly repository: IAdminRestaurantRepository,
  ) {}

  async execute(input: CreateRestaurantInput): Promise<Restaurant> {
    return this.repository.create(input);
  }
}
```

**Step 4: Run test to verify it passes**

Run: `cd back && pnpm test -- --testPathPattern="admin.*create-restaurant"`
Expected: PASS

**Step 5: Commit**

```bash
git add back/src/modules/admin/application/use-cases/restaurant/create-restaurant*
git commit -m "feat(admin): add create-restaurant use case"
```

---

### Task 7: Create UpdateRestaurant Use Case (with TDD)

**Files:**
- Create: `back/src/modules/admin/application/use-cases/restaurant/update-restaurant.use-case.spec.ts`
- Create: `back/src/modules/admin/application/use-cases/restaurant/update-restaurant.use-case.ts`

**Step 1: Write the failing test**

```typescript
import { UpdateRestaurantUseCase } from './update-restaurant.use-case';
import { InMemoryAdminRestaurantRepository } from '../../testing/stubs';
import { Restaurant } from '../../../../ordering/domain/entities/restaurant.entity';

describe('UpdateRestaurantUseCase', () => {
  it('should update restaurant and return updated entity', async () => {
    // Arrange
    const restaurant: Restaurant = { id: 1, name: 'Old Name', type: 'French', stars: 3 };
    const repository = new InMemoryAdminRestaurantRepository([restaurant]);
    const useCase = new UpdateRestaurantUseCase(repository);

    // Act
    const result = await useCase.execute(1, { name: 'New Name', stars: 5 });

    // Assert
    expect(result).not.toBeNull();
    expect(result!.name).toBe('New Name');
    expect(result!.type).toBe('French'); // unchanged
    expect(result!.stars).toBe(5);
  });

  it('should return null when restaurant not found', async () => {
    // Arrange
    const repository = new InMemoryAdminRestaurantRepository([]);
    const useCase = new UpdateRestaurantUseCase(repository);

    // Act
    const result = await useCase.execute(999, { name: 'New Name' });

    // Assert
    expect(result).toBeNull();
  });
});
```

**Step 2: Run test to verify it fails**

Run: `cd back && pnpm test -- --testPathPattern="admin.*update-restaurant"`
Expected: FAIL

**Step 3: Write minimal implementation**

```typescript
import { Injectable, Inject } from '@nestjs/common';
import { Restaurant } from '../../../../ordering/domain/entities/restaurant.entity';
import type { IAdminRestaurantRepository } from '../../ports/admin-restaurant.repository.port';
import { ADMIN_RESTAURANT_REPOSITORY } from '../../ports/admin-restaurant.repository.port';

export interface UpdateRestaurantInput {
  name?: string;
  type?: string;
  stars?: number;
}

@Injectable()
export class UpdateRestaurantUseCase {
  constructor(
    @Inject(ADMIN_RESTAURANT_REPOSITORY)
    private readonly repository: IAdminRestaurantRepository,
  ) {}

  async execute(id: number, input: UpdateRestaurantInput): Promise<Restaurant | null> {
    return this.repository.update(id, input);
  }
}
```

**Step 4: Run test to verify it passes**

Run: `cd back && pnpm test -- --testPathPattern="admin.*update-restaurant"`
Expected: PASS

**Step 5: Commit**

```bash
git add back/src/modules/admin/application/use-cases/restaurant/update-restaurant*
git commit -m "feat(admin): add update-restaurant use case"
```

---

### Task 8: Create DeleteRestaurant Use Case (with TDD)

**Files:**
- Create: `back/src/modules/admin/application/use-cases/restaurant/delete-restaurant.use-case.spec.ts`
- Create: `back/src/modules/admin/application/use-cases/restaurant/delete-restaurant.use-case.ts`

**Step 1: Write the failing test**

```typescript
import { DeleteRestaurantUseCase } from './delete-restaurant.use-case';
import { InMemoryAdminRestaurantRepository } from '../../testing/stubs';
import { Restaurant } from '../../../../ordering/domain/entities/restaurant.entity';

describe('DeleteRestaurantUseCase', () => {
  it('should delete restaurant and return true', async () => {
    // Arrange
    const restaurant: Restaurant = { id: 1, name: 'Bistro', type: 'French', stars: 3 };
    const repository = new InMemoryAdminRestaurantRepository([restaurant]);
    const useCase = new DeleteRestaurantUseCase(repository);

    // Act
    const result = await useCase.execute(1);

    // Assert
    expect(result).toBe(true);
    expect(await repository.findById(1)).toBeNull();
  });

  it('should return false when restaurant not found', async () => {
    // Arrange
    const repository = new InMemoryAdminRestaurantRepository([]);
    const useCase = new DeleteRestaurantUseCase(repository);

    // Act
    const result = await useCase.execute(999);

    // Assert
    expect(result).toBe(false);
  });
});
```

**Step 2: Run test to verify it fails**

Run: `cd back && pnpm test -- --testPathPattern="admin.*delete-restaurant"`
Expected: FAIL

**Step 3: Write minimal implementation**

```typescript
import { Injectable, Inject } from '@nestjs/common';
import type { IAdminRestaurantRepository } from '../../ports/admin-restaurant.repository.port';
import { ADMIN_RESTAURANT_REPOSITORY } from '../../ports/admin-restaurant.repository.port';

@Injectable()
export class DeleteRestaurantUseCase {
  constructor(
    @Inject(ADMIN_RESTAURANT_REPOSITORY)
    private readonly repository: IAdminRestaurantRepository,
  ) {}

  async execute(id: number): Promise<boolean> {
    return this.repository.delete(id);
  }
}
```

**Step 4: Run test to verify it passes**

Run: `cd back && pnpm test -- --testPathPattern="admin.*delete-restaurant"`
Expected: PASS

**Step 5: Commit**

```bash
git add back/src/modules/admin/application/use-cases/restaurant/delete-restaurant*
git commit -m "feat(admin): add delete-restaurant use case"
```

---

### Task 9: Create Restaurant DTOs

**Files:**
- Create: `back/src/modules/admin/infrastructure/http/dtos/create-restaurant.dto.ts`
- Create: `back/src/modules/admin/infrastructure/http/dtos/update-restaurant.dto.ts`

**Step 1: Create CreateRestaurantDto**

```typescript
import { IsString, IsInt, Min, Max } from 'class-validator';

export class CreateRestaurantDto {
  @IsString()
  name: string;

  @IsString()
  type: string;

  @IsInt()
  @Min(1)
  @Max(5)
  stars: number;
}
```

**Step 2: Create UpdateRestaurantDto**

```typescript
import { IsString, IsInt, Min, Max, IsOptional } from 'class-validator';

export class UpdateRestaurantDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  type?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(5)
  stars?: number;
}
```

**Step 3: Commit**

```bash
git add back/src/modules/admin/infrastructure/http/dtos/
git commit -m "feat(admin): add restaurant DTOs"
```

---

### Task 10: Create Admin Restaurant Repository Implementation

**Files:**
- Create: `back/src/modules/admin/infrastructure/persistence/repositories/admin-restaurant.repository.ts`

**Step 1: Create the repository implementation**

```typescript
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import type { IAdminRestaurantRepository } from '../../../application/ports/admin-restaurant.repository.port';
import { Restaurant } from '../../../../ordering/domain/entities/restaurant.entity';
import { RestaurantOrmEntity } from '../../../../ordering/infrastructure/persistence/orm-entities/restaurant.orm-entity';
import { RestaurantMapper } from '../../../../ordering/infrastructure/persistence/mappers/restaurant.mapper';

@Injectable()
export class AdminRestaurantRepository implements IAdminRestaurantRepository {
  constructor(
    @InjectRepository(RestaurantOrmEntity)
    private readonly repository: Repository<RestaurantOrmEntity>,
  ) {}

  async findAll(): Promise<Restaurant[]> {
    const entities = await this.repository.find();
    return entities.map((entity) => RestaurantMapper.toDomain(entity));
  }

  async findById(id: number): Promise<Restaurant | null> {
    const entity = await this.repository.findOne({ where: { id } });
    return entity ? RestaurantMapper.toDomain(entity) : null;
  }

  async create(data: Omit<Restaurant, 'id'>): Promise<Restaurant> {
    const ormEntity = new RestaurantOrmEntity();
    ormEntity.name = data.name;
    ormEntity.type = data.type;
    ormEntity.stars = data.stars;
    const saved = await this.repository.save(ormEntity);
    return RestaurantMapper.toDomain(saved);
  }

  async update(id: number, data: Partial<Omit<Restaurant, 'id'>>): Promise<Restaurant | null> {
    const existing = await this.repository.findOne({ where: { id } });
    if (!existing) return null;

    if (data.name !== undefined) existing.name = data.name;
    if (data.type !== undefined) existing.type = data.type;
    if (data.stars !== undefined) existing.stars = data.stars;

    const saved = await this.repository.save(existing);
    return RestaurantMapper.toDomain(saved);
  }

  async delete(id: number): Promise<boolean> {
    // Cascade delete: tables and meals will be deleted due to FK constraints
    // First delete related tables and meals
    const tableRepo = this.repository.manager.getRepository('tables');
    const mealRepo = this.repository.manager.getRepository('meals');
    const reservationRepo = this.repository.manager.getRepository('reservations');
    const guestRepo = this.repository.manager.getRepository('guests');

    // Find and delete reservations for this restaurant's tables
    const reservations = await reservationRepo.find({ where: { restaurantId: id } });
    for (const reservation of reservations) {
      await guestRepo.delete({ reservationId: reservation.id });
    }
    await reservationRepo.delete({ restaurantId: id });

    // Delete tables and meals
    await tableRepo.delete({ restaurantId: id });
    await mealRepo.delete({ restaurantId: id });

    // Finally delete the restaurant
    const result = await this.repository.delete(id);
    return (result.affected ?? 0) > 0;
  }
}
```

**Step 2: Commit**

```bash
git add back/src/modules/admin/infrastructure/persistence/repositories/admin-restaurant.repository.ts
git commit -m "feat(admin): add admin restaurant repository implementation"
```

---

### Task 11: Create Admin Restaurant Controller

**Files:**
- Create: `back/src/modules/admin/infrastructure/http/controllers/admin-restaurant.controller.ts`

**Step 1: Create the controller**

```typescript
import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  ParseIntPipe,
  NotFoundException,
} from '@nestjs/common';
import { GetRestaurantsUseCase } from '../../../application/use-cases/restaurant/get-restaurants.use-case';
import { GetRestaurantUseCase } from '../../../application/use-cases/restaurant/get-restaurant.use-case';
import { CreateRestaurantUseCase } from '../../../application/use-cases/restaurant/create-restaurant.use-case';
import { UpdateRestaurantUseCase } from '../../../application/use-cases/restaurant/update-restaurant.use-case';
import { DeleteRestaurantUseCase } from '../../../application/use-cases/restaurant/delete-restaurant.use-case';
import { CreateRestaurantDto } from '../dtos/create-restaurant.dto';
import { UpdateRestaurantDto } from '../dtos/update-restaurant.dto';
import { Restaurant } from '../../../../ordering/domain/entities/restaurant.entity';

@Controller('admin/restaurants')
export class AdminRestaurantController {
  constructor(
    private readonly getRestaurantsUseCase: GetRestaurantsUseCase,
    private readonly getRestaurantUseCase: GetRestaurantUseCase,
    private readonly createRestaurantUseCase: CreateRestaurantUseCase,
    private readonly updateRestaurantUseCase: UpdateRestaurantUseCase,
    private readonly deleteRestaurantUseCase: DeleteRestaurantUseCase,
  ) {}

  @Get()
  async findAll(): Promise<Restaurant[]> {
    return this.getRestaurantsUseCase.execute();
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Restaurant> {
    const restaurant = await this.getRestaurantUseCase.execute(id);
    if (!restaurant) {
      throw new NotFoundException(`Restaurant with id ${id} not found`);
    }
    return restaurant;
  }

  @Post()
  async create(@Body() dto: CreateRestaurantDto): Promise<Restaurant> {
    return this.createRestaurantUseCase.execute(dto);
  }

  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateRestaurantDto,
  ): Promise<Restaurant> {
    const restaurant = await this.updateRestaurantUseCase.execute(id, dto);
    if (!restaurant) {
      throw new NotFoundException(`Restaurant with id ${id} not found`);
    }
    return restaurant;
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    const deleted = await this.deleteRestaurantUseCase.execute(id);
    if (!deleted) {
      throw new NotFoundException(`Restaurant with id ${id} not found`);
    }
  }
}
```

**Step 2: Commit**

```bash
git add back/src/modules/admin/infrastructure/http/controllers/admin-restaurant.controller.ts
git commit -m "feat(admin): add admin restaurant controller"
```

---

### Task 12: Wire Up Restaurant CRUD in Admin Module

**Files:**
- Modify: `back/src/modules/admin/admin.module.ts`

**Step 1: Update the admin module with all providers**

```typescript
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// ORM Entities (shared from ordering)
import { RestaurantOrmEntity } from '../ordering/infrastructure/persistence/orm-entities/restaurant.orm-entity';
import { TableOrmEntity } from '../ordering/infrastructure/persistence/orm-entities/table.orm-entity';
import { MealOrmEntity } from '../ordering/infrastructure/persistence/orm-entities/meal.orm-entity';
import { ReservationOrmEntity } from '../ordering/infrastructure/persistence/orm-entities/reservation.orm-entity';
import { GuestOrmEntity } from '../ordering/infrastructure/persistence/orm-entities/guest.orm-entity';

// Ports
import { ADMIN_RESTAURANT_REPOSITORY } from './application/ports/admin-restaurant.repository.port';

// Repositories
import { AdminRestaurantRepository } from './infrastructure/persistence/repositories/admin-restaurant.repository';

// Use Cases - Restaurant
import { GetRestaurantsUseCase } from './application/use-cases/restaurant/get-restaurants.use-case';
import { GetRestaurantUseCase } from './application/use-cases/restaurant/get-restaurant.use-case';
import { CreateRestaurantUseCase } from './application/use-cases/restaurant/create-restaurant.use-case';
import { UpdateRestaurantUseCase } from './application/use-cases/restaurant/update-restaurant.use-case';
import { DeleteRestaurantUseCase } from './application/use-cases/restaurant/delete-restaurant.use-case';

// Controllers
import { AdminRestaurantController } from './infrastructure/http/controllers/admin-restaurant.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      RestaurantOrmEntity,
      TableOrmEntity,
      MealOrmEntity,
      ReservationOrmEntity,
      GuestOrmEntity,
    ]),
  ],
  controllers: [AdminRestaurantController],
  providers: [
    // Repositories
    {
      provide: ADMIN_RESTAURANT_REPOSITORY,
      useClass: AdminRestaurantRepository,
    },
    // Use Cases - Restaurant
    GetRestaurantsUseCase,
    GetRestaurantUseCase,
    CreateRestaurantUseCase,
    UpdateRestaurantUseCase,
    DeleteRestaurantUseCase,
  ],
})
export class AdminModule {}
```

**Step 2: Verify application starts**

Run: `cd back && pnpm start:dev`
Expected: Application starts without errors

**Step 3: Run all admin tests**

Run: `cd back && pnpm test -- --testPathPattern="admin"`
Expected: All tests pass

**Step 4: Commit**

```bash
git add back/src/modules/admin/admin.module.ts
git commit -m "feat(admin): wire up restaurant CRUD in admin module"
```

---

## Phase 2: Table CRUD

### Task 13: Create Admin Table Repository Port

**Files:**
- Create: `back/src/modules/admin/application/ports/admin-table.repository.port.ts`

**Step 1: Create the port interface**

```typescript
import { Table } from '../../../ordering/domain/entities/table.entity';

export const ADMIN_TABLE_REPOSITORY = Symbol('ADMIN_TABLE_REPOSITORY');

export interface IAdminTableRepository {
  findByRestaurantId(restaurantId: number): Promise<Table[]>;
  findById(id: number): Promise<Table | null>;
  create(table: Omit<Table, 'id'>): Promise<Table>;
  update(id: number, table: Partial<Omit<Table, 'id'>>): Promise<Table | null>;
  delete(id: number): Promise<boolean>;
}
```

**Step 2: Commit**

```bash
git add back/src/modules/admin/application/ports/admin-table.repository.port.ts
git commit -m "feat(admin): add admin table repository port"
```

---

### Task 14: Create In-Memory Admin Table Repository

**Files:**
- Create: `back/src/modules/admin/application/testing/stubs/in-memory-admin-table.repository.ts`
- Modify: `back/src/modules/admin/application/testing/stubs/index.ts`

**Step 1: Create the in-memory repository**

```typescript
import { Table } from '../../../../ordering/domain/entities/table.entity';
import type { IAdminTableRepository } from '../../ports/admin-table.repository.port';

export class InMemoryAdminTableRepository implements IAdminTableRepository {
  private tables: Table[] = [];
  private nextId = 1;

  constructor(initialData: Table[] = []) {
    this.tables = [...initialData];
    if (initialData.length > 0) {
      this.nextId = Math.max(...initialData.map((t) => t.id)) + 1;
    }
  }

  findByRestaurantId(restaurantId: number): Promise<Table[]> {
    const found = this.tables.filter((t) => t.restaurantId === restaurantId);
    return Promise.resolve([...found]);
  }

  findById(id: number): Promise<Table | null> {
    const found = this.tables.find((t) => t.id === id) ?? null;
    return Promise.resolve(found);
  }

  create(data: Omit<Table, 'id'>): Promise<Table> {
    const table = new Table();
    table.id = this.nextId++;
    table.restaurantId = data.restaurantId;
    table.title = data.title;
    table.capacity = data.capacity;
    this.tables.push(table);
    return Promise.resolve(table);
  }

  update(id: number, data: Partial<Omit<Table, 'id'>>): Promise<Table | null> {
    const index = this.tables.findIndex((t) => t.id === id);
    if (index === -1) return Promise.resolve(null);

    const existing = this.tables[index];
    if (data.restaurantId !== undefined) existing.restaurantId = data.restaurantId;
    if (data.title !== undefined) existing.title = data.title;
    if (data.capacity !== undefined) existing.capacity = data.capacity;

    return Promise.resolve(existing);
  }

  delete(id: number): Promise<boolean> {
    const index = this.tables.findIndex((t) => t.id === id);
    if (index === -1) return Promise.resolve(false);
    this.tables.splice(index, 1);
    return Promise.resolve(true);
  }
}
```

**Step 2: Update index.ts**

```typescript
export { InMemoryAdminRestaurantRepository } from './in-memory-admin-restaurant.repository';
export { InMemoryAdminTableRepository } from './in-memory-admin-table.repository';
```

**Step 3: Commit**

```bash
git add back/src/modules/admin/application/testing/stubs/
git commit -m "feat(admin): add in-memory admin table repository stub"
```

---

### Task 15: Create Table Use Cases (with TDD)

**Files:**
- Create: `back/src/modules/admin/application/use-cases/table/get-tables.use-case.spec.ts`
- Create: `back/src/modules/admin/application/use-cases/table/get-tables.use-case.ts`
- Create: `back/src/modules/admin/application/use-cases/table/get-table.use-case.spec.ts`
- Create: `back/src/modules/admin/application/use-cases/table/get-table.use-case.ts`
- Create: `back/src/modules/admin/application/use-cases/table/create-table.use-case.spec.ts`
- Create: `back/src/modules/admin/application/use-cases/table/create-table.use-case.ts`
- Create: `back/src/modules/admin/application/use-cases/table/update-table.use-case.spec.ts`
- Create: `back/src/modules/admin/application/use-cases/table/update-table.use-case.ts`
- Create: `back/src/modules/admin/application/use-cases/table/delete-table.use-case.spec.ts`
- Create: `back/src/modules/admin/application/use-cases/table/delete-table.use-case.ts`

Follow the same TDD pattern as Restaurant use cases. Each use case follows RED-GREEN-REFACTOR:
1. Write failing test
2. Run to verify failure
3. Write minimal implementation
4. Run to verify pass
5. Commit

**Commit after completing all table use cases:**

```bash
git add back/src/modules/admin/application/use-cases/table/
git commit -m "feat(admin): add table CRUD use cases"
```

---

### Task 16: Create Table DTOs, Repository, and Controller

**Files:**
- Create: `back/src/modules/admin/infrastructure/http/dtos/create-table.dto.ts`
- Create: `back/src/modules/admin/infrastructure/http/dtos/update-table.dto.ts`
- Create: `back/src/modules/admin/infrastructure/persistence/repositories/admin-table.repository.ts`
- Create: `back/src/modules/admin/infrastructure/http/controllers/admin-table.controller.ts`

Follow the same patterns as Restaurant. Controller route: `admin/tables`

**Commit:**

```bash
git add back/src/modules/admin/infrastructure/
git commit -m "feat(admin): add table DTOs, repository, and controller"
```

---

### Task 17: Wire Up Table CRUD in Admin Module

Update `admin.module.ts` to include Table providers and controller.

**Commit:**

```bash
git add back/src/modules/admin/admin.module.ts
git commit -m "feat(admin): wire up table CRUD in admin module"
```

---

## Phase 3: Meal CRUD

### Task 18-22: Meal CRUD (Same Pattern as Table)

Follow identical pattern for Meal:
- Port: `admin-meal.repository.port.ts`
- Stub: `in-memory-admin-meal.repository.ts`
- Use Cases: get-meals, get-meal, create-meal, update-meal, delete-meal
- DTOs: create-meal.dto.ts, update-meal.dto.ts
- Repository: admin-meal.repository.ts
- Controller: admin-meal.controller.ts (route: `admin/meals`)

**Commits after each major step.**

---

## Phase 4: Reservation CRUD

### Task 23-27: Reservation CRUD (Same Pattern)

Follow identical pattern for Reservation:
- Port: `admin-reservation.repository.port.ts`
- Stub: `in-memory-admin-reservation.repository.ts`
- Use Cases: get-reservations, get-reservation, create-reservation, update-reservation, delete-reservation
- DTOs: create-reservation.dto.ts, update-reservation.dto.ts
- Repository: admin-reservation.repository.ts
- Controller: admin-reservation.controller.ts (route: `admin/reservations`)

**Note:** Reservation includes nested Guest entities. The create/update DTOs should handle guest data similar to the existing `CreateReservationDto` in ordering module.

**Commits after each major step.**

---

## Phase 5: Integration Tests

### Task 28: Create Admin Controllers Integration Tests

**Files:**
- Create: `back/src/modules/admin/infrastructure/http/controllers/__tests__/admin-controllers.integration.spec.ts`

**Step 1: Write comprehensive integration tests**

Test all CRUD operations for all entities:
- POST /admin/restaurants (create)
- GET /admin/restaurants (list)
- GET /admin/restaurants/:id (get one)
- PUT /admin/restaurants/:id (update)
- DELETE /admin/restaurants/:id (delete with cascade)

Repeat for tables, meals, and reservations.

Follow the pattern from `back/src/modules/ordering/infrastructure/http/controllers/__tests__/controllers.integration.spec.ts`.

**Step 2: Run integration tests**

Run: `cd back && pnpm test -- --testPathPattern="admin-controllers.integration"`
Expected: All tests pass

**Step 3: Commit**

```bash
git add back/src/modules/admin/infrastructure/http/controllers/__tests__/
git commit -m "test(admin): add integration tests for admin controllers"
```

---

## Phase 6: Final Verification

### Task 29: Run All Tests and Verify

**Step 1: Run all tests**

Run: `cd back && pnpm test`
Expected: All tests pass

**Step 2: Run linter**

Run: `cd back && pnpm lint`
Expected: No errors

**Step 3: Build**

Run: `cd back && pnpm build`
Expected: Build succeeds

**Step 4: Manual verification**

Start the server and test endpoints manually:
```bash
cd back && pnpm start:dev

# Test endpoints
curl http://localhost:3000/admin/restaurants
curl -X POST http://localhost:3000/admin/restaurants -H "Content-Type: application/json" -d '{"name":"Test","type":"French","stars":4}'
```

**Step 5: Final commit**

```bash
git add .
git commit -m "feat(admin): complete admin module implementation"
```

---

## Summary

| Phase | Tasks | Description |
|-------|-------|-------------|
| 1 | 1-12 | Module foundation + Restaurant CRUD |
| 2 | 13-17 | Table CRUD |
| 3 | 18-22 | Meal CRUD |
| 4 | 23-27 | Reservation CRUD |
| 5 | 28 | Integration tests |
| 6 | 29 | Final verification |

**Total estimated tasks:** 29 bite-sized tasks

**Key patterns:**
- TDD for all use cases (RED-GREEN-REFACTOR)
- Frequent atomic commits
- Reuse domain entities, ORM entities, and mappers from ordering module
- Separate admin module with its own ports, use cases, and infrastructure
