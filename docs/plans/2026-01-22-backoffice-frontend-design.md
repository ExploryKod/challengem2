# Backoffice Frontend Design

> Internal management tool for restaurant owners in the luxury sector

## Context

The backoffice is an internal tool (not web-exposed) for restaurant, coffee shop, or similar establishment owners to manage their business: restaurants, tables, meals, and reservations.

The backend admin API is ready with full CRUD on:
- `GET/POST/PUT/DELETE /admin/restaurants`
- `GET/POST/PUT/DELETE /admin/meals?restaurantId=`
- `GET/POST/PUT/DELETE /admin/tables?restaurantId=`
- `GET/POST/PUT/DELETE /admin/reservations?restaurantId=`

## Navigation & Information Architecture

### Routes

| Route | Purpose |
|-------|---------|
| `/admin` | Restaurant list (landing page) |
| `/admin/restaurants/[id]` | Restaurant detail with tabs |

### User Flow

1. **Landing page**: Grid of restaurant cards with "Créer" button
2. **Click "Gérer"**: Navigate to restaurant detail page
3. **Detail page**: Tabbed interface `[Informations] [Tables] [Repas] [Réservations]`
4. **CRUD operations**: All create/edit via modal dialogs

## Visual Design (Luxury Warm)

### Color Palette

| Purpose | Color | Hex |
|---------|-------|-----|
| Primary background | Deep burgundy/charcoal | `#1E1E2E` |
| Secondary background | Rich navy | `#1A1A2E` |
| Accent | Warm gold | `#D4AF37` |
| Text primary | Cream white | `#FAF3E0` |
| Text secondary | Muted gold | `rgba(212, 175, 55, 0.7)` |
| Destructive | Muted rose | `#8B3A4A` |
| Card border | Subtle gold | `rgba(212, 175, 55, 0.3)` |

### Typography

- **Headings**: Serif font (Playfair Display or system serif) for elegance
- **Body**: Sans-serif (Tailwind default) for readability
- **Labels**: Gold accent color

### Component Patterns

**Cards:**
- Dark background (`#1A1A2E`) with subtle gold border
- Hover: border brightens, subtle gold shadow glow
- Rounded corners (`rounded-xl`)
- Generous padding

**Buttons:**
- Primary (Create/Save): Gold background, dark text
- Secondary (Cancel/Back): Transparent with gold border
- Destructive (Delete): Muted rose background

**Tab Bar:**
- Underline style on dark background
- Active: Gold text with gold underline (2px)
- Inactive: Muted cream text

**Modals:**
- Dark overlay (`rgba(0,0,0,0.8)`)
- Navy background with gold border
- Gold accent line beneath title
- Form inputs: Dark background, gold focus ring

## Page Layouts

### Landing Page (Restaurant List)

```
┌─────────────────────────────────────────────────────────┐
│  [Header with nav]                                      │
├─────────────────────────────────────────────────────────┤
│                                                         │
│     Vos Établissements                    [+ Créer]     │
│                                                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │ Le Château   │  │ Café Doré    │  │ La Brasserie │  │
│  │ Gastronomique│  │ Coffee Shop  │  │ Française    │  │
│  │ 12 tables    │  │ 8 tables     │  │ 15 tables    │  │
│  │              │  │              │  │              │  │
│  │ [Gérer]      │  │ [Gérer]      │  │ [Gérer]      │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### Restaurant Detail Page

```
┌─────────────────────────────────────────────────────────┐
│  [← Retour]              Le Château                     │
├─────────────────────────────────────────────────────────┤
│  [Informations]  [Tables]  [Repas]  [Réservations]      │
│  ─────────────────────────────────────────────────────  │
│                                                         │
│  Tables (8)                              [+ Ajouter]    │
│                                                         │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐     │
│  │ Table 1     │  │ Table 2     │  │ Table 3     │     │
│  │ 4 couverts  │  │ 2 couverts  │  │ 6 couverts  │     │
│  │ [Edit][Del] │  │ [Edit][Del] │  │ [Edit][Del] │     │
│  └─────────────┘  └─────────────┘  └─────────────┘     │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

## Tab Content

### [Informations] Tab
- Display: Name, Type (editable form)
- Actions: Save changes, Delete restaurant (with confirmation)

### [Tables] Tab
- Grid of cards: Name/number, capacity (couverts)
- Actions: Add, Edit, Delete

### [Repas] Tab
- Grid of cards: Name, Type badge (Entrée/Plat/Dessert/Boisson), Price
- Optional: Age restriction indicator
- Actions: Add, Edit, Delete

### [Réservations] Tab
- List of reservations: Table, Guest names, Date/time
- Actions: View details, Edit, Cancel/Delete

## Domain Model

Extend `BackofficeDomainModel` namespace:

```typescript
export namespace BackofficeDomainModel {
    // Existing
    export type Restaurant = {
        id: number;
        name: string;
        type: string;
    }

    // Add
    export type Table = {
        id: number;
        name: string;
        capacity: number;
        restaurantId: number;
    }

    export type Meal = {
        id: number;
        name: string;
        type: 'ENTRY' | 'MAIN_COURSE' | 'DESSERT' | 'DRINK';
        price: number;
        requiredAge: number | null;
        restaurantId: number;
    }

    export type Guest = {
        id: string;
        firstName: string;
        lastName: string;
        age: number;
    }

    export type Reservation = {
        id: number;
        tableId: number;
        guests: Guest[];
        restaurantId: number;
    }

    // DTOs for create/update operations
    export type CreateTableDTO = Omit<Table, 'id'>;
    export type CreateMealDTO = Omit<Meal, 'id'>;
    export type CreateReservationDTO = Omit<Reservation, 'id'>;
}
```

## File Structure

```
front/src/
├── app/admin/
│   └── restaurants/
│       └── [id]/
│           └── page.tsx              # Restaurant detail page
│
└── modules/backoffice/
    ├── core/
    │   ├── model/
    │   │   └── backoffice.domain-model.ts  # Extended types
    │   ├── store/
    │   │   └── backoffice.slice.ts         # Extended state
    │   ├── gateway/                         # Add table, meal interfaces if needed
    │   ├── gateway-infra/                   # In-memory adapters
    │   ├── testing/                         # Stubs
    │   └── useCase/                         # Use cases with tests
    │
    └── react/
        ├── components/
        │   ├── ui/                    # Shared luxury UI components
        │   │   ├── LuxuryCard.tsx
        │   │   ├── LuxuryButton.tsx
        │   │   ├── LuxuryModal.tsx
        │   │   └── LuxuryTabs.tsx
        │   └── forms/
        │       ├── TableForm.tsx
        │       └── MealForm.tsx
        │
        ├── pages/
        │   └── restaurant-detail/
        │       ├── RestaurantDetailPage.tsx
        │       └── use-restaurant-detail.ts
        │
        └── sections/
            ├── restaurant-info/
            │   ├── RestaurantInfoSection.tsx
            │   └── use-restaurant-info.hook.ts
            ├── tables/
            │   ├── TablesSection.tsx
            │   └── use-tables.hook.ts
            ├── meals/
            │   ├── MealsSection.tsx
            │   └── use-meals.hook.ts
            └── reservations/
                ├── ReservationsSection.tsx
                └── use-reservations.hook.ts
```

## Implementation Order

1. **Luxury UI components**: LuxuryCard, LuxuryButton, LuxuryModal, LuxuryTabs
2. **Domain model extensions**: Add Table, Meal, Reservation types
3. **Redux slice updates**: Add state for selected restaurant, tables, meals, reservations
4. **Restaurant detail page**: Route + tab structure
5. **Informations tab**: Edit restaurant form
6. **Tables tab**: CRUD with use cases + tests
7. **Meals tab**: CRUD with use cases + tests
8. **Reservations tab**: CRUD with use cases + tests

## Out of Scope

- Refactoring existing pages to luxury style (future)
- Bulk operations, CSV import/export
- Advanced scheduling features
- Authentication/authorization

## Architecture Alignment

Follow existing hexagonal architecture patterns:
- Domain models in `core/model/`
- Gateways (ports) in `core/gateway/`, HTTP adapters alongside
- In-memory adapters in `core/gateway-infra/`
- Use cases in `core/useCase/` with TDD tests
- Redux slice in `core/store/`
- React pages/sections/hooks follow presenter pattern
- Test doubles (stubs, failing gateways) in `core/testing/`
