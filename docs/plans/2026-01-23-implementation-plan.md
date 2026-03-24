# Terminal Flow & System Enhancements Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Implement a luxury "Digital Concierge" terminal flow, fix order module bugs, enhance backoffice with menus/reservations management, add QR codes, and build a React Native staff app.

**Architecture:** Clean Architecture with Hexagonal pattern. Backend uses NestJS + TypeORM. Frontend uses Next.js + Redux Toolkit. Mobile uses React Native + Expo with same architecture patterns.

**Tech Stack:** NestJS, TypeORM, PostgreSQL, Next.js, Redux Toolkit, React Native, Expo, qrcode.react, Lucide icons

---

## Phase 1: Backend Foundation

### Task 1.1: Add ReservationStatus Enum

**Files:**
- Create: `back/src/modules/ordering/domain/enums/reservation-status.enum.ts`

**Step 1: Create the enum file**

```typescript
// back/src/modules/ordering/domain/enums/reservation-status.enum.ts
export enum ReservationStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  SEATED = 'SEATED',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}
```

**Step 2: Commit**

```bash
git add back/src/modules/ordering/domain/enums/reservation-status.enum.ts
git commit -m "feat(ordering): add ReservationStatus enum"
```

---

### Task 1.2: Update Reservation Entity

**Files:**
- Modify: `back/src/modules/ordering/domain/entities/reservation.entity.ts`

**Step 1: Update the entity**

```typescript
// back/src/modules/ordering/domain/entities/reservation.entity.ts
import { Guest } from './guest.entity';
import { ReservationStatus } from '../enums/reservation-status.enum';

export class Reservation {
  id: number;
  restaurantId: number;
  tableId: number;
  guests: Guest[];
  status: ReservationStatus;
  reservationCode: string;
  notes: string | null;
  createdAt: Date;
  updatedAt: Date;
}
```

**Step 2: Commit**

```bash
git add back/src/modules/ordering/domain/entities/reservation.entity.ts
git commit -m "feat(ordering): add status, reservationCode, notes to Reservation entity"
```

---

### Task 1.3: Update Reservation ORM Entity

**Files:**
- Modify: `back/src/modules/ordering/infrastructure/persistence/orm-entities/reservation.orm-entity.ts`

**Step 1: Update the ORM entity**

```typescript
// back/src/modules/ordering/infrastructure/persistence/orm-entities/reservation.orm-entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { RestaurantOrmEntity } from './restaurant.orm-entity';
import { TableOrmEntity } from './table.orm-entity';
import { GuestOrmEntity } from './guest.orm-entity';
import { ReservationStatus } from '../../../domain/enums/reservation-status.enum';

@Entity('reservations')
export class ReservationOrmEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'restaurant_id' })
  restaurantId: number;

  @Column({ name: 'table_id' })
  tableId: number;

  @Column({
    type: 'enum',
    enum: ReservationStatus,
    default: ReservationStatus.PENDING,
  })
  status: ReservationStatus;

  @Column({ name: 'reservation_code', length: 8 })
  reservationCode: string;

  @Column({ type: 'text', nullable: true })
  notes: string | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ManyToOne(() => RestaurantOrmEntity)
  @JoinColumn({ name: 'restaurant_id' })
  restaurant: RestaurantOrmEntity;

  @ManyToOne(() => TableOrmEntity)
  @JoinColumn({ name: 'table_id' })
  table: TableOrmEntity;

  @OneToMany(() => GuestOrmEntity, (guest) => guest.reservation, {
    cascade: true,
  })
  guests: GuestOrmEntity[];
}
```

**Step 2: Commit**

```bash
git add back/src/modules/ordering/infrastructure/persistence/orm-entities/reservation.orm-entity.ts
git commit -m "feat(ordering): add status, reservationCode, notes, updatedAt to ReservationOrmEntity"
```

---

### Task 1.4: Update Reservation Mapper

**Files:**
- Modify: `back/src/modules/ordering/infrastructure/persistence/mappers/reservation.mapper.ts`

**Step 1: Read current mapper to understand structure**

Check if file exists at `back/src/modules/ordering/infrastructure/persistence/mappers/reservation.mapper.ts`. If not, create it.

**Step 2: Create/Update the mapper**

```typescript
// back/src/modules/ordering/infrastructure/persistence/mappers/reservation.mapper.ts
import { Reservation } from '../../../domain/entities/reservation.entity';
import { ReservationOrmEntity } from '../orm-entities/reservation.orm-entity';
import { GuestMapper } from './guest.mapper';
import { ReservationStatus } from '../../../domain/enums/reservation-status.enum';

export class ReservationMapper {
  static toDomain(orm: ReservationOrmEntity): Reservation {
    const reservation = new Reservation();
    reservation.id = orm.id;
    reservation.restaurantId = orm.restaurantId;
    reservation.tableId = orm.tableId;
    reservation.status = orm.status;
    reservation.reservationCode = orm.reservationCode;
    reservation.notes = orm.notes;
    reservation.createdAt = orm.createdAt;
    reservation.updatedAt = orm.updatedAt;
    reservation.guests = orm.guests?.map(GuestMapper.toDomain) ?? [];
    return reservation;
  }

  static toOrm(domain: Reservation): ReservationOrmEntity {
    const orm = new ReservationOrmEntity();
    if (domain.id) {
      orm.id = domain.id;
    }
    orm.restaurantId = domain.restaurantId;
    orm.tableId = domain.tableId;
    orm.status = domain.status ?? ReservationStatus.PENDING;
    orm.reservationCode = domain.reservationCode;
    orm.notes = domain.notes ?? null;
    orm.guests = domain.guests?.map(GuestMapper.toOrm) ?? [];
    return orm;
  }
}
```

**Step 3: Commit**

```bash
git add back/src/modules/ordering/infrastructure/persistence/mappers/reservation.mapper.ts
git commit -m "feat(ordering): update ReservationMapper for new fields"
```

---

### Task 1.5: Add Reservation Code Generator Utility

**Files:**
- Create: `back/src/modules/ordering/domain/utils/reservation-code.util.ts`

**Step 1: Create the utility**

```typescript
// back/src/modules/ordering/domain/utils/reservation-code.util.ts
export function generateReservationCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Exclude confusing chars: 0OI1
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}
```

**Step 2: Commit**

```bash
git add back/src/modules/ordering/domain/utils/reservation-code.util.ts
git commit -m "feat(ordering): add reservation code generator utility"
```

---

### Task 1.6: Update CreateReservationUseCase

**Files:**
- Modify: `back/src/modules/ordering/application/use-cases/create-reservation.use-case.ts`
- Modify: `back/src/modules/ordering/application/use-cases/create-reservation.use-case.spec.ts`

**Step 1: Write/update the failing test**

```typescript
// In create-reservation.use-case.spec.ts, add test:
it('should generate a reservation code when creating', async () => {
  const input = {
    restaurantId: 1,
    tableId: 1,
    guests: [{ firstName: 'John', lastName: 'Doe', age: 30, isOrganizer: true }],
  };

  const result = await useCase.execute(input);

  expect(result.reservationCode).toBeDefined();
  expect(result.reservationCode).toHaveLength(6);
  expect(result.status).toBe(ReservationStatus.PENDING);
});
```

**Step 2: Run test to verify it fails**

```bash
cd back && pnpm test -- --testPathPattern="create-reservation.use-case" --watchAll=false
```

Expected: FAIL (reservationCode not set)

**Step 3: Update the use case**

```typescript
// back/src/modules/ordering/application/use-cases/create-reservation.use-case.ts
import { Injectable, Inject } from '@nestjs/common';
import { Reservation } from '../../domain/entities/reservation.entity';
import { Guest } from '../../domain/entities/guest.entity';
import { ReservationStatus } from '../../domain/enums/reservation-status.enum';
import { generateReservationCode } from '../../domain/utils/reservation-code.util';
import type { IReservationRepository } from '../ports/reservation.repository.port';
import { RESERVATION_REPOSITORY } from '../ports/reservation.repository.port';

export interface CreateReservationGuestInput {
  firstName: string;
  lastName: string;
  age: number;
  isOrganizer: boolean;
  entryId?: number;
  mainCourseId?: number;
  dessertId?: number;
  drinkId?: number;
}

export interface CreateReservationInput {
  restaurantId: number;
  tableId: number;
  guests: CreateReservationGuestInput[];
  notes?: string;
}

@Injectable()
export class CreateReservationUseCase {
  constructor(
    @Inject(RESERVATION_REPOSITORY)
    private readonly reservationRepository: IReservationRepository,
  ) {}

  async execute(input: CreateReservationInput): Promise<Reservation> {
    const reservation = new Reservation();
    reservation.restaurantId = input.restaurantId;
    reservation.tableId = input.tableId;
    reservation.status = ReservationStatus.PENDING;
    reservation.reservationCode = generateReservationCode();
    reservation.notes = input.notes ?? null;
    reservation.guests = input.guests.map((g) => {
      const guest = new Guest();
      guest.firstName = g.firstName;
      guest.lastName = g.lastName;
      guest.age = g.age;
      guest.isOrganizer = g.isOrganizer;
      guest.meals = {
        entry: g.entryId ?? null,
        mainCourse: g.mainCourseId ?? null,
        dessert: g.dessertId ?? null,
        drink: g.drinkId ?? null,
      };
      return guest;
    });

    return this.reservationRepository.save(reservation);
  }
}
```

**Step 4: Run test to verify it passes**

```bash
cd back && pnpm test -- --testPathPattern="create-reservation.use-case" --watchAll=false
```

Expected: PASS

**Step 5: Commit**

```bash
git add back/src/modules/ordering/application/use-cases/create-reservation.use-case.ts back/src/modules/ordering/application/use-cases/create-reservation.use-case.spec.ts
git commit -m "feat(ordering): generate reservation code and status on creation"
```

---

### Task 1.7: Update Reservation Repository Port

**Files:**
- Modify: `back/src/modules/ordering/application/ports/reservation.repository.port.ts`

**Step 1: Add new methods to the port**

```typescript
// back/src/modules/ordering/application/ports/reservation.repository.port.ts
import { Reservation } from '../../domain/entities/reservation.entity';
import { ReservationStatus } from '../../domain/enums/reservation-status.enum';

export const RESERVATION_REPOSITORY = Symbol('RESERVATION_REPOSITORY');

export interface IReservationRepository {
  save(reservation: Reservation): Promise<Reservation>;
  findAll(): Promise<Reservation[]>;
  findById(id: number): Promise<Reservation | null>;
  findByCode(code: string): Promise<Reservation | null>;
  findByRestaurantId(restaurantId: number): Promise<Reservation[]>;
  findByRestaurantIdAndStatus(restaurantId: number, status: ReservationStatus): Promise<Reservation[]>;
  update(id: number, data: Partial<Reservation>): Promise<Reservation | null>;
  updateStatus(id: number, status: ReservationStatus): Promise<Reservation | null>;
  delete(id: number): Promise<void>;
}
```

**Step 2: Commit**

```bash
git add back/src/modules/ordering/application/ports/reservation.repository.port.ts
git commit -m "feat(ordering): extend IReservationRepository with new query methods"
```

---

### Task 1.8: Update Reservation Repository Implementation

**Files:**
- Modify: `back/src/modules/ordering/infrastructure/persistence/repositories/reservation.repository.ts`

**Step 1: Implement new methods**

```typescript
// back/src/modules/ordering/infrastructure/persistence/repositories/reservation.repository.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IReservationRepository } from '../../../application/ports/reservation.repository.port';
import { Reservation } from '../../../domain/entities/reservation.entity';
import { ReservationStatus } from '../../../domain/enums/reservation-status.enum';
import { ReservationOrmEntity } from '../orm-entities/reservation.orm-entity';
import { ReservationMapper } from '../mappers/reservation.mapper';

@Injectable()
export class ReservationRepository implements IReservationRepository {
  constructor(
    @InjectRepository(ReservationOrmEntity)
    private readonly repository: Repository<ReservationOrmEntity>,
  ) {}

  async save(reservation: Reservation): Promise<Reservation> {
    const orm = ReservationMapper.toOrm(reservation);
    const saved = await this.repository.save(orm);
    return this.findById(saved.id) as Promise<Reservation>;
  }

  async findAll(): Promise<Reservation[]> {
    const entities = await this.repository.find({
      relations: ['guests'],
      order: { createdAt: 'DESC' },
    });
    return entities.map(ReservationMapper.toDomain);
  }

  async findById(id: number): Promise<Reservation | null> {
    const entity = await this.repository.findOne({
      where: { id },
      relations: ['guests'],
    });
    return entity ? ReservationMapper.toDomain(entity) : null;
  }

  async findByCode(code: string): Promise<Reservation | null> {
    const entity = await this.repository.findOne({
      where: { reservationCode: code },
      relations: ['guests'],
    });
    return entity ? ReservationMapper.toDomain(entity) : null;
  }

  async findByRestaurantId(restaurantId: number): Promise<Reservation[]> {
    const entities = await this.repository.find({
      where: { restaurantId },
      relations: ['guests'],
      order: { createdAt: 'DESC' },
    });
    return entities.map(ReservationMapper.toDomain);
  }

  async findByRestaurantIdAndStatus(
    restaurantId: number,
    status: ReservationStatus,
  ): Promise<Reservation[]> {
    const entities = await this.repository.find({
      where: { restaurantId, status },
      relations: ['guests'],
      order: { createdAt: 'DESC' },
    });
    return entities.map(ReservationMapper.toDomain);
  }

  async update(id: number, data: Partial<Reservation>): Promise<Reservation | null> {
    await this.repository.update(id, {
      ...(data.tableId && { tableId: data.tableId }),
      ...(data.status && { status: data.status }),
      ...(data.notes !== undefined && { notes: data.notes }),
    });
    return this.findById(id);
  }

  async updateStatus(id: number, status: ReservationStatus): Promise<Reservation | null> {
    await this.repository.update(id, { status });
    return this.findById(id);
  }

  async delete(id: number): Promise<void> {
    await this.repository.delete(id);
  }
}
```

**Step 2: Commit**

```bash
git add back/src/modules/ordering/infrastructure/persistence/repositories/reservation.repository.ts
git commit -m "feat(ordering): implement extended ReservationRepository methods"
```

---

### Task 1.9: Create UpdateReservationUseCase

**Files:**
- Create: `back/src/modules/ordering/application/use-cases/update-reservation.use-case.ts`
- Create: `back/src/modules/ordering/application/use-cases/update-reservation.use-case.spec.ts`

**Step 1: Write the failing test**

```typescript
// back/src/modules/ordering/application/use-cases/update-reservation.use-case.spec.ts
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

    const result = await useCase.execute(1, { status: ReservationStatus.CONFIRMED });

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
    const result = await useCase.execute(999, { status: ReservationStatus.CONFIRMED });
    expect(result).toBeNull();
  });
});
```

**Step 2: Run test to verify it fails**

```bash
cd back && pnpm test -- --testPathPattern="update-reservation.use-case" --watchAll=false
```

Expected: FAIL (module not found)

**Step 3: Create the use case**

```typescript
// back/src/modules/ordering/application/use-cases/update-reservation.use-case.ts
import { Injectable, Inject } from '@nestjs/common';
import { Reservation } from '../../domain/entities/reservation.entity';
import { ReservationStatus } from '../../domain/enums/reservation-status.enum';
import type { IReservationRepository } from '../ports/reservation.repository.port';
import { RESERVATION_REPOSITORY } from '../ports/reservation.repository.port';

export interface UpdateReservationInput {
  tableId?: number;
  status?: ReservationStatus;
  notes?: string | null;
}

@Injectable()
export class UpdateReservationUseCase {
  constructor(
    @Inject(RESERVATION_REPOSITORY)
    private readonly reservationRepository: IReservationRepository,
  ) {}

  async execute(id: number, input: UpdateReservationInput): Promise<Reservation | null> {
    const existing = await this.reservationRepository.findById(id);
    if (!existing) {
      return null;
    }

    return this.reservationRepository.update(id, input);
  }
}
```

**Step 4: Update in-memory repository stub to support update**

```typescript
// back/src/modules/ordering/application/testing/stubs/in-memory-reservation.repository.ts
// Add the update method if not present
async update(id: number, data: Partial<Reservation>): Promise<Reservation | null> {
  const index = this.reservations.findIndex(r => r.id === id);
  if (index === -1) return null;

  this.reservations[index] = { ...this.reservations[index], ...data };
  return this.reservations[index];
}

async updateStatus(id: number, status: ReservationStatus): Promise<Reservation | null> {
  return this.update(id, { status });
}
```

**Step 5: Run test to verify it passes**

```bash
cd back && pnpm test -- --testPathPattern="update-reservation.use-case" --watchAll=false
```

Expected: PASS

**Step 6: Commit**

```bash
git add back/src/modules/ordering/application/use-cases/update-reservation.use-case.ts back/src/modules/ordering/application/use-cases/update-reservation.use-case.spec.ts back/src/modules/ordering/application/testing/stubs/in-memory-reservation.repository.ts
git commit -m "feat(ordering): add UpdateReservationUseCase"
```

---

### Task 1.10: Create GetReservationByCodeUseCase

**Files:**
- Create: `back/src/modules/ordering/application/use-cases/get-reservation-by-code.use-case.ts`
- Create: `back/src/modules/ordering/application/use-cases/get-reservation-by-code.use-case.spec.ts`

**Step 1: Write the failing test**

```typescript
// back/src/modules/ordering/application/use-cases/get-reservation-by-code.use-case.spec.ts
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
```

**Step 2: Run test to verify it fails**

```bash
cd back && pnpm test -- --testPathPattern="get-reservation-by-code.use-case" --watchAll=false
```

**Step 3: Create the use case**

```typescript
// back/src/modules/ordering/application/use-cases/get-reservation-by-code.use-case.ts
import { Injectable, Inject } from '@nestjs/common';
import { Reservation } from '../../domain/entities/reservation.entity';
import type { IReservationRepository } from '../ports/reservation.repository.port';
import { RESERVATION_REPOSITORY } from '../ports/reservation.repository.port';

@Injectable()
export class GetReservationByCodeUseCase {
  constructor(
    @Inject(RESERVATION_REPOSITORY)
    private readonly reservationRepository: IReservationRepository,
  ) {}

  async execute(code: string): Promise<Reservation | null> {
    return this.reservationRepository.findByCode(code.toUpperCase());
  }
}
```

**Step 4: Update in-memory stub with findByCode**

```typescript
// Add to in-memory-reservation.repository.ts
async findByCode(code: string): Promise<Reservation | null> {
  return this.reservations.find(r => r.reservationCode === code) ?? null;
}
```

**Step 5: Run test to verify it passes**

```bash
cd back && pnpm test -- --testPathPattern="get-reservation-by-code.use-case" --watchAll=false
```

**Step 6: Commit**

```bash
git add back/src/modules/ordering/application/use-cases/get-reservation-by-code.use-case.ts back/src/modules/ordering/application/use-cases/get-reservation-by-code.use-case.spec.ts back/src/modules/ordering/application/testing/stubs/in-memory-reservation.repository.ts
git commit -m "feat(ordering): add GetReservationByCodeUseCase for terminal lookup"
```

---

### Task 1.11: Update Reservation Controller

**Files:**
- Modify: `back/src/modules/ordering/infrastructure/http/controllers/reservation.controller.ts`
- Create: `back/src/modules/ordering/infrastructure/http/dtos/update-reservation.dto.ts`

**Step 1: Create update DTO**

```typescript
// back/src/modules/ordering/infrastructure/http/dtos/update-reservation.dto.ts
import { IsOptional, IsInt, IsEnum, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { ReservationStatus } from '../../../domain/enums/reservation-status.enum';

export class UpdateReservationDto {
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  tableId?: number;

  @IsOptional()
  @IsEnum(ReservationStatus)
  status?: ReservationStatus;

  @IsOptional()
  @IsString()
  notes?: string | null;
}
```

**Step 2: Update the controller**

```typescript
// back/src/modules/ordering/infrastructure/http/controllers/reservation.controller.ts
import {
  Controller,
  Post,
  Get,
  Put,
  Patch,
  Delete,
  Param,
  Query,
  Body,
  NotFoundException,
  ParseIntPipe,
} from '@nestjs/common';
import { CreateReservationUseCase } from '../../../application/use-cases/create-reservation.use-case';
import { GetReservationsUseCase } from '../../../application/use-cases/get-reservations.use-case';
import { GetReservationByIdUseCase } from '../../../application/use-cases/get-reservation-by-id.use-case';
import { GetReservationByCodeUseCase } from '../../../application/use-cases/get-reservation-by-code.use-case';
import { UpdateReservationUseCase } from '../../../application/use-cases/update-reservation.use-case';
import { CreateReservationDto } from '../dtos/create-reservation.dto';
import { UpdateReservationDto } from '../dtos/update-reservation.dto';
import { Reservation } from '../../../domain/entities/reservation.entity';
import { ReservationStatus } from '../../../domain/enums/reservation-status.enum';

@Controller('reservations')
export class ReservationController {
  constructor(
    private readonly createReservationUseCase: CreateReservationUseCase,
    private readonly getReservationsUseCase: GetReservationsUseCase,
    private readonly getReservationByIdUseCase: GetReservationByIdUseCase,
    private readonly getReservationByCodeUseCase: GetReservationByCodeUseCase,
    private readonly updateReservationUseCase: UpdateReservationUseCase,
  ) {}

  @Get()
  async findAll(
    @Query('restaurantId') restaurantId?: string,
    @Query('status') status?: ReservationStatus,
  ): Promise<Reservation[]> {
    // TODO: Add filtering by restaurantId and status
    return this.getReservationsUseCase.execute();
  }

  @Get('code/:code')
  async findByCode(@Param('code') code: string): Promise<Reservation> {
    const reservation = await this.getReservationByCodeUseCase.execute(code);
    if (!reservation) {
      throw new NotFoundException(`Reservation with code ${code} not found`);
    }
    return reservation;
  }

  @Get(':id')
  async findById(@Param('id', ParseIntPipe) id: number): Promise<Reservation> {
    const reservation = await this.getReservationByIdUseCase.execute(id);
    if (!reservation) {
      throw new NotFoundException(`Reservation with id ${id} not found`);
    }
    return reservation;
  }

  @Post()
  async create(@Body() dto: CreateReservationDto): Promise<Reservation> {
    return this.createReservationUseCase.execute(dto);
  }

  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateReservationDto,
  ): Promise<Reservation> {
    const reservation = await this.updateReservationUseCase.execute(id, dto);
    if (!reservation) {
      throw new NotFoundException(`Reservation with id ${id} not found`);
    }
    return reservation;
  }

  @Patch(':id/status')
  async updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body('status') status: ReservationStatus,
  ): Promise<Reservation> {
    const reservation = await this.updateReservationUseCase.execute(id, { status });
    if (!reservation) {
      throw new NotFoundException(`Reservation with id ${id} not found`);
    }
    return reservation;
  }
}
```

**Step 3: Commit**

```bash
git add back/src/modules/ordering/infrastructure/http/controllers/reservation.controller.ts back/src/modules/ordering/infrastructure/http/dtos/update-reservation.dto.ts
git commit -m "feat(ordering): add PUT, PATCH endpoints and code lookup for reservations"
```

---

### Task 1.12: Register New Use Cases in Module

**Files:**
- Modify: `back/src/modules/ordering/ordering.module.ts`

**Step 1: Add imports and providers**

```typescript
// Add to imports section:
import { UpdateReservationUseCase } from './application/use-cases/update-reservation.use-case';
import { GetReservationByCodeUseCase } from './application/use-cases/get-reservation-by-code.use-case';

// Add to providers array:
UpdateReservationUseCase,
GetReservationByCodeUseCase,
```

**Step 2: Commit**

```bash
git add back/src/modules/ordering/ordering.module.ts
git commit -m "chore(ordering): register new use cases in OrderingModule"
```

---

## Phase 2: Menu Entity (Backend)

### Task 2.1: Create Menu Domain Entity

**Files:**
- Create: `back/src/modules/ordering/domain/entities/menu.entity.ts`
- Create: `back/src/modules/ordering/domain/entities/menu-item.entity.ts`

**Step 1: Create Menu entity**

```typescript
// back/src/modules/ordering/domain/entities/menu.entity.ts
import { MenuItem } from './menu-item.entity';

export class Menu {
  id: number;
  restaurantId: number;
  title: string;
  description: string;
  price: number;
  imageUrl: string;
  isActive: boolean;
  items: MenuItem[];
  createdAt: Date;
  updatedAt: Date;
}
```

**Step 2: Create MenuItem entity**

```typescript
// back/src/modules/ordering/domain/entities/menu-item.entity.ts
import { MealType } from '../enums/meal-type.enum';

export class MenuItem {
  id: number;
  menuId: number;
  mealType: MealType;
  quantity: number;
}
```

**Step 3: Commit**

```bash
git add back/src/modules/ordering/domain/entities/menu.entity.ts back/src/modules/ordering/domain/entities/menu-item.entity.ts
git commit -m "feat(ordering): add Menu and MenuItem domain entities"
```

---

### Task 2.2: Create Menu ORM Entities

**Files:**
- Create: `back/src/modules/ordering/infrastructure/persistence/orm-entities/menu.orm-entity.ts`
- Create: `back/src/modules/ordering/infrastructure/persistence/orm-entities/menu-item.orm-entity.ts`

**Step 1: Create MenuOrmEntity**

```typescript
// back/src/modules/ordering/infrastructure/persistence/orm-entities/menu.orm-entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { RestaurantOrmEntity } from './restaurant.orm-entity';
import { MenuItemOrmEntity } from './menu-item.orm-entity';

@Entity('menus')
export class MenuOrmEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'restaurant_id' })
  restaurantId: number;

  @Column()
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column({ name: 'image_url' })
  imageUrl: string;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ManyToOne(() => RestaurantOrmEntity)
  @JoinColumn({ name: 'restaurant_id' })
  restaurant: RestaurantOrmEntity;

  @OneToMany(() => MenuItemOrmEntity, (item) => item.menu, { cascade: true })
  items: MenuItemOrmEntity[];
}
```

**Step 2: Create MenuItemOrmEntity**

```typescript
// back/src/modules/ordering/infrastructure/persistence/orm-entities/menu-item.orm-entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { MenuOrmEntity } from './menu.orm-entity';
import { MealType } from '../../../domain/enums/meal-type.enum';

@Entity('menu_items')
export class MenuItemOrmEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'menu_id' })
  menuId: number;

  @Column({ type: 'enum', enum: MealType, name: 'meal_type' })
  mealType: MealType;

  @Column({ type: 'int', default: 1 })
  quantity: number;

  @ManyToOne(() => MenuOrmEntity, (menu) => menu.items)
  @JoinColumn({ name: 'menu_id' })
  menu: MenuOrmEntity;
}
```

**Step 3: Commit**

```bash
git add back/src/modules/ordering/infrastructure/persistence/orm-entities/menu.orm-entity.ts back/src/modules/ordering/infrastructure/persistence/orm-entities/menu-item.orm-entity.ts
git commit -m "feat(ordering): add Menu and MenuItem ORM entities"
```

---

### Task 2.3: Create Menu Repository Port and Implementation

**Files:**
- Create: `back/src/modules/ordering/application/ports/menu.repository.port.ts`
- Create: `back/src/modules/ordering/infrastructure/persistence/repositories/menu.repository.ts`
- Create: `back/src/modules/ordering/infrastructure/persistence/mappers/menu.mapper.ts`

**Step 1: Create the port**

```typescript
// back/src/modules/ordering/application/ports/menu.repository.port.ts
import { Menu } from '../../domain/entities/menu.entity';

export const MENU_REPOSITORY = Symbol('MENU_REPOSITORY');

export interface IMenuRepository {
  save(menu: Menu): Promise<Menu>;
  findAll(): Promise<Menu[]>;
  findById(id: number): Promise<Menu | null>;
  findByRestaurantId(restaurantId: number): Promise<Menu[]>;
  findActiveByRestaurantId(restaurantId: number): Promise<Menu[]>;
  update(id: number, data: Partial<Menu>): Promise<Menu | null>;
  delete(id: number): Promise<void>;
}
```

**Step 2: Create the mapper**

```typescript
// back/src/modules/ordering/infrastructure/persistence/mappers/menu.mapper.ts
import { Menu } from '../../../domain/entities/menu.entity';
import { MenuItem } from '../../../domain/entities/menu-item.entity';
import { MenuOrmEntity } from '../orm-entities/menu.orm-entity';
import { MenuItemOrmEntity } from '../orm-entities/menu-item.orm-entity';

export class MenuMapper {
  static toDomain(orm: MenuOrmEntity): Menu {
    const menu = new Menu();
    menu.id = orm.id;
    menu.restaurantId = orm.restaurantId;
    menu.title = orm.title;
    menu.description = orm.description;
    menu.price = Number(orm.price);
    menu.imageUrl = orm.imageUrl;
    menu.isActive = orm.isActive;
    menu.createdAt = orm.createdAt;
    menu.updatedAt = orm.updatedAt;
    menu.items = orm.items?.map(MenuMapper.itemToDomain) ?? [];
    return menu;
  }

  static itemToDomain(orm: MenuItemOrmEntity): MenuItem {
    const item = new MenuItem();
    item.id = orm.id;
    item.menuId = orm.menuId;
    item.mealType = orm.mealType;
    item.quantity = orm.quantity;
    return item;
  }

  static toOrm(domain: Menu): MenuOrmEntity {
    const orm = new MenuOrmEntity();
    if (domain.id) {
      orm.id = domain.id;
    }
    orm.restaurantId = domain.restaurantId;
    orm.title = domain.title;
    orm.description = domain.description;
    orm.price = domain.price;
    orm.imageUrl = domain.imageUrl;
    orm.isActive = domain.isActive ?? true;
    orm.items = domain.items?.map(MenuMapper.itemToOrm) ?? [];
    return orm;
  }

  static itemToOrm(domain: MenuItem): MenuItemOrmEntity {
    const orm = new MenuItemOrmEntity();
    if (domain.id) {
      orm.id = domain.id;
    }
    orm.menuId = domain.menuId;
    orm.mealType = domain.mealType;
    orm.quantity = domain.quantity;
    return orm;
  }
}
```

**Step 3: Create the repository**

```typescript
// back/src/modules/ordering/infrastructure/persistence/repositories/menu.repository.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IMenuRepository } from '../../../application/ports/menu.repository.port';
import { Menu } from '../../../domain/entities/menu.entity';
import { MenuOrmEntity } from '../orm-entities/menu.orm-entity';
import { MenuMapper } from '../mappers/menu.mapper';

@Injectable()
export class MenuRepository implements IMenuRepository {
  constructor(
    @InjectRepository(MenuOrmEntity)
    private readonly repository: Repository<MenuOrmEntity>,
  ) {}

  async save(menu: Menu): Promise<Menu> {
    const orm = MenuMapper.toOrm(menu);
    const saved = await this.repository.save(orm);
    return this.findById(saved.id) as Promise<Menu>;
  }

  async findAll(): Promise<Menu[]> {
    const entities = await this.repository.find({
      relations: ['items'],
      order: { createdAt: 'DESC' },
    });
    return entities.map(MenuMapper.toDomain);
  }

  async findById(id: number): Promise<Menu | null> {
    const entity = await this.repository.findOne({
      where: { id },
      relations: ['items'],
    });
    return entity ? MenuMapper.toDomain(entity) : null;
  }

  async findByRestaurantId(restaurantId: number): Promise<Menu[]> {
    const entities = await this.repository.find({
      where: { restaurantId },
      relations: ['items'],
      order: { createdAt: 'DESC' },
    });
    return entities.map(MenuMapper.toDomain);
  }

  async findActiveByRestaurantId(restaurantId: number): Promise<Menu[]> {
    const entities = await this.repository.find({
      where: { restaurantId, isActive: true },
      relations: ['items'],
      order: { createdAt: 'DESC' },
    });
    return entities.map(MenuMapper.toDomain);
  }

  async update(id: number, data: Partial<Menu>): Promise<Menu | null> {
    const existing = await this.repository.findOne({ where: { id } });
    if (!existing) return null;

    await this.repository.update(id, {
      ...(data.title && { title: data.title }),
      ...(data.description && { description: data.description }),
      ...(data.price !== undefined && { price: data.price }),
      ...(data.imageUrl && { imageUrl: data.imageUrl }),
      ...(data.isActive !== undefined && { isActive: data.isActive }),
    });

    return this.findById(id);
  }

  async delete(id: number): Promise<void> {
    await this.repository.delete(id);
  }
}
```

**Step 4: Commit**

```bash
git add back/src/modules/ordering/application/ports/menu.repository.port.ts back/src/modules/ordering/infrastructure/persistence/repositories/menu.repository.ts back/src/modules/ordering/infrastructure/persistence/mappers/menu.mapper.ts
git commit -m "feat(ordering): add Menu repository port, implementation, and mapper"
```

---

### Task 2.4: Create Menu Use Cases

**Files:**
- Create: `back/src/modules/ordering/application/use-cases/get-menus.use-case.ts`
- Create: `back/src/modules/ordering/application/use-cases/create-menu.use-case.ts`
- Create: `back/src/modules/ordering/application/use-cases/update-menu.use-case.ts`
- Create: `back/src/modules/ordering/application/use-cases/delete-menu.use-case.ts`

**Step 1: Create GetMenusUseCase**

```typescript
// back/src/modules/ordering/application/use-cases/get-menus.use-case.ts
import { Injectable, Inject } from '@nestjs/common';
import { Menu } from '../../domain/entities/menu.entity';
import type { IMenuRepository } from '../ports/menu.repository.port';
import { MENU_REPOSITORY } from '../ports/menu.repository.port';

@Injectable()
export class GetMenusUseCase {
  constructor(
    @Inject(MENU_REPOSITORY)
    private readonly menuRepository: IMenuRepository,
  ) {}

  async execute(restaurantId?: number, activeOnly?: boolean): Promise<Menu[]> {
    if (restaurantId) {
      if (activeOnly) {
        return this.menuRepository.findActiveByRestaurantId(restaurantId);
      }
      return this.menuRepository.findByRestaurantId(restaurantId);
    }
    return this.menuRepository.findAll();
  }
}
```

**Step 2: Create CreateMenuUseCase**

```typescript
// back/src/modules/ordering/application/use-cases/create-menu.use-case.ts
import { Injectable, Inject } from '@nestjs/common';
import { Menu } from '../../domain/entities/menu.entity';
import { MenuItem } from '../../domain/entities/menu-item.entity';
import { MealType } from '../../domain/enums/meal-type.enum';
import type { IMenuRepository } from '../ports/menu.repository.port';
import { MENU_REPOSITORY } from '../ports/menu.repository.port';

export interface CreateMenuItemInput {
  mealType: MealType;
  quantity: number;
}

export interface CreateMenuInput {
  restaurantId: number;
  title: string;
  description: string;
  price: number;
  imageUrl: string;
  items?: CreateMenuItemInput[];
}

@Injectable()
export class CreateMenuUseCase {
  constructor(
    @Inject(MENU_REPOSITORY)
    private readonly menuRepository: IMenuRepository,
  ) {}

  async execute(input: CreateMenuInput): Promise<Menu> {
    const menu = new Menu();
    menu.restaurantId = input.restaurantId;
    menu.title = input.title;
    menu.description = input.description;
    menu.price = input.price;
    menu.imageUrl = input.imageUrl;
    menu.isActive = true;
    menu.items = (input.items ?? []).map((item) => {
      const menuItem = new MenuItem();
      menuItem.mealType = item.mealType;
      menuItem.quantity = item.quantity;
      return menuItem;
    });

    return this.menuRepository.save(menu);
  }
}
```

**Step 3: Create UpdateMenuUseCase**

```typescript
// back/src/modules/ordering/application/use-cases/update-menu.use-case.ts
import { Injectable, Inject } from '@nestjs/common';
import { Menu } from '../../domain/entities/menu.entity';
import type { IMenuRepository } from '../ports/menu.repository.port';
import { MENU_REPOSITORY } from '../ports/menu.repository.port';

export interface UpdateMenuInput {
  title?: string;
  description?: string;
  price?: number;
  imageUrl?: string;
  isActive?: boolean;
}

@Injectable()
export class UpdateMenuUseCase {
  constructor(
    @Inject(MENU_REPOSITORY)
    private readonly menuRepository: IMenuRepository,
  ) {}

  async execute(id: number, input: UpdateMenuInput): Promise<Menu | null> {
    return this.menuRepository.update(id, input);
  }
}
```

**Step 4: Create DeleteMenuUseCase**

```typescript
// back/src/modules/ordering/application/use-cases/delete-menu.use-case.ts
import { Injectable, Inject } from '@nestjs/common';
import type { IMenuRepository } from '../ports/menu.repository.port';
import { MENU_REPOSITORY } from '../ports/menu.repository.port';

@Injectable()
export class DeleteMenuUseCase {
  constructor(
    @Inject(MENU_REPOSITORY)
    private readonly menuRepository: IMenuRepository,
  ) {}

  async execute(id: number): Promise<void> {
    await this.menuRepository.delete(id);
  }
}
```

**Step 5: Commit**

```bash
git add back/src/modules/ordering/application/use-cases/get-menus.use-case.ts back/src/modules/ordering/application/use-cases/create-menu.use-case.ts back/src/modules/ordering/application/use-cases/update-menu.use-case.ts back/src/modules/ordering/application/use-cases/delete-menu.use-case.ts
git commit -m "feat(ordering): add Menu CRUD use cases"
```

---

### Task 2.5: Create Menu Controller and DTOs

**Files:**
- Create: `back/src/modules/ordering/infrastructure/http/controllers/menu.controller.ts`
- Create: `back/src/modules/ordering/infrastructure/http/dtos/create-menu.dto.ts`
- Create: `back/src/modules/ordering/infrastructure/http/dtos/update-menu.dto.ts`

**Step 1: Create CreateMenuDto**

```typescript
// back/src/modules/ordering/infrastructure/http/dtos/create-menu.dto.ts
import {
  IsInt,
  IsString,
  IsNumber,
  IsOptional,
  IsArray,
  ValidateNested,
  IsEnum,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';
import { MealType } from '../../../domain/enums/meal-type.enum';

export class MenuItemDto {
  @IsEnum(MealType)
  mealType: MealType;

  @IsInt()
  @Min(1)
  quantity: number;
}

export class CreateMenuDto {
  @IsInt()
  @Type(() => Number)
  restaurantId: number;

  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsNumber()
  @Min(0)
  @Type(() => Number)
  price: number;

  @IsString()
  imageUrl: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MenuItemDto)
  items?: MenuItemDto[];
}
```

**Step 2: Create UpdateMenuDto**

```typescript
// back/src/modules/ordering/infrastructure/http/dtos/update-menu.dto.ts
import {
  IsString,
  IsNumber,
  IsOptional,
  IsBoolean,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateMenuDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  price?: number;

  @IsOptional()
  @IsString()
  imageUrl?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
```

**Step 3: Create MenuController**

```typescript
// back/src/modules/ordering/infrastructure/http/controllers/menu.controller.ts
import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Query,
  Body,
  NotFoundException,
  ParseIntPipe,
} from '@nestjs/common';
import { GetMenusUseCase } from '../../../application/use-cases/get-menus.use-case';
import { CreateMenuUseCase } from '../../../application/use-cases/create-menu.use-case';
import { UpdateMenuUseCase } from '../../../application/use-cases/update-menu.use-case';
import { DeleteMenuUseCase } from '../../../application/use-cases/delete-menu.use-case';
import { CreateMenuDto } from '../dtos/create-menu.dto';
import { UpdateMenuDto } from '../dtos/update-menu.dto';
import { Menu } from '../../../domain/entities/menu.entity';

@Controller('menus')
export class MenuController {
  constructor(
    private readonly getMenusUseCase: GetMenusUseCase,
    private readonly createMenuUseCase: CreateMenuUseCase,
    private readonly updateMenuUseCase: UpdateMenuUseCase,
    private readonly deleteMenuUseCase: DeleteMenuUseCase,
  ) {}

  @Get()
  async findAll(
    @Query('restaurantId') restaurantId?: string,
    @Query('activeOnly') activeOnly?: string,
  ): Promise<Menu[]> {
    const restId = restaurantId ? parseInt(restaurantId, 10) : undefined;
    const active = activeOnly === 'true';
    return this.getMenusUseCase.execute(restId, active);
  }

  @Post()
  async create(@Body() dto: CreateMenuDto): Promise<Menu> {
    return this.createMenuUseCase.execute(dto);
  }

  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateMenuDto,
  ): Promise<Menu> {
    const menu = await this.updateMenuUseCase.execute(id, dto);
    if (!menu) {
      throw new NotFoundException(`Menu with id ${id} not found`);
    }
    return menu;
  }

  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.deleteMenuUseCase.execute(id);
  }
}
```

**Step 4: Commit**

```bash
git add back/src/modules/ordering/infrastructure/http/controllers/menu.controller.ts back/src/modules/ordering/infrastructure/http/dtos/create-menu.dto.ts back/src/modules/ordering/infrastructure/http/dtos/update-menu.dto.ts
git commit -m "feat(ordering): add Menu controller and DTOs"
```

---

### Task 2.6: Register Menu Components in Module

**Files:**
- Modify: `back/src/modules/ordering/ordering.module.ts`

**Step 1: Add all Menu-related imports and providers**

Add to imports section:
```typescript
import { MenuOrmEntity } from './infrastructure/persistence/orm-entities/menu.orm-entity';
import { MenuItemOrmEntity } from './infrastructure/persistence/orm-entities/menu-item.orm-entity';
import { MenuRepository } from './infrastructure/persistence/repositories/menu.repository';
import { MENU_REPOSITORY } from './application/ports/menu.repository.port';
import { GetMenusUseCase } from './application/use-cases/get-menus.use-case';
import { CreateMenuUseCase } from './application/use-cases/create-menu.use-case';
import { UpdateMenuUseCase } from './application/use-cases/update-menu.use-case';
import { DeleteMenuUseCase } from './application/use-cases/delete-menu.use-case';
import { MenuController } from './infrastructure/http/controllers/menu.controller';
```

Add to TypeOrmModule.forFeature array:
```typescript
MenuOrmEntity,
MenuItemOrmEntity,
```

Add to controllers array:
```typescript
MenuController,
```

Add to providers array:
```typescript
{
  provide: MENU_REPOSITORY,
  useClass: MenuRepository,
},
GetMenusUseCase,
CreateMenuUseCase,
UpdateMenuUseCase,
DeleteMenuUseCase,
```

Add to exports array:
```typescript
MENU_REPOSITORY,
```

**Step 2: Commit**

```bash
git add back/src/modules/ordering/ordering.module.ts
git commit -m "chore(ordering): register Menu components in OrderingModule"
```

---

## Phase 3: Order Module Bug Fixes (Frontend)

### Task 3.1: Fix Meal Deselection

**Files:**
- Modify: `front/src/modules/order/core/form/meal.form.ts`
- Modify: `front/src/modules/order/react/sections/meals/use-meals.hook.ts`

**Step 1: Update MealForm to support toggle**

In `meal.form.ts`, update each assign method to toggle (set to null if same meal is selected again):

```typescript
// In assignEntry method:
assignEntry(form: OrderingDomainModel.Form, guestId: string, mealId: string): OrderingDomainModel.Form {
  return produce(form, draft => {
    const guest = draft.guests.find(g => String(g.id) === guestId);
    if (guest) {
      // Toggle: if same meal, set to null; otherwise set new meal
      guest.meals.entry = guest.meals.entry === mealId ? null : mealId;
    }
  });
}

// Apply same pattern to assignMainCourse, assignDessert, assignDrink
```

**Step 2: Commit**

```bash
git add front/src/modules/order/core/form/meal.form.ts
git commit -m "fix(order): allow meal deselection by clicking same item again"
```

---

### Task 3.2: Add Table Icon to Summary

**Files:**
- Modify: `front/src/modules/order/react/sections/summary/SummarySection.tsx`

**Step 1: Add Lucide table icon import and display**

```typescript
// Add import at top:
import { TableIcon } from 'lucide-react';

// In the table section (around line 17-24), add icon:
<div className="bg-luminous-bg-secondary border border-luminous-gold-border rounded-xl p-4 mx-auto max-w-[400px]">
    <p className='mb-2 font-display font-medium text-center text-base sm:text-lg text-luminous-text-primary'>
        Emplacement de la table
    </p>
    <div className="flex justify-center mb-2">
        <TableIcon className="w-8 h-8 text-luminous-gold" />
    </div>
    <p className="text-sm sm:text-base italic text-center text-luminous-gold">
        {presenter.summary.table.title}
    </p>
</div>
```

**Step 2: Commit**

```bash
git add front/src/modules/order/react/sections/summary/SummarySection.tsx
git commit -m "fix(order): add table icon to summary section"
```

---

### Task 3.3: Fix Confirmation Message

**Files:**
- Modify: `front/src/modules/order/react/sections/reserved/ReservedSection.tsx`
- Modify: `front/src/modules/order/react/sections/reserved/use-reserved.hook.ts`

**Step 1: Update hook to detect context**

```typescript
// In use-reserved.hook.ts, add:
const isTerminalMode = useSelector((state: AppState) => state.ordering.isTerminalMode ?? false);

return {
  // ... existing
  isTerminalMode,
};
```

**Step 2: Update ReservedSection with dynamic message**

```typescript
// In ReservedSection.tsx:
<h3 className="mx-auto my-3 font-display font-medium text-luminous-text-primary text-xl sm:text-2xl text-center">
    {presenter.isTerminalMode
      ? "Un membre de notre équipe va vous accueillir"
      : "Votre commande a été transmise"}
</h3>

// Update description text based on mode
<p className="mb-3 text-sm sm:text-base text-center text-luminous-text-secondary">
    {presenter.isTerminalMode
      ? "Veuillez patienter, un membre de notre équipe viendra vous placer à votre table."
      : "Votre commande a été transmise en cuisine. Elle sera servie à votre table."}
</p>
```

**Step 3: Commit**

```bash
git add front/src/modules/order/react/sections/reserved/ReservedSection.tsx front/src/modules/order/react/sections/reserved/use-reserved.hook.ts
git commit -m "fix(order): adapt confirmation message based on terminal/order mode"
```

---

## Phase 4: Backoffice Enhancements (Frontend)

### Task 4.1: Add Meal Images to MealsSection

**Files:**
- Modify: `front/src/modules/backoffice/react/sections/meals/MealsSection.tsx`

**Step 1: Add Image component import and display**

```typescript
// Add import:
import Image from 'next/image';

// In the meal card (after line 123), add image:
<LuxuryCard key={meal.id} hoverable>
    {meal.imageUrl && (
        <div className="relative w-full h-32 mb-3 rounded-lg overflow-hidden">
            <Image
                src={meal.imageUrl}
                alt={meal.title}
                fill
                className="object-cover"
                onError={(e) => {
                    (e.target as HTMLImageElement).src = '/placeholder-meal.jpg';
                }}
            />
        </div>
    )}
    <h4 className="text-lg font-semibold text-luxury-text-primary mb-2">
        {meal.title}
    </h4>
    {/* ... rest of card content */}
</LuxuryCard>
```

**Step 2: Commit**

```bash
git add front/src/modules/backoffice/react/sections/meals/MealsSection.tsx
git commit -m "feat(backoffice): display meal images in MealsSection"
```

---

### Task 4.2: Create MenusSection for Backoffice

**Files:**
- Create: `front/src/modules/backoffice/react/sections/menus/MenusSection.tsx`
- Create: `front/src/modules/backoffice/react/sections/menus/use-menus.hook.ts`
- Modify: `front/src/modules/backoffice/react/pages/restaurant-detail/RestaurantDetailPage.tsx`

**Step 1: Create the hook**

```typescript
// front/src/modules/backoffice/react/sections/menus/use-menus.hook.ts
import { useState, useEffect, useCallback } from 'react';
import { useDependencies } from '@taotask/modules/app/react/DependenciesProvider';

export interface Menu {
    id: number;
    restaurantId: number;
    title: string;
    description: string;
    price: number;
    imageUrl: string;
    isActive: boolean;
    items: MenuItem[];
}

export interface MenuItem {
    id: number;
    mealType: string;
    quantity: number;
}

export interface CreateMenuInput {
    restaurantId: number;
    title: string;
    description: string;
    price: number;
    imageUrl: string;
    items?: { mealType: string; quantity: number }[];
}

export const useMenus = (restaurantId: number) => {
    const [menus, setMenus] = useState<Menu[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const dependencies = useDependencies();

    const fetchMenus = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await fetch(`/api/menus?restaurantId=${restaurantId}`);
            const data = await response.json();
            setMenus(data);
        } catch (error) {
            console.error('Failed to fetch menus:', error);
        } finally {
            setIsLoading(false);
        }
    }, [restaurantId]);

    useEffect(() => {
        fetchMenus();
    }, [fetchMenus]);

    const createMenu = async (input: CreateMenuInput) => {
        try {
            await fetch('/api/menus', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(input),
            });
            await fetchMenus();
        } catch (error) {
            console.error('Failed to create menu:', error);
        }
    };

    const updateMenu = async (id: number, data: Partial<Menu>) => {
        try {
            await fetch(`/api/menus/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });
            await fetchMenus();
        } catch (error) {
            console.error('Failed to update menu:', error);
        }
    };

    const deleteMenu = async (id: number) => {
        try {
            await fetch(`/api/menus/${id}`, { method: 'DELETE' });
            await fetchMenus();
        } catch (error) {
            console.error('Failed to delete menu:', error);
        }
    };

    const toggleActive = async (id: number, isActive: boolean) => {
        await updateMenu(id, { isActive });
    };

    return {
        menus,
        isLoading,
        createMenu,
        updateMenu,
        deleteMenu,
        toggleActive,
    };
};
```

**Step 2: Create MenusSection component**

```typescript
// front/src/modules/backoffice/react/sections/menus/MenusSection.tsx
'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import { LuxuryCard } from '../../components/ui/LuxuryCard';
import { LuxuryButton } from '../../components/ui/LuxuryButton';
import { LuxuryModal } from '../../components/ui/LuxuryModal';
import { LuxuryInput } from '../../components/ui/LuxuryInput';
import { useMenus, CreateMenuInput } from './use-menus.hook';

interface MenusSectionProps {
    restaurantId: number;
}

const MEAL_TYPE_LABELS: Record<string, string> = {
    ENTRY: 'Entree',
    MAIN_COURSE: 'Plat',
    DESSERT: 'Dessert',
    DRINK: 'Boisson',
};

const initialFormData = {
    title: '',
    description: '',
    price: 0,
    imageUrl: '',
};

export const MenusSection: React.FC<MenusSectionProps> = ({ restaurantId }) => {
    const { menus, isLoading, createMenu, updateMenu, deleteMenu, toggleActive } = useMenus(restaurantId);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [formData, setFormData] = useState(initialFormData);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const value = e.target.type === 'number' ? parseFloat(e.target.value) : e.target.value;
        setFormData((prev) => ({ ...prev, [e.target.name]: value }));
    };

    const handleCreate = async () => {
        await createMenu({
            restaurantId,
            title: formData.title,
            description: formData.description,
            price: formData.price,
            imageUrl: formData.imageUrl || '/placeholder-menu.jpg',
        });
        setFormData(initialFormData);
        setIsCreateModalOpen(false);
    };

    const handleDelete = async (menuId: number) => {
        if (confirm('Etes-vous sur de vouloir supprimer ce menu ?')) {
            await deleteMenu(menuId);
        }
    };

    if (isLoading) {
        return <div className="text-luxury-gold">Chargement des menus...</div>;
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-serif text-luxury-text-primary">
                    Menus ({menus.length})
                </h2>
                <LuxuryButton onClick={() => setIsCreateModalOpen(true)}>+ Ajouter</LuxuryButton>
            </div>

            {menus.length === 0 ? (
                <div className="text-center py-12 text-luxury-text-secondary">
                    Aucun menu pour ce restaurant. Commencez par en creer un.
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {menus.map((menu) => (
                        <LuxuryCard key={menu.id} hoverable>
                            {menu.imageUrl && (
                                <div className="relative w-full h-40 mb-3 rounded-lg overflow-hidden">
                                    <Image
                                        src={menu.imageUrl}
                                        alt={menu.title}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                            )}
                            <div className="flex justify-between items-start mb-2">
                                <h4 className="text-lg font-semibold text-luxury-text-primary">
                                    {menu.title}
                                </h4>
                                <span className={`px-2 py-1 rounded text-xs ${menu.isActive ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'}`}>
                                    {menu.isActive ? 'Actif' : 'Inactif'}
                                </span>
                            </div>
                            <p className="text-luxury-text-secondary text-sm mb-2">{menu.description}</p>
                            <p className="text-luxury-gold font-semibold mb-3">{menu.price.toFixed(2)} EUR</p>

                            {menu.items && menu.items.length > 0 && (
                                <div className="mb-3">
                                    <p className="text-xs text-luxury-gold-muted uppercase mb-1">Inclus:</p>
                                    <div className="flex flex-wrap gap-1">
                                        {menu.items.map((item, idx) => (
                                            <span key={idx} className="text-xs bg-luxury-bg-primary px-2 py-1 rounded text-luxury-text-secondary">
                                                {item.quantity}x {MEAL_TYPE_LABELS[item.mealType]}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className="flex gap-2 mt-4">
                                <LuxuryButton
                                    variant="secondary"
                                    onClick={() => toggleActive(menu.id, !menu.isActive)}
                                >
                                    {menu.isActive ? 'Desactiver' : 'Activer'}
                                </LuxuryButton>
                                <LuxuryButton
                                    variant="destructive"
                                    onClick={() => handleDelete(menu.id)}
                                >
                                    Supprimer
                                </LuxuryButton>
                            </div>
                        </LuxuryCard>
                    ))}
                </div>
            )}

            <LuxuryModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                title="Nouveau menu"
            >
                <div className="space-y-4">
                    <LuxuryInput
                        label="Nom du menu"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        placeholder="Ex: Menu Decouverte"
                        required
                    />
                    <LuxuryInput
                        label="Description"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        placeholder="Ex: Entree + Plat + Dessert"
                        required
                    />
                    <LuxuryInput
                        label="Prix (EUR)"
                        name="price"
                        type="number"
                        value={formData.price}
                        onChange={handleChange}
                        min={0}
                        required
                    />
                    <LuxuryInput
                        label="URL de l'image"
                        name="imageUrl"
                        value={formData.imageUrl}
                        onChange={handleChange}
                        placeholder="https://example.com/image.jpg"
                    />
                    <div className="flex gap-4 pt-4">
                        <LuxuryButton onClick={handleCreate}>Creer</LuxuryButton>
                        <LuxuryButton variant="secondary" onClick={() => setIsCreateModalOpen(false)}>
                            Annuler
                        </LuxuryButton>
                    </div>
                </div>
            </LuxuryModal>
        </div>
    );
};
```

**Step 3: Add Menus tab to RestaurantDetailPage**

```typescript
// In RestaurantDetailPage.tsx, add to TABS array:
{ id: 'menus', label: 'Menus' },

// Add import:
import { MenusSection } from '../../sections/menus/MenusSection';

// Add case in renderTabContent:
case 'menus':
    return <MenusSection restaurantId={restaurantId} />;
```

**Step 4: Commit**

```bash
git add front/src/modules/backoffice/react/sections/menus/MenusSection.tsx front/src/modules/backoffice/react/sections/menus/use-menus.hook.ts front/src/modules/backoffice/react/pages/restaurant-detail/RestaurantDetailPage.tsx
git commit -m "feat(backoffice): add MenusSection for menu composition management"
```

---

### Task 4.3: Add QR Code Generation to TablesSection

**Files:**
- Modify: `front/src/modules/backoffice/react/sections/tables/TablesSection.tsx`
- Run: `cd front && pnpm add qrcode.react`

**Step 1: Install qrcode.react**

```bash
cd front && pnpm add qrcode.react
```

**Step 2: Add QR code modal to TablesSection**

```typescript
// Add imports:
import { QRCodeSVG } from 'qrcode.react';
import { Download, Printer, QrCode } from 'lucide-react';

// Add state for QR modal:
const [qrModalTable, setQrModalTable] = useState<{ id: number; title: string } | null>(null);

// Add function to generate URL:
const getTableOrderUrl = (tableId: number) => {
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
    return `${baseUrl}/order?table=${tableId}&restaurant=${restaurantId}`;
};

// Add function to download QR:
const downloadQR = () => {
    if (!qrModalTable) return;
    const svg = document.getElementById('qr-code-svg');
    if (svg) {
        const svgData = new XMLSerializer().serializeToString(svg);
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const img = new Image();
        img.onload = () => {
            canvas.width = img.width;
            canvas.height = img.height;
            ctx?.drawImage(img, 0, 0);
            const link = document.createElement('a');
            link.download = `qr-table-${qrModalTable.title}.png`;
            link.href = canvas.toDataURL('image/png');
            link.click();
        };
        img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
    }
};

// Add QR button in table card:
<LuxuryButton
    variant="secondary"
    onClick={() => setQrModalTable({ id: table.id, title: table.title })}
>
    <QrCode className="w-4 h-4" />
</LuxuryButton>

// Add QR Modal at end of component:
<LuxuryModal
    isOpen={!!qrModalTable}
    onClose={() => setQrModalTable(null)}
    title={`QR Code - ${qrModalTable?.title}`}
>
    <div className="flex flex-col items-center space-y-4">
        <div className="bg-white p-4 rounded-lg">
            <QRCodeSVG
                id="qr-code-svg"
                value={qrModalTable ? getTableOrderUrl(qrModalTable.id) : ''}
                size={200}
                level="H"
            />
        </div>
        <p className="text-xs text-luxury-text-secondary text-center break-all max-w-[300px]">
            {qrModalTable && getTableOrderUrl(qrModalTable.id)}
        </p>
        <div className="flex gap-4">
            <LuxuryButton onClick={downloadQR}>
                <Download className="w-4 h-4 mr-2" />
                Telecharger
            </LuxuryButton>
            <LuxuryButton variant="secondary" onClick={() => window.print()}>
                <Printer className="w-4 h-4 mr-2" />
                Imprimer
            </LuxuryButton>
        </div>
    </div>
</LuxuryModal>
```

**Step 3: Commit**

```bash
git add front/src/modules/backoffice/react/sections/tables/TablesSection.tsx front/package.json front/pnpm-lock.yaml
git commit -m "feat(backoffice): add QR code generation for tables"
```

---

## Phase 5: Terminal Flow (Frontend)

### Task 5.1: Create Terminal Route

**Files:**
- Create: `front/src/app/terminal/page.tsx`
- Delete: `front/src/app/order/[restaurantId]/page.tsx` (after migration)

**Step 1: Create terminal page**

```typescript
// front/src/app/terminal/page.tsx
import { Metadata } from "next";
import { Suspense } from "react";
import { TerminalPage } from "@taotask/modules/terminal/react/pages/TerminalPage";

export const metadata: Metadata = {
    title: "Terminal - Taste Federation",
    description: "Borne de commande",
    robots: {
        index: false,
        follow: false,
    },
};

export default function Terminal() {
    return (
        <Suspense fallback={<div>Chargement...</div>}>
            <TerminalPage />
        </Suspense>
    );
}
```

**Step 2: Commit**

```bash
git add front/src/app/terminal/page.tsx
git commit -m "feat(terminal): create /terminal route"
```

---

### Task 5.2: Create Terminal Module Structure

**Files:**
- Create: `front/src/modules/terminal/core/model/terminal.domain-model.ts`
- Create: `front/src/modules/terminal/core/store/terminal.slice.ts`

**Step 1: Create domain model**

```typescript
// front/src/modules/terminal/core/model/terminal.domain-model.ts
export namespace TerminalDomainModel {
    export enum TerminalStep {
        WELCOME = 0,
        IDENTIFY = 1,
        MENU_BROWSE = 2,
        PRE_ORDER = 3,
        CONFIRMATION = 4,
    }

    export type IdentifyMode = 'reservation' | 'walkin';

    export type TerminalState = {
        step: TerminalStep;
        restaurantId: string | null;
        identifyMode: IdentifyMode | null;
        reservationCode: string | null;
        guestCount: number;
        reservation: Reservation | null;
    };

    export type Reservation = {
        id: number;
        code: string;
        status: string;
        guestCount: number;
    };
}
```

**Step 2: Create slice**

```typescript
// front/src/modules/terminal/core/store/terminal.slice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TerminalDomainModel } from '../model/terminal.domain-model';

export type TerminalState = {
    step: TerminalDomainModel.TerminalStep;
    restaurantId: string | null;
    identifyMode: TerminalDomainModel.IdentifyMode | null;
    reservationCode: string | null;
    guestCount: number;
    reservation: TerminalDomainModel.Reservation | null;
    error: string | null;
};

const initialState: TerminalState = {
    step: TerminalDomainModel.TerminalStep.WELCOME,
    restaurantId: null,
    identifyMode: null,
    reservationCode: null,
    guestCount: 1,
    reservation: null,
    error: null,
};

export const terminalSlice = createSlice({
    name: 'terminal',
    initialState,
    reducers: {
        setRestaurantId: (state, action: PayloadAction<string>) => {
            state.restaurantId = action.payload;
        },
        setStep: (state, action: PayloadAction<TerminalDomainModel.TerminalStep>) => {
            state.step = action.payload;
        },
        chooseReservationMode: (state) => {
            state.identifyMode = 'reservation';
            state.step = TerminalDomainModel.TerminalStep.IDENTIFY;
        },
        chooseWalkInMode: (state) => {
            state.identifyMode = 'walkin';
            state.step = TerminalDomainModel.TerminalStep.IDENTIFY;
        },
        setReservationCode: (state, action: PayloadAction<string>) => {
            state.reservationCode = action.payload;
        },
        setGuestCount: (state, action: PayloadAction<number>) => {
            state.guestCount = action.payload;
        },
        setReservation: (state, action: PayloadAction<TerminalDomainModel.Reservation>) => {
            state.reservation = action.payload;
            state.step = TerminalDomainModel.TerminalStep.MENU_BROWSE;
        },
        setError: (state, action: PayloadAction<string>) => {
            state.error = action.payload;
        },
        clearError: (state) => {
            state.error = null;
        },
        goToPreOrder: (state) => {
            state.step = TerminalDomainModel.TerminalStep.PRE_ORDER;
        },
        skipToConfirmation: (state) => {
            state.step = TerminalDomainModel.TerminalStep.CONFIRMATION;
        },
        reset: () => initialState,
    },
});

export const terminalActions = terminalSlice.actions;
export const terminalReducer = terminalSlice.reducer;
```

**Step 3: Commit**

```bash
git add front/src/modules/terminal/core/model/terminal.domain-model.ts front/src/modules/terminal/core/store/terminal.slice.ts
git commit -m "feat(terminal): create terminal domain model and Redux slice"
```

---

### Task 5.3: Create Terminal Page and Sections

**Files:**
- Create: `front/src/modules/terminal/react/pages/TerminalPage.tsx`
- Create: `front/src/modules/terminal/react/sections/welcome/WelcomeSection.tsx`
- Create: `front/src/modules/terminal/react/sections/identify/IdentifySection.tsx`
- Create: `front/src/modules/terminal/react/sections/confirmation/ConfirmationSection.tsx`

(Due to length, these will be created following the same patterns established above)

**Step 1: Create TerminalPage**

```typescript
// front/src/modules/terminal/react/pages/TerminalPage.tsx
'use client';
import React, { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useSelector } from 'react-redux';
import { useAppDispatch } from '@taotask/modules/store/store';
import { TerminalDomainModel } from '../../core/model/terminal.domain-model';
import { terminalActions } from '../../core/store/terminal.slice';
import { WelcomeSection } from '../sections/welcome/WelcomeSection';
import { IdentifySection } from '../sections/identify/IdentifySection';
import { ConfirmationSection } from '../sections/confirmation/ConfirmationSection';
// Reuse order module sections for menu browsing
import { MealsPreviewSection } from '@taotask/modules/order/react/sections/meals-preview/MealsPreviewSection';

export const TerminalPage: React.FC = () => {
    const dispatch = useAppDispatch();
    const searchParams = useSearchParams();
    const restaurantId = searchParams.get('restaurantId');

    const step = useSelector((state: any) => state.terminal?.step ?? TerminalDomainModel.TerminalStep.WELCOME);

    useEffect(() => {
        if (restaurantId) {
            dispatch(terminalActions.setRestaurantId(restaurantId));
        }
    }, [restaurantId, dispatch]);

    const renderStep = () => {
        switch (step) {
            case TerminalDomainModel.TerminalStep.WELCOME:
                return <WelcomeSection />;
            case TerminalDomainModel.TerminalStep.IDENTIFY:
                return <IdentifySection />;
            case TerminalDomainModel.TerminalStep.MENU_BROWSE:
                return <MealsPreviewSection />;
            case TerminalDomainModel.TerminalStep.PRE_ORDER:
                return <MealsPreviewSection />; // Reuse with pre-order mode
            case TerminalDomainModel.TerminalStep.CONFIRMATION:
                return <ConfirmationSection />;
            default:
                return <WelcomeSection />;
        }
    };

    return (
        <main className="min-h-screen bg-luminous-bg-primary">
            {renderStep()}
        </main>
    );
};
```

**Step 2: Create WelcomeSection**

```typescript
// front/src/modules/terminal/react/sections/welcome/WelcomeSection.tsx
'use client';
import React from 'react';
import { useAppDispatch } from '@taotask/modules/store/store';
import { terminalActions } from '../../../core/store/terminal.slice';
import { LuminousCard } from '@taotask/modules/order/react/components/ui/LuminousCard';
import { LuminousButton } from '@taotask/modules/order/react/components/ui/LuminousButton';

export const WelcomeSection: React.FC = () => {
    const dispatch = useAppDispatch();

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <LuminousCard className="max-w-lg w-full text-center py-12 px-8">
                <h1 className="text-3xl font-display font-medium text-luminous-text-primary mb-4">
                    Bienvenue
                </h1>
                <div className="h-1 w-16 bg-luminous-gold mx-auto mb-6" />
                <p className="text-luminous-text-secondary mb-8">
                    Avez-vous une reservation ?
                </p>

                <div className="flex flex-col gap-4">
                    <LuminousButton
                        variant="primary"
                        onClick={() => dispatch(terminalActions.chooseReservationMode())}
                        className="w-full py-4 text-lg"
                    >
                        J'ai une reservation
                    </LuminousButton>
                    <LuminousButton
                        variant="secondary"
                        onClick={() => dispatch(terminalActions.chooseWalkInMode())}
                        className="w-full py-4 text-lg"
                    >
                        Sans reservation
                    </LuminousButton>
                </div>
            </LuminousCard>
        </div>
    );
};
```

**Step 3: Create ConfirmationSection**

```typescript
// front/src/modules/terminal/react/sections/confirmation/ConfirmationSection.tsx
'use client';
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useAppDispatch } from '@taotask/modules/store/store';
import { terminalActions } from '../../../core/store/terminal.slice';
import { LuminousCard } from '@taotask/modules/order/react/components/ui/LuminousCard';
import { CheckCircle } from 'lucide-react';

export const ConfirmationSection: React.FC = () => {
    const dispatch = useAppDispatch();
    const reservation = useSelector((state: any) => state.terminal?.reservation);

    // Auto-reset after 10 seconds
    useEffect(() => {
        const timer = setTimeout(() => {
            dispatch(terminalActions.reset());
        }, 10000);

        return () => clearTimeout(timer);
    }, [dispatch]);

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <LuminousCard className="max-w-lg w-full text-center py-12 px-8">
                <div className="w-20 h-20 rounded-full bg-luminous-sage/20 flex items-center justify-center mx-auto mb-6">
                    <CheckCircle className="w-12 h-12 text-luminous-sage" />
                </div>

                <h1 className="text-2xl font-display font-medium text-luminous-text-primary mb-4">
                    Un membre de notre equipe va vous accueillir
                </h1>
                <div className="h-1 w-16 bg-luminous-gold mx-auto mb-6" />

                {reservation?.code && (
                    <div className="bg-luminous-bg-secondary border-2 border-luminous-gold rounded-xl p-6 mb-6">
                        <p className="text-luminous-text-secondary text-sm mb-2">
                            Votre code de reservation
                        </p>
                        <p className="text-4xl font-bold text-luminous-gold tracking-wider">
                            {reservation.code}
                        </p>
                    </div>
                )}

                <p className="text-luminous-text-muted text-sm">
                    Cette page se reinitialise automatiquement
                </p>
            </LuminousCard>
        </div>
    );
};
```

**Step 4: Commit**

```bash
git add front/src/modules/terminal/react/pages/TerminalPage.tsx front/src/modules/terminal/react/sections/welcome/WelcomeSection.tsx front/src/modules/terminal/react/sections/confirmation/ConfirmationSection.tsx
git commit -m "feat(terminal): create TerminalPage with Welcome and Confirmation sections"
```

---

### Task 5.4: Update Backoffice Terminal URL

**Files:**
- Modify: `front/src/modules/backoffice/react/sections/terminal/TerminalSection.tsx`

**Step 1: Update URL format**

```typescript
// Change line 29 from:
const terminalUrl = `${baseUrl}/order/${restaurantId}`;
// To:
const terminalUrl = `${baseUrl}/terminal?restaurantId=${restaurantId}`;
```

**Step 2: Commit**

```bash
git add front/src/modules/backoffice/react/sections/terminal/TerminalSection.tsx
git commit -m "fix(backoffice): update terminal URL to new /terminal route"
```

---

## Phase 6: React Native Staff App (Skeleton)

### Task 6.1: Initialize Expo Project

**Step 1: Create Expo app**

```bash
cd /home/nasssdev/Documents/challengem2/mobile
npx create-expo-app@latest . --template blank-typescript
```

**Step 2: Commit**

```bash
git add mobile/
git commit -m "feat(mobile): initialize React Native app with Expo"
```

---

### Task 6.2: Set Up Project Structure

**Files:**
- Create: `mobile/src/modules/auth/`
- Create: `mobile/src/modules/orders/`
- Create: `mobile/src/modules/reservations/`
- Create: `mobile/src/modules/tables/`
- Create: `mobile/src/modules/shared/`
- Create: `mobile/src/navigation/`

**Step 1: Create directory structure and base files**

(Create index.ts placeholder files in each directory)

**Step 2: Commit**

```bash
git add mobile/src/
git commit -m "feat(mobile): set up module structure following hexagonal architecture"
```

---

### Task 6.3: Configure Design System Theme

**Files:**
- Create: `mobile/src/theme/colors.ts`
- Create: `mobile/src/theme/typography.ts`

**Step 1: Create colors matching luxury warm design**

```typescript
// mobile/src/theme/colors.ts
export const colors = {
    // Backgrounds
    bgPrimary: '#1a1a2e',
    bgSecondary: '#16213e',
    bgCard: '#1f2937',

    // Gold accents
    gold: '#c9a227',
    goldMuted: '#b8860b',
    goldBorder: 'rgba(201, 162, 39, 0.3)',
    goldGlow: 'rgba(201, 162, 39, 0.1)',

    // Text
    textPrimary: '#f5f5f0',
    textSecondary: '#d4d4c8',
    textMuted: '#9ca3af',

    // Status colors
    sage: '#6b8e6b',
    rose: '#e57373',

    // Meal type colors
    mealEntry: '#8b9dc3',
    mealMain: '#c9a227',
    mealDessert: '#d4a5a5',
    mealDrink: '#7eb8da',
};
```

**Step 2: Commit**

```bash
git add mobile/src/theme/
git commit -m "feat(mobile): add luxury warm design system theme"
```

---

## Remaining Tasks (Summary)

The following tasks follow the same patterns and would be implemented similarly:

**Phase 6 continued:**
- Task 6.4: Create shared UI components (Button, Card, Input)
- Task 6.5: Set up React Navigation
- Task 6.6: Create API client service
- Task 6.7: Create Login screen
- Task 6.8: Create Dashboard screen
- Task 6.9: Create Reservations list screen
- Task 6.10: Create Reservation detail screen
- Task 6.11: Create Tables overview screen
- Task 6.12: Create Order management screen
- Task 6.13: Add authentication flow
- Task 6.14: Test all API integrations

**Phase 7: Integration Testing**
- Task 7.1: Run backend tests
- Task 7.2: Run frontend tests
- Task 7.3: Manual E2E testing of terminal flow
- Task 7.4: Manual E2E testing of mobile app

---

## Verification Checklist

After completing all phases:

- [ ] Backend: All new endpoints return correct data
- [ ] Backend: Reservation code generation works
- [ ] Backend: Menu CRUD operations work
- [ ] Frontend: Terminal flow completes successfully
- [ ] Frontend: Meal deselection works
- [ ] Frontend: Table icon shows in summary
- [ ] Frontend: Confirmation message is contextual
- [ ] Backoffice: Menus tab functional
- [ ] Backoffice: Meal images display
- [ ] Backoffice: QR codes generate and download
- [ ] Mobile: App launches without errors
- [ ] Mobile: Can login as staff
- [ ] Mobile: Can view and modify reservations
