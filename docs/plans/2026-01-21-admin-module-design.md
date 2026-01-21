# Admin Module Design

## Purpose

Add a new `admin` NestJS module providing full CRUD operations for restaurant management, completely separated from the client-facing `ordering` module.

## API Endpoints

All admin endpoints prefixed with `/admin`:

| Entity | Method | Endpoint | Description |
|--------|--------|----------|-------------|
| **Restaurant** | GET | `/admin/restaurants` | List all |
| | GET | `/admin/restaurants/:id` | Get one |
| | POST | `/admin/restaurants` | Create |
| | PUT | `/admin/restaurants/:id` | Update |
| | DELETE | `/admin/restaurants/:id` | Delete (cascades to tables, meals) |
| **Table** | GET | `/admin/tables?restaurantId=X` | List by restaurant |
| | GET | `/admin/tables/:id` | Get one |
| | POST | `/admin/tables` | Create |
| | PUT | `/admin/tables/:id` | Update |
| | DELETE | `/admin/tables/:id` | Delete (cascades to reservations) |
| **Meal** | GET | `/admin/meals?restaurantId=X` | List by restaurant |
| | GET | `/admin/meals/:id` | Get one |
| | POST | `/admin/meals` | Create |
| | PUT | `/admin/meals/:id` | Update |
| | DELETE | `/admin/meals/:id` | Delete |
| **Reservation** | GET | `/admin/reservations?restaurantId=X` | List by restaurant |
| | GET | `/admin/reservations/:id` | Get one |
| | POST | `/admin/reservations` | Create |
| | PUT | `/admin/reservations/:id` | Update |
| | DELETE | `/admin/reservations/:id` | Delete |

## Module Structure

```
back/src/modules/admin/
├── admin.module.ts                    # NestJS module definition
├── application/
│   ├── ports/
│   │   ├── admin-restaurant.repository.port.ts
│   │   ├── admin-table.repository.port.ts
│   │   ├── admin-meal.repository.port.ts
│   │   └── admin-reservation.repository.port.ts
│   └── use-cases/
│       ├── restaurant/
│       │   ├── create-restaurant.use-case.ts
│       │   ├── get-restaurant.use-case.ts
│       │   ├── get-restaurants.use-case.ts
│       │   ├── update-restaurant.use-case.ts
│       │   └── delete-restaurant.use-case.ts
│       ├── table/
│       │   └── (same 5 use cases)
│       ├── meal/
│       │   └── (same 5 use cases)
│       └── reservation/
│           └── (same 5 use cases)
└── infrastructure/
    ├── http/
    │   ├── controllers/
    │   │   ├── admin-restaurant.controller.ts
    │   │   ├── admin-table.controller.ts
    │   │   ├── admin-meal.controller.ts
    │   │   └── admin-reservation.controller.ts
    │   └── dtos/
    │       ├── create-restaurant.dto.ts
    │       ├── update-restaurant.dto.ts
    │       ├── create-table.dto.ts
    │       ├── update-table.dto.ts
    │       ├── create-meal.dto.ts
    │       ├── update-meal.dto.ts
    │       ├── create-reservation.dto.ts
    │       └── update-reservation.dto.ts
    └── persistence/
        └── repositories/
            ├── admin-restaurant.repository.ts
            ├── admin-table.repository.ts
            ├── admin-meal.repository.ts
            └── admin-reservation.repository.ts
```

## Shared Resources (from `ordering` module)

- **Domain entities**: `Restaurant`, `Table`, `Meal`, `Guest`, `Reservation`
- **Domain enums**: `MealType`
- **ORM entities**: `RestaurantOrmEntity`, `TableOrmEntity`, `MealOrmEntity`, `ReservationOrmEntity`, `GuestOrmEntity`
- **Mappers**: Reuse existing mappers for domain ↔ ORM conversion

## Design Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Authentication | None | Not needed for MVP, can add later |
| Delete behavior | Cascade | Simpler UX, single operation |
| Validation | Minimal | Required fields + correct types only |
| API response | Return full entity | Standard REST, client has data immediately |
| Module separation | Separate `admin` module | Clean boundaries, easier to secure later |

## Cascade Delete Rules

- Delete Restaurant → deletes all its Tables and Meals
- Delete Table → deletes all Reservations for that table
- Delete Meal → no cascade (meals are referenced by guests, but guests belong to reservations)
