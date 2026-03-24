# Terminal Flow & System Enhancements Design

**Date:** 2026-01-23
**Status:** Approved

## Overview

Comprehensive enhancement of the Taste Federation system including:
- New "Digital Concierge" terminal flow for luxury restaurants
- Order module bug fixes
- Backoffice enhancements (menus, reservations, QR codes)
- React Native staff app

---

## 1. Data Model Changes (Backend)

### New Entities

#### Menu Entity
```typescript
// back/src/modules/ordering/domain/entities/menu.entity.ts
Menu {
  id: number
  restaurantId: number
  title: string          // "Menu Découverte"
  description: string    // "Entrée + Plat + Dessert"
  price: number          // Fixed price (e.g., 45€)
  imageUrl: string
  isActive: boolean
  items: MenuItem[]
}

MenuItem {
  id: number
  menuId: number
  mealType: MealType     // ENTRY, MAIN_COURSE, DESSERT, DRINK
  quantity: number       // How many of this type
  availableMeals: Meal[] // Which meals can be chosen
}
```

#### Updated GuestMeals (quantities support)
```typescript
GuestMeals {
  entry: { mealId: number | null, quantity: number }
  mainCourse: { mealId: number | null, quantity: number }
  dessert: { mealId: number | null, quantity: number }
  drink: { mealId: number | null, quantity: number }
  menuId: number | null
}
```

#### Updated Reservation
```typescript
Reservation {
  // existing fields...
  status: 'PENDING' | 'CONFIRMED' | 'SEATED' | 'COMPLETED' | 'CANCELLED'
  updatedAt: Date
  notes: string
  reservationCode: string  // e.g., "ABC123"
}
```

---

## 2. API Endpoints

### Menu Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/menus?restaurantId=xxx` | List menus for restaurant |
| GET | `/menus/:id` | Get menu with items |
| POST | `/menus` | Create menu |
| PUT | `/menus/:id` | Update menu |
| DELETE | `/menus/:id` | Delete menu |
| POST | `/menus/:id/items` | Add item to menu |
| DELETE | `/menus/:menuId/items/:itemId` | Remove item |

### Updated Reservation Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/reservations?restaurantId=xxx&status=xxx` | Filter reservations |
| GET | `/reservations/code/:code` | Find by code (terminal) |
| PUT | `/reservations/:id` | Update reservation |
| PATCH | `/reservations/:id/status` | Quick status change |

### Terminal Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/terminal/check-in` | Walk-in creates pending reservation |
| GET | `/terminal/lookup?code=xxx` | Lookup existing reservation |

### QR Code
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/tables/:id/qr-data` | Returns URL for QR generation |

---

## 3. Terminal Flow (Frontend)

### URL Change
- **Old:** `/order/[restaurantId]`
- **New:** `/terminal?restaurantId=xxx`

### Terminal Steps
```typescript
enum TerminalStep {
  WELCOME = 0,      // "Avez-vous une réservation ?"
  IDENTIFY = 1,     // Enter code OR walk-in
  MENU_BROWSE = 2,  // Preview dishes
  PRE_ORDER = 3,    // Optional meal selection with quantities
  CONFIRMATION = 4  // Staff handoff message
}
```

### Step Details

**WELCOME:**
- Restaurant branding
- "J'ai une réservation" / "Sans réservation" buttons

**IDENTIFY:**
- Reservation: code/name input + search
- Walk-in: guest count → create pending reservation

**MENU_BROWSE:**
- Show menus and meals
- "Pré-commander" or "Passer"

**PRE_ORDER:**
- Meal selection with +/- quantity controls
- Menu bundle selection
- Running total

**CONFIRMATION:**
- "Un membre de notre équipe va vous accueillir"
- Display reservation code
- Auto-reset after 10 seconds

---

## 4. Order Module Bug Fixes

| Issue | Fix |
|-------|-----|
| "Précédent" shows restaurants in terminal | Check `isTerminalMode`, navigate within terminal steps |
| Refresh resets state | Store state in URL query params |
| Can't cancel meal selection | Toggle off on click, set to null |
| No quantity selection | Update model to `{ mealId, quantity }`, add +/- controls |
| Missing table icon in summary | Add Lucide table icon |
| Confirmation message wrong | Dynamic message based on context |

---

## 5. Backoffice Enhancements

### Menus Tab (new)
- List menus with price, items
- Create/edit/delete menus
- Multi-select meals per type
- Active/inactive toggle

### Meals Section
- Show thumbnail images
- Fallback placeholder
- Image preview in modals

### Reservations Section
- Expand to see guest orders
- Edit modal (guests, meals, table, status)
- Status badges
- Filter by status/date
- Staff notes field

### Tables Section
- QR code button per table
- Modal with preview + download/print

---

## 6. React Native Staff App

### Tech Stack
- React Native + Expo
- Hexagonal/Clean Architecture
- Luxury warm design system
- Same NestJS backend

### Structure
```
mobile/
├── src/
│   ├── modules/
│   │   ├── auth/
│   │   ├── orders/
│   │   ├── reservations/
│   │   ├── tables/
│   │   └── shared/
│   ├── navigation/
│   └── App.tsx
├── app.json
└── package.json
```

### Screens
1. Login
2. Dashboard (today's reservations, pending orders)
3. Reservations List
4. Reservation Detail (view/edit)
5. Tables Overview
6. Order Management

### Staff Privileges
- Change reservation status
- Modify any order
- Add/remove guests
- Assign tables
- View all reservations
- Add staff notes

---

## 7. Implementation Order

1. **Backend:** Menu entity, reservation updates, terminal endpoints
2. **Backoffice:** Menus tab, meal images, reservation management, QR codes
3. **Terminal:** New route, terminal slice, bug fixes
4. **Mobile:** Expo setup, screens, integration testing

---

## 8. Testing Strategy

- Backend: TDD with in-memory stubs
- Frontend: Use case tests, form tests, slice tests
- Mobile: Same patterns, mock server, manual E2E
