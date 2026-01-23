# Menu Composer Feature Design

**Date:** 2026-01-23
**Status:** Approved

## Overview

Complete menu system allowing restaurants to create bundled meal offers, and customers to select menus or order à la carte during the reservation flow.

---

## 1. Key Design Decisions

| Decision | Choice |
|----------|--------|
| Meal selection for menus | Category slots with free choice — menu defines slots (1× Entrée, 1× Plat), customer picks any meal within category |
| Menu selection placement | Integrated into existing MEALS_PREVIEW step |
| Pricing model | Fixed menu price per guest, regardless of specific meals chosen |
| Mixed orders | Yes — each guest independently chooses menu OR à la carte |
| Menu guest guidance | Constrained selection — only show categories included in menu, with required indicators |
| Menu composition | Category slots only (mealType + quantity) — all active meals of that type become available |

---

## 2. Domain Model Changes

### Frontend (`ordering.domain-model.ts`)

```typescript
// New Menu types
export type Menu = {
    id: string;
    restaurantId: RestaurantId;
    title: string;
    description: string;
    price: number;
    imageUrl: string;
    items: MenuItem[];
}

export type MenuItem = {
    mealType: MealType;
    quantity: number;
}

// Updated Guest — add optional menuId
export type Guest = {
    // ...existing fields...
    menuId: string | null;  // null = à la carte
}
```

### Redux State (`ordering.slice.ts`)

```typescript
// Add to OrderingState
availableMenus: {
    data: Menu[];
    status: 'idle' | 'loading' | 'success' | 'error';
    error: string | null;
}

selectedMenuId: string | null;  // Temporary selection before guests are defined
```

### Backend

Existing `Menu` and `MenuItem` entities are sufficient — no changes needed.

---

## 3. MEALS_PREVIEW Integration

### Enhanced Layout

```
┌─────────────────────────────────────────────────────┐
│              Découvrez notre carte                  │
├─────────────────────────────────────────────────────┤
│                                                     │
│  NOS MENUS                                          │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐ │
│  │ [image]     │  │ [image]     │  │ [image]     │ │
│  │ Menu        │  │ Menu        │  │ Menu        │ │
│  │ Découverte  │  │ Gastronomique│ │ Express     │ │
│  │ 45€         │  │ 75€         │  │ 28€         │ │
│  │ 1E+1P+1D    │  │ 1E+1P+1D+1B │  │ 1P+1B       │ │
│  │[Sélectionner]│ │[Sélectionner]│ │[Sélectionner]│ │
│  └─────────────┘  └─────────────┘  └─────────────┘ │
│                                                     │
│  ─────────── Ou composez à la carte ───────────    │
│                                                     │
│  ENTRÉES                                            │
│  [meal cards horizontal scroll...]                  │
│                                                     │
│  PLATS                                              │
│  [meal cards horizontal scroll...]                  │
│                                                     │
│  [Précédent]                          [Suivant]    │
└─────────────────────────────────────────────────────┘
```

### User Flow

1. User sees menu bundles at top
2. Can select a menu → stored in `selectedMenuId`
3. Or browse à la carte meals below
4. Clicks "Suivant" → proceeds to TABLE step
5. When guests are created, each inherits `selectedMenuId` by default

---

## 4. MEALS Step Behavior

### For Guests with Menu (`menuId !== null`)

**Visual:**
- Header badge: "Menu Découverte" + price
- Progress: "1/3 sélections"
- Only categories from menu displayed
- "Requis" badge on each category

**Behavior:**
- Must select exact quantity defined (e.g., 1× Entrée)
- Cannot proceed until complete
- "Changer pour à la carte" link → sets `menuId = null`

### For À la Carte Guests (`menuId === null`)

**No changes from current:**
- All categories shown
- All selections optional
- "Choisir un menu" link → opens menu picker

### Validation

```typescript
const isGuestComplete = (guest: Guest, menus: Menu[]): boolean => {
    if (!guest.menuId) return true; // À la carte always valid

    const menu = menus.find(m => m.id === guest.menuId);
    return menu.items.every(item => {
        const selectedMealId = getMealIdForType(guest, item.mealType);
        return selectedMealId !== null;
    });
};
```

---

## 5. Summary & Price Calculation

### Calculation Logic

```typescript
const calculateTotal = (guests: Guest[], meals: Meal[], menus: Menu[]): number => {
    return guests.reduce((total, guest) => {
        if (guest.menuId) {
            const menu = menus.find(m => m.id === guest.menuId);
            return total + (menu?.price || 0);
        } else {
            const guestMealIds = [
                guest.meals.entry,
                guest.meals.mainCourse,
                guest.meals.dessert,
                guest.meals.drink
            ].filter(Boolean);

            const mealTotal = guestMealIds.reduce((sum, mealId) => {
                const meal = meals.find(m => m.id === mealId);
                return sum + (meal?.price || 0);
            }, 0);

            return total + mealTotal;
        }
    }, 0);
};
```

### Summary Display

**Per guest card:**
- Badge: "Menu Découverte (45€)" or "À la carte"
- List of selected meals

**Total section:**
```
2× Menu Découverte:  90€
À la carte:          52€
─────────────────────────
Total estimé:       142€
```

---

## 6. Backoffice Menu Composer

### Create/Edit Modal

```
┌─────────────────────────────────────────┐
│ Nouveau menu                            │
├─────────────────────────────────────────┤
│ Nom du menu: [Menu Découverte      ]    │
│ Description: [Entrée + Plat + Dessert]  │
│ Prix (EUR):  [45                    ]   │
│ URL image:   [https://...           ]   │
│                                         │
│ Composition du menu:                    │
│ ┌─────────────────────────────────────┐ │
│ │ Entrée      [-] 1 [+]               │ │
│ │ Plat        [-] 1 [+]               │ │
│ │ Dessert     [-] 1 [+]               │ │
│ │ Boisson     [-] 0 [+]               │ │
│ └─────────────────────────────────────┘ │
│                                         │
│ [Créer]  [Annuler]                      │
└─────────────────────────────────────────┘
```

### Menu Card Actions
- Activer/Désactiver (existing)
- Modifier (new)
- Supprimer (existing)

---

## 7. API Requirements

### Existing Endpoints (sufficient)
- `GET /menus?restaurantId=xxx&activeOnly=true`
- `POST /menus`
- `PUT /menus/:id`
- `DELETE /menus/:id`

### Missing Endpoint
- `GET /menus/:id` — needed for fetching single menu details

---

## 8. Implementation Tasks

### Backend (2 tasks)
1. Add `GET /menus/:id` endpoint
2. Verify menu items are returned with menu list

### Frontend - Backoffice (2 tasks)
3. Add items composer to create modal
4. Add edit menu modal

### Frontend - Client Order Flow (8 tasks)
5. Add `Menu` type to `ordering.domain-model.ts`
6. Add `availableMenus` + `selectedMenuId` to Redux slice
7. Create menu gateway (port + HTTP adapter)
8. Create `fetch-menus.usecase.ts`
9. Update `fetcher.listener.ts` to fetch menus
10. Update MEALS_PREVIEW with menu cards
11. Update MEALS with constrained selection
12. Update Summary with menu pricing

### Testing (3 tasks)
13. `fetch-menus.usecase.test.ts`
14. Menu selection integration tests
15. Stub menu gateway

**Total: 15 tasks**

---

## 9. File Changes Summary

### New Files
```
front/src/modules/order/core/gateway/menu.gateway.ts
front/src/modules/order/core/gateway/http.menu-gateway.ts
front/src/modules/order/core/useCase/fetch-menus.usecase.ts
front/src/modules/order/core/useCase/fetch-menus.usecase.test.ts
front/src/modules/order/core/testing/stub.menu-gateway.ts
```

### Modified Files
```
front/src/modules/order/core/model/ordering.domain-model.ts
front/src/modules/order/core/store/ordering.slice.ts
front/src/modules/order/core/store/fetcher.listener.ts
front/src/modules/order/react/sections/meals-preview/MealsPreviewSection.tsx
front/src/modules/order/react/sections/meals-preview/use-meals-preview.hook.ts
front/src/modules/order/react/sections/meals/MealsSection.tsx
front/src/modules/order/react/sections/meals/use-meals.hook.ts
front/src/modules/order/react/sections/summary/SummarySection.tsx
front/src/modules/order/react/sections/summary/use-summary.hook.ts
front/src/modules/backoffice/react/sections/menus/MenusSection.tsx
back/src/modules/ordering/infrastructure/http/controllers/menu.controller.ts
```
