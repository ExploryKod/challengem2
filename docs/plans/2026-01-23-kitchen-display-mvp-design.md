# Kitchen Display MVP Design

**Date:** 2026-01-23
**Status:** Approved

## Overview

A single-purpose React Native app for kitchen staff to view incoming orders and mark them as ready, per table and meal course.

### Key Characteristics
- No authentication (device assigned to kitchen)
- Polling-based updates (every 8 seconds)
- Per-table order cards with meal-type grouping
- Filter tabs by course type (All / Entries / Mains / Desserts / Drinks)
- Uses existing `ReservationStatus` with new `IN_PREPARATION` value

### Out of Scope for MVP
- Login/authentication
- WebSocket real-time
- Per-item tracking
- Multiple restaurants (single restaurant context)
- Notifications/sounds

---

## 1. Data Model Changes

### Backend Changes

**1. Add `IN_PREPARATION` to ReservationStatus enum:**
```typescript
// back/src/modules/ordering/domain/enums/reservation-status.enum.ts
export enum ReservationStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  SEATED = 'SEATED',
  IN_PREPARATION = 'IN_PREPARATION',  // NEW
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}
```

**2. Track which courses are ready (on Reservation entity):**
```typescript
// Add to Reservation entity
coursesReady: {
  entry: boolean;
  mainCourse: boolean;
  dessert: boolean;
  drink: boolean;
}
```

This allows partial progress: "entries ready, mains still cooking."

**3. No new entities needed** - leverages existing:
- `Reservation` (has tableId, status, guests)
- `Guest` (has meals with entry/mainCourse/dessert/drink)
- `Table` (has title for display)

---

## 2. API Endpoints

### New Kitchen Endpoints

**1. Get active orders for kitchen:**
```
GET /kitchen/orders?restaurantId=xxx
```
Returns reservations with status `SEATED` or `IN_PREPARATION`, including:
- Table name
- Guest count
- Aggregated meals by type (with quantities)
- Which courses are ready

Response shape:
```typescript
{
  id: number;
  tableTitle: string;
  guestCount: number;
  status: 'SEATED' | 'IN_PREPARATION';
  createdAt: string;
  meals: {
    entry: { count: number; items: string[] };
    mainCourse: { count: number; items: string[] };
    dessert: { count: number; items: string[] };
    drink: { count: number; items: string[] };
  };
  coursesReady: {
    entry: boolean;
    mainCourse: boolean;
    dessert: boolean;
    drink: boolean;
  };
}
```

**2. Mark course as ready:**
```
PATCH /kitchen/orders/:reservationId/course-ready
Body: { course: 'entry' | 'mainCourse' | 'dessert' | 'drink' }
```
- Sets `coursesReady[course] = true`
- If first course marked → status becomes `IN_PREPARATION`
- If all ordered courses ready → status becomes `COMPLETED`

---

## 3. Mobile App Structure

### Module Structure
```
mobile/src/modules/kitchen/
├── core/
│   ├── model/
│   │   └── kitchen.domain-model.ts    # KitchenOrder type
│   ├── gateway/
│   │   ├── kitchen.gateway.ts         # Interface
│   │   └── http.kitchen-gateway.ts    # HTTP implementation
│   └── store/
│       └── kitchen.slice.ts           # Redux state + polling logic
└── react/
    ├── screens/
    │   └── KitchenScreen.tsx          # Main screen
    ├── components/
    │   ├── OrderCard.tsx              # Single order card
    │   ├── CourseSection.tsx          # Meal type section with "Ready" button
    │   └── FilterTabs.tsx             # All | Entries | Mains | Desserts | Drinks
    └── hooks/
        └── use-kitchen.hook.ts        # Presenter hook
```

### State Shape
```typescript
{
  orders: KitchenOrder[];
  filter: 'all' | 'entry' | 'mainCourse' | 'dessert' | 'drink';
  loading: boolean;
  error: string | null;
}
```

### Polling
`useEffect` with `setInterval` every 8 seconds, fetches `/kitchen/orders`.

---

## 4. UI Layout

### KitchenScreen Layout
```
┌─────────────────────────────────────┐
│  🍳 Kitchen Display                 │
├─────────────────────────────────────┤
│ [All] [Entries] [Mains] [Desserts] [Drinks] │  ← FilterTabs
├─────────────────────────────────────┤
│ ┌─────────────────────────────────┐ │
│ │ TABLE 5              3 guests   │ │
│ │ ───────────────────────────────│ │
│ │ 🥗 Entries (2)         [READY] │ │
│ │    Salade César, Soupe          │ │
│ │ 🍖 Mains (3)           [READY] │ │
│ │    Entrecôte x2, Saumon         │ │
│ │ 🍰 Desserts (2)        [ — ]   │ │
│ │    Tiramisu, Fondant            │ │
│ └─────────────────────────────────┘ │
│ ┌─────────────────────────────────┐ │
│ │ TABLE 2              2 guests   │ │
│ │ ...                             │ │
│ └─────────────────────────────────┘ │
└─────────────────────────────────────┘
```

### Design System
- Gold accent for header and ready buttons
- Cards use `bgCard` color from existing theme
- Green checkmark replaces button when course is ready
- Cards sorted by `createdAt` (oldest first - FIFO)

---

## 5. Implementation Order

### Phase 1: Backend
1. Add `IN_PREPARATION` to ReservationStatus enum
2. Add `coursesReady` field to Reservation entity + ORM entity
3. Update ReservationMapper for new field
4. Create `GetKitchenOrdersUseCase`
5. Create `MarkCourseReadyUseCase`
6. Create `KitchenController` with 2 endpoints
7. Register in OrderingModule

### Phase 2: Mobile
1. Create `kitchen` module structure
2. Define `KitchenDomainModel` types
3. Implement `IKitchenGateway` interface
4. Implement `HttpKitchenGateway`
5. Create `kitchenSlice` with actions
6. Build `FilterTabs` component
7. Build `CourseSection` component
8. Build `OrderCard` component
9. Build `KitchenScreen`
10. Create `useKitchen` hook
11. Wire up navigation

### Phase 3: Testing
- Backend: Unit tests for use cases with in-memory repository
- Mobile: Stub gateway for development/testing

---

## 6. User Flow

1. App opens → shows list of active orders (status `SEATED` or `IN_PREPARATION`)
2. Each card shows: Table name, guest count, meals grouped by type with quantities
3. Kitchen staff taps filter tab to focus on specific course (e.g., "Mains")
4. Tap "READY" button on a course section → marks that course as ready
5. When all ordered courses ready → reservation moves to `COMPLETED` and disappears from list
