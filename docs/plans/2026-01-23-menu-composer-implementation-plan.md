# Menu Composer Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Implement complete menu system allowing restaurants to create bundled meal offers, and customers to select menus or order à la carte.

**Architecture:** Hexagonal architecture with ports/adapters pattern. Menu gateway fetches from backend API. Redux slice stores available menus and selected menu. MEALS_PREVIEW step displays menu cards above meal preview. MEALS step constrains selection for menu guests.

**Tech Stack:** React, Redux Toolkit, TypeScript, NestJS backend

---

## Task 1: Backend - Add GET /menus/:id endpoint

**Files:**
- Modify: `back/src/modules/ordering/infrastructure/http/controllers/menu.controller.ts`

**Step 1: Add the endpoint**

In `menu.controller.ts`, add after the `findAll` method:

```typescript
@Get(':id')
async findOne(@Param('id', ParseIntPipe) id: number): Promise<Menu> {
  const menu = await this.getMenusUseCase.executeOne(id);
  if (!menu) {
    throw new NotFoundException(`Menu with id ${id} not found`);
  }
  return menu;
}
```

**Step 2: Update GetMenusUseCase to support single fetch**

Modify `back/src/modules/ordering/application/use-cases/get-menus.use-case.ts`:

```typescript
async executeOne(id: number): Promise<Menu | null> {
  return this.menuRepository.findById(id);
}
```

**Step 3: Add findById to repository port**

Modify `back/src/modules/ordering/application/ports/menu.repository.port.ts`:

```typescript
findById(id: number): Promise<Menu | null>;
```

**Step 4: Implement in repository**

Modify `back/src/modules/ordering/infrastructure/persistence/repositories/menu.repository.ts`:

```typescript
async findById(id: number): Promise<Menu | null> {
  const orm = await this.menuRepo.findOne({
    where: { id },
    relations: ['items'],
  });
  return orm ? MenuMapper.toDomain(orm) : null;
}
```

**Step 5: Test manually**

```bash
curl http://localhost:3000/menus/1
```

**Step 6: Commit**

```bash
git add back/src/modules/ordering/
git commit -m "feat(ordering): add GET /menus/:id endpoint"
```

---

## Task 2: Frontend - Add Menu types to domain model

**Files:**
- Modify: `front/src/modules/order/core/model/ordering.domain-model.ts`

**Step 1: Add Menu types**

Add after the `Meal` type definition:

```typescript
export type MenuItem = {
    mealType: MealType;
    quantity: number;
}

export type Menu = {
    id: string;
    restaurantId: RestaurantId;
    title: string;
    description: string;
    price: number;
    imageUrl: string;
    items: MenuItem[];
}
```

**Step 2: Update Guest type to include menuId**

Modify the existing `Guest` type:

```typescript
export type Guest = {
    id: string | number,
    firstName: string,
    lastName: string,
    age: number,
    meals: {
        entry: MealId | null,
        mainCourse: MealId | null,
        dessert: MealId | null,
        drink : MealId | null
    }
    restaurantId: RestaurantId,
    isOrganizer: boolean,
    menuId: string | null  // ADD THIS LINE - null means à la carte
}
```

**Step 3: Commit**

```bash
git add front/src/modules/order/core/model/ordering.domain-model.ts
git commit -m "feat(order): add Menu types and menuId to Guest in domain model"
```

---

## Task 3: Frontend - Add menu state to Redux slice

**Files:**
- Modify: `front/src/modules/order/core/store/ordering.slice.ts`

**Step 1: Update OrderingState type**

Add to the `OrderingState` type:

```typescript
export type OrderingState = {
    step: OrderingDomainModel.OrderingStep,
    form: OrderingDomainModel.Form,
    restaurantId: OrderingDomainModel.RestaurantId,
    isTerminalMode: boolean;
    selectedMenuId: string | null;  // ADD THIS
    availableTables: {
        data: OrderingDomainModel.Table[];
        status: 'idle' | 'loading' | 'success' | 'error';
        error: string | null;
    };
    availableMeals: {
        data: OrderingDomainModel.Meal[];
        status: 'idle' | 'loading' | 'success' | 'error';
        error: string | null;
    };
    availableMenus: {  // ADD THIS BLOCK
        data: OrderingDomainModel.Menu[];
        status: 'idle' | 'loading' | 'success' | 'error';
        error: string | null;
    };
    reservation: ReservationStatus;
}
```

**Step 2: Update initialState**

```typescript
export const initialState: OrderingState = {
    step: OrderingDomainModel.OrderingStep.RESTAURANT,
    form: {
        guests: [],
        organizerId: null,
        tableId: null
    },
    restaurantId: null,
    isTerminalMode: false,
    selectedMenuId: null,  // ADD THIS
    availableTables: {
        status: 'idle',
        error: null,
        data: []
    },
    availableMeals: {
        status: 'idle',
        error: null,
        data: []
    },
    availableMenus: {  // ADD THIS BLOCK
        status: 'idle',
        error: null,
        data: []
    },
    reservation: { status: "idle" }
}
```

**Step 3: Add reducers**

Add to the `reducers` object:

```typescript
// Menu reducers
handleMenusLoading: (state) => {
    state.availableMenus.status = 'loading';
    state.availableMenus.error = null;
},
handleMenusError: (state, action: PayloadAction<string>) => {
    state.availableMenus.status = 'error';
    state.availableMenus.error = action.payload;
},
storeMenus: (state, action: PayloadAction<OrderingDomainModel.Menu[]>) => {
    state.availableMenus.data = action.payload;
    state.availableMenus.status = 'success';
},
selectMenu: (state, action: PayloadAction<string | null>) => {
    state.selectedMenuId = action.payload;
},
```

**Step 4: Commit**

```bash
git add front/src/modules/order/core/store/ordering.slice.ts
git commit -m "feat(order): add menu state and reducers to ordering slice"
```

---

## Task 4: Frontend - Create menu gateway port

**Files:**
- Create: `front/src/modules/order/core/gateway/menu.gateway.ts`

**Step 1: Create the port interface**

```typescript
import { OrderingDomainModel } from "@taotask/modules/order/core/model/ordering.domain-model";

export interface IMenuGateway {
    getMenus(restaurantId: string | number): Promise<OrderingDomainModel.Menu[]>;
    getMenu(id: string): Promise<OrderingDomainModel.Menu | null>;
}
```

**Step 2: Commit**

```bash
git add front/src/modules/order/core/gateway/menu.gateway.ts
git commit -m "feat(order): create menu gateway port interface"
```

---

## Task 5: Frontend - Create HTTP menu gateway adapter

**Files:**
- Create: `front/src/modules/order/core/gateway/http.menu-gateway.ts`

**Step 1: Create the HTTP adapter**

```typescript
import { IMenuGateway } from "@taotask/modules/order/core/gateway/menu.gateway";
import { OrderingDomainModel } from "@taotask/modules/order/core/model/ordering.domain-model";
import { HttpClient } from "@taotask/modules/shared/infrastructure/http-client";

type BackendMenuItem = {
    id: number;
    mealType: 'ENTRY' | 'MAIN_COURSE' | 'DESSERT' | 'DRINK';
    quantity: number;
}

type BackendMenu = {
    id: number;
    restaurantId: number;
    title: string;
    description: string;
    price: number;
    imageUrl: string;
    isActive: boolean;
    items: BackendMenuItem[];
}

const mapBackendMenuToDomain = (backendMenu: BackendMenu): OrderingDomainModel.Menu => {
    return {
        id: String(backendMenu.id),
        restaurantId: String(backendMenu.restaurantId),
        title: backendMenu.title,
        description: backendMenu.description,
        price: backendMenu.price,
        imageUrl: backendMenu.imageUrl,
        items: backendMenu.items.map(item => ({
            mealType: item.mealType as OrderingDomainModel.MealType,
            quantity: item.quantity,
        })),
    };
};

export class HttpMenuGateway implements IMenuGateway {
    constructor(private readonly httpClient: HttpClient) {}

    async getMenus(restaurantId: string | number): Promise<OrderingDomainModel.Menu[]> {
        const backendMenus = await this.httpClient.get<BackendMenu[]>(
            `/menus?restaurantId=${restaurantId}&activeOnly=true`
        );
        return backendMenus.map(mapBackendMenuToDomain);
    }

    async getMenu(id: string): Promise<OrderingDomainModel.Menu | null> {
        try {
            const backendMenu = await this.httpClient.get<BackendMenu>(`/menus/${id}`);
            return mapBackendMenuToDomain(backendMenu);
        } catch {
            return null;
        }
    }
}
```

**Step 2: Commit**

```bash
git add front/src/modules/order/core/gateway/http.menu-gateway.ts
git commit -m "feat(order): create HTTP menu gateway adapter"
```

---

## Task 6: Frontend - Create stub menu gateway for testing

**Files:**
- Create: `front/src/modules/order/core/testing/stub.menu-gateway.ts`

**Step 1: Create the stub**

```typescript
import { IMenuGateway } from "@taotask/modules/order/core/gateway/menu.gateway";
import { OrderingDomainModel } from "@taotask/modules/order/core/model/ordering.domain-model";

export class StubMenuGateway implements IMenuGateway {
    constructor(private data: OrderingDomainModel.Menu[] = []) {}

    async getMenus(_restaurantId: string | number): Promise<OrderingDomainModel.Menu[]> {
        return this.data;
    }

    async getMenu(id: string): Promise<OrderingDomainModel.Menu | null> {
        return this.data.find(menu => menu.id === id) || null;
    }
}
```

**Step 2: Create failing gateway**

Create `front/src/modules/order/core/testing/failing.menu-gateway.ts`:

```typescript
import { IMenuGateway } from "@taotask/modules/order/core/gateway/menu.gateway";
import { OrderingDomainModel } from "@taotask/modules/order/core/model/ordering.domain-model";

export class FailingMenuGateway implements IMenuGateway {
    async getMenus(_restaurantId: string | number): Promise<OrderingDomainModel.Menu[]> {
        throw new Error("Failed to fetch data");
    }

    async getMenu(_id: string): Promise<OrderingDomainModel.Menu | null> {
        throw new Error("Failed to fetch data");
    }
}
```

**Step 3: Commit**

```bash
git add front/src/modules/order/core/testing/stub.menu-gateway.ts
git add front/src/modules/order/core/testing/failing.menu-gateway.ts
git commit -m "test(order): add stub and failing menu gateway for testing"
```

---

## Task 7: Frontend - Create menu factory for tests

**Files:**
- Create: `front/src/modules/order/core/model/menu.factory.ts`

**Step 1: Create the factory**

```typescript
import { OrderingDomainModel } from "@taotask/modules/order/core/model/ordering.domain-model";

export class MenuFactory {
    static create(overrides: Partial<OrderingDomainModel.Menu> = {}): OrderingDomainModel.Menu {
        return {
            id: "1",
            restaurantId: "1",
            title: "Menu Découverte",
            description: "Entrée + Plat + Dessert",
            price: 45,
            imageUrl: "/menu-decouverte.jpg",
            items: [
                { mealType: OrderingDomainModel.MealType.ENTRY, quantity: 1 },
                { mealType: OrderingDomainModel.MealType.MAIN_COURSE, quantity: 1 },
                { mealType: OrderingDomainModel.MealType.DESSERT, quantity: 1 },
            ],
            ...overrides,
        };
    }
}
```

**Step 2: Commit**

```bash
git add front/src/modules/order/core/model/menu.factory.ts
git commit -m "test(order): add menu factory for testing"
```

---

## Task 8: Frontend - Register menu gateway in dependencies

**Files:**
- Modify: `front/src/modules/store/dependencies.ts`

**Step 1: Add IMenuGateway to Dependencies type**

```typescript
import { IMealGateway } from '@taotask/modules/order/core/gateway/meal.gateway';
import { IMenuGateway } from '@taotask/modules/order/core/gateway/menu.gateway';  // ADD THIS
import { IIDProvider } from '@taotask/modules/core/id-provider';
import { ITableGateway } from '@taotask/modules/order/core/gateway/table.gateway';
import { IReservationGateway } from "@taotask/modules/order/core/gateway/reservation.gateway";
import { IRestaurantGateway } from "@taotask/modules/order/core/gateway/restaurant.gateway";
import { IRestaurantManagementGateway } from "@taotask/modules/backoffice/core/gateway/restaurant.gateway";
import { ITableManagementGateway } from "@taotask/modules/backoffice/core/gateway/table-management.gateway";
import { IMealManagementGateway } from "@taotask/modules/backoffice/core/gateway/meal-management.gateway";
import { IReservationManagementGateway } from "@taotask/modules/backoffice/core/gateway/reservation-management.gateway";

export type Dependencies = {
    idProvider?: IIDProvider;
    tableGateway?: ITableGateway;
    mealGateway?: IMealGateway;
    menuGateway?: IMenuGateway;  // ADD THIS
    reservationGateway?: IReservationGateway;
    restaurantGateway?: IRestaurantGateway;
    restaurantManagementGateway?: IRestaurantManagementGateway;
    tableManagementGateway?: ITableManagementGateway;
    mealManagementGateway?: IMealManagementGateway;
    reservationManagementGateway?: IReservationManagementGateway;
};
```

**Step 2: Commit**

```bash
git add front/src/modules/store/dependencies.ts
git commit -m "feat(store): register menu gateway in dependencies"
```

---

## Task 9: Frontend - Create fetch-menus use case with TDD

**Files:**
- Create: `front/src/modules/order/core/useCase/fetch-menus.usecase.test.ts`
- Create: `front/src/modules/order/core/useCase/fetch-menus.usecase.ts`

**Step 1: Write the failing test**

Create `fetch-menus.usecase.test.ts`:

```typescript
import { createTestStore } from "@taotask/modules/testing/tests-environment";
import { MenuFactory } from "@taotask/modules/order/core/model/menu.factory";
import { fetchMenus } from "@taotask/modules/order/core/useCase/fetch-menus.usecase";
import { FailingMenuGateway } from "@taotask/modules/order/core/testing/failing.menu-gateway";
import { StubMenuGateway } from "@taotask/modules/order/core/testing/stub.menu-gateway";

describe("Fetch menus", () => {
    it("Should fetch menus for a restaurant", async () => {
        const menu = MenuFactory.create({ id: "1" });
        const listOfMenus = [menu];

        const store = createTestStore({
            dependencies: {
                menuGateway: new StubMenuGateway(listOfMenus),
            },
            preloadedState: {
                ordering: {
                    restaurantId: "1",
                },
            },
        });

        const promise = store.dispatch(fetchMenus);
        expect(store.getState().ordering.availableMenus.status).toEqual("loading");

        await promise;
        expect(store.getState().ordering.availableMenus.data).toEqual(listOfMenus);
        expect(store.getState().ordering.availableMenus.status).toEqual("success");
    });

    it("Should handle fetching menus errors", async () => {
        const store = createTestStore({
            dependencies: {
                menuGateway: new FailingMenuGateway(),
            },
            preloadedState: {
                ordering: {
                    restaurantId: "1",
                },
            },
        });

        const promise = store.dispatch(fetchMenus);
        expect(store.getState().ordering.availableMenus.status).toEqual("loading");
        await promise;

        expect(store.getState().ordering.availableMenus.data).toEqual([]);
        expect(store.getState().ordering.availableMenus.status).toEqual("error");
        expect(store.getState().ordering.availableMenus.error).toEqual("Failed to fetch data");
    });

    it("Should return empty array if no restaurantId", async () => {
        const store = createTestStore({
            dependencies: {
                menuGateway: new StubMenuGateway([MenuFactory.create()]),
            },
        });

        await store.dispatch(fetchMenus);

        expect(store.getState().ordering.availableMenus.data).toEqual([]);
        expect(store.getState().ordering.availableMenus.status).toEqual("success");
    });
});
```

**Step 2: Run test to verify it fails**

```bash
cd front && pnpm test -- --testPathPattern="fetch-menus" --watchAll=false
```

Expected: FAIL (fetchMenus not defined)

**Step 3: Write minimal implementation**

Create `fetch-menus.usecase.ts`:

```typescript
import { orderingSlice } from "@taotask/modules/order/core/store/ordering.slice";
import { extractErrorMessage } from "@taotask/modules/shared/error.utils";
import { Dependencies } from "@taotask/modules/store/dependencies";
import { AppDispatch, AppGetState } from "@taotask/modules/store/store";

export const fetchMenus = async (
    dispatch: AppDispatch,
    getState: AppGetState,
    dependencies: Dependencies
) => {
    dispatch(orderingSlice.actions.handleMenusLoading());

    const state = getState();
    const restaurantId = state.ordering.restaurantId;

    if (!restaurantId) {
        dispatch(orderingSlice.actions.storeMenus([]));
        return;
    }

    try {
        const menus = await dependencies.menuGateway?.getMenus(restaurantId);
        dispatch(orderingSlice.actions.storeMenus(menus || []));
    } catch (e) {
        dispatch(orderingSlice.actions.handleMenusError(extractErrorMessage(e)));
    }
};
```

**Step 4: Run test to verify it passes**

```bash
cd front && pnpm test -- --testPathPattern="fetch-menus" --watchAll=false
```

Expected: PASS

**Step 5: Commit**

```bash
git add front/src/modules/order/core/useCase/fetch-menus.usecase.ts
git add front/src/modules/order/core/useCase/fetch-menus.usecase.test.ts
git commit -m "feat(order): add fetch-menus use case with tests"
```

---

## Task 10: Frontend - Update fetcher listener to fetch menus

**Files:**
- Modify: `front/src/modules/order/core/store/fetcher.listener.ts`

**Step 1: Import fetchMenus**

Add import at top:

```typescript
import { fetchMenus } from "@taotask/modules/order/core/useCase/fetch-menus.usecase";
```

**Step 2: Add MEALS_PREVIEW case to fetch menus**

Update the switch statement:

```typescript
export const registerFetcherListeners = (listener: ListenerMiddlewareInstance) => {
    listener.startListening({
        actionCreator: orderingSlice.actions.setStep,
            effect: (action, api) => {
            switch(action.payload) {
                case OrderingDomainModel.OrderingStep.MEALS_PREVIEW: {
                    api.dispatch(fetchMenus as any);
                    api.dispatch(fetchMeals as any);
                    break;
                }
                case OrderingDomainModel.OrderingStep.TABLE: {
                    api.dispatch(fetchTables as any);
                    break;
                }
                case OrderingDomainModel.OrderingStep.MEALS: {
                    api.dispatch(fetchMeals as any);
                    break;
                }
            }
        }
    });
}
```

**Step 3: Commit**

```bash
git add front/src/modules/order/core/store/fetcher.listener.ts
git commit -m "feat(order): fetch menus when entering MEALS_PREVIEW step"
```

---

## Task 11: Frontend - Update MEALS_PREVIEW hook to include menus

**Files:**
- Modify: `front/src/modules/order/react/sections/meals-preview/use-meals-preview.hook.ts`

**Step 1: Update the hook**

```typescript
import { useAppDispatch } from '@taotask/modules/store/store';
import { OrderingDomainModel } from '@taotask/modules/order/core/model/ordering.domain-model';
import { orderingActions } from '@taotask/modules/order/core/store/ordering.slice';
import { useSelector } from 'react-redux';
import { AppState } from '@taotask/modules/store/store';

export interface UseMealsPreviewProps {
  meals: OrderingDomainModel.Meal[];
  restaurantName: string;
}

export const useMealsPreview = ({ meals, restaurantName }: UseMealsPreviewProps) => {
  const dispatch = useAppDispatch();
  const menus = useSelector((state: AppState) => state.ordering.availableMenus.data);
  const menusStatus = useSelector((state: AppState) => state.ordering.availableMenus.status);
  const selectedMenuId = useSelector((state: AppState) => state.ordering.selectedMenuId);

  const onContinue = () => {
    dispatch(orderingActions.setStep(OrderingDomainModel.OrderingStep.TABLE));
  };

  const onPrevious = () => {
    dispatch(orderingActions.setStep(OrderingDomainModel.OrderingStep.RESTAURANT));
  };

  const onSelectMenu = (menuId: string | null) => {
    dispatch(orderingActions.selectMenu(menuId));
  };

  const selectedMenu = selectedMenuId
    ? menus.find(m => m.id === selectedMenuId) || null
    : null;

  return {
    meals,
    restaurantName,
    menus,
    menusStatus,
    selectedMenuId,
    selectedMenu,
    onContinue,
    onPrevious,
    onSelectMenu,
  };
};
```

**Step 2: Commit**

```bash
git add front/src/modules/order/react/sections/meals-preview/use-meals-preview.hook.ts
git commit -m "feat(order): add menu selection to MEALS_PREVIEW hook"
```

---

## Task 12: Frontend - Update MEALS_PREVIEW section UI with menu cards

**Files:**
- Modify: `front/src/modules/order/react/sections/meals-preview/MealsPreviewSection.tsx`

**Step 1: Update the component**

```typescript
"use client";
import React from 'react';
import { OrderingDomainModel } from '@taotask/modules/order/core/model/ordering.domain-model';
import Image from 'next/image';
import { useMealsPreview } from './use-meals-preview.hook';
import { LuminousCard } from '@taotask/modules/order/react/components/ui/LuminousCard';
import { LuminousButton } from '@taotask/modules/order/react/components/ui/LuminousButton';
import { Check } from 'lucide-react';

export interface MealsPreviewSectionProps {
  meals: OrderingDomainModel.Meal[];
  restaurantName: string;
}

const MEAL_TYPE_LABELS: Record<OrderingDomainModel.MealType, string> = {
  ENTRY: 'E',
  MAIN_COURSE: 'P',
  DESSERT: 'D',
  DRINK: 'B',
};

const formatMenuItems = (items: OrderingDomainModel.MenuItem[]): string => {
  return items
    .filter(item => item.quantity > 0)
    .map(item => `${item.quantity}${MEAL_TYPE_LABELS[item.mealType]}`)
    .join(' + ');
};

export const MealsPreviewSection: React.FC<MealsPreviewSectionProps> = ({ meals, restaurantName }) => {
  const presenter = useMealsPreview({ meals, restaurantName });

  const mealTypes: Record<OrderingDomainModel.MealType, string> = {
    "ENTRY": "Entrée",
    "MAIN_COURSE": "Plat",
    "DESSERT": "Dessert",
    "DRINK": "Boisson",
  };

  const mealBadgeStyles: Record<OrderingDomainModel.MealType, string> = {
    "ENTRY": "bg-luminous-meal-entry-bg text-luminous-meal-entry",
    "MAIN_COURSE": "bg-luminous-meal-main-bg text-luminous-meal-main",
    "DESSERT": "bg-luminous-meal-dessert-bg text-luminous-meal-dessert",
    "DRINK": "bg-luminous-meal-drink-bg text-luminous-meal-drink",
  };

  const mealBorder: Record<OrderingDomainModel.MealType, string> = {
    "ENTRY": "border-luminous-meal-entry",
    "MAIN_COURSE": "border-luminous-meal-main",
    "DESSERT": "border-luminous-meal-dessert",
    "DRINK": "border-luminous-meal-drink",
  };

  const groupedMeals = {
    [OrderingDomainModel.MealType.ENTRY]: presenter.meals.filter(m => m.type === OrderingDomainModel.MealType.ENTRY),
    [OrderingDomainModel.MealType.MAIN_COURSE]: presenter.meals.filter(m => m.type === OrderingDomainModel.MealType.MAIN_COURSE),
    [OrderingDomainModel.MealType.DESSERT]: presenter.meals.filter(m => m.type === OrderingDomainModel.MealType.DESSERT),
    [OrderingDomainModel.MealType.DRINK]: presenter.meals.filter(m => m.type === OrderingDomainModel.MealType.DRINK),
  };

  return (
    <LuminousCard className="mx-auto py-8 sm:py-12 w-full max-w-[1200px] animate-fade-in-down">
      <div className="flex flex-col mx-auto mb-5 w-full">
        <h3 className="mx-auto my-3 font-display font-medium text-luminous-text-primary text-xl sm:text-2xl uppercase text-center tracking-wide">
          Découvrez notre carte
        </h3>
        {presenter.restaurantName && (
          <p className="text-center text-luminous-gold text-sm sm:text-base mb-2">
            {presenter.restaurantName}
          </p>
        )}
        <div className="h-1 w-16 bg-luminous-gold mx-auto my-4" />
      </div>

      {/* Menu Bundles Section */}
      {presenter.menus.length > 0 && (
        <div className="mb-10">
          <h4 className="text-lg font-display font-medium text-luminous-text-primary mb-4 uppercase tracking-wide">
            Nos Menus
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {presenter.menus.map((menu) => {
              const isSelected = presenter.selectedMenuId === menu.id;
              return (
                <div
                  key={menu.id}
                  onClick={() => presenter.onSelectMenu(isSelected ? null : menu.id)}
                  className="cursor-pointer"
                >
                  <div className={`relative rounded-xl overflow-hidden border-2 ${isSelected ? 'border-luminous-gold' : 'border-luminous-gold-border'} bg-luminous-bg-card shadow-[0_4px_20px_rgba(201,162,39,0.08)] hover:shadow-[0_8px_30px_rgba(201,162,39,0.12)] transition-all duration-300`}>
                    {/* Selected checkmark */}
                    {isSelected && (
                      <div className="absolute top-3 right-3 z-10 w-7 h-7 bg-luminous-sage rounded-full flex items-center justify-center">
                        <Check className="w-5 h-5 text-white" />
                      </div>
                    )}

                    {/* Menu image */}
                    {menu.imageUrl && (
                      <Image
                        width={400}
                        height={200}
                        src={menu.imageUrl}
                        alt={menu.title}
                        className="w-full h-[140px] object-cover"
                      />
                    )}

                    {/* Menu info */}
                    <div className="p-4">
                      <h5 className="text-base font-semibold text-luminous-text-primary mb-1">
                        {menu.title}
                      </h5>
                      <p className="text-sm text-luminous-text-secondary mb-2">
                        {menu.description}
                      </p>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-luminous-gold-muted">
                          {formatMenuItems(menu.items)}
                        </span>
                        <span className="text-lg font-bold text-luminous-gold">
                          {menu.price} €
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Divider */}
          <div className="flex items-center my-8">
            <div className="flex-1 h-px bg-luminous-gold-border"></div>
            <span className="px-4 text-sm text-luminous-text-muted italic">
              Ou composez à la carte
            </span>
            <div className="flex-1 h-px bg-luminous-gold-border"></div>
          </div>
        </div>
      )}

      {/* Meals by category */}
      <div className="flex flex-col gap-8">
        {Object.values(OrderingDomainModel.MealType).map((type) => {
          const mealsOfType = groupedMeals[type];
          if (mealsOfType.length === 0) return null;

          return (
            <div key={type}>
              <h4 className="text-lg font-display font-medium text-luminous-text-primary mb-4 uppercase tracking-wide">
                {mealTypes[type]}s
              </h4>
              <div className="flex gap-4 overflow-x-auto pb-4 scroll-smooth snap-x snap-mandatory">
                {mealsOfType.map((meal) => (
                  <div
                    key={meal.id}
                    className="flex-shrink-0 w-[140px] sm:w-[180px] snap-start"
                  >
                    <div className={`relative rounded-xl overflow-hidden border-2 ${mealBorder[meal.type]} bg-luminous-bg-card shadow-[0_4px_20px_rgba(201,162,39,0.08)] hover:shadow-[0_8px_30px_rgba(201,162,39,0.12)] transition-shadow duration-300`}>
                      {/* Meal type badge */}
                      <span className={`absolute top-2 left-2 z-10 ${mealBadgeStyles[meal.type]} px-2 py-0.5 rounded-full text-xs font-medium`}>
                        {mealTypes[meal.type]}
                      </span>

                      {/* Meal image */}
                      <Image
                        width={200}
                        height={200}
                        src={meal.imageUrl}
                        alt={meal.title}
                        className="w-full h-[120px] sm:h-[150px] object-cover"
                      />

                      {/* Meal info */}
                      <div className="p-3 bg-luminous-bg-card">
                        <h5 className="text-sm font-medium text-luminous-text-primary text-center truncate">
                          {meal.title}
                        </h5>
                        <p className="text-sm font-semibold text-luminous-gold text-center mt-1">
                          {meal.price} €
                        </p>
                        {meal.requiredAge && (
                          <p className="text-xs text-luminous-rose text-center mt-1">
                            {meal.requiredAge}+ ans requis
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected menu indicator */}
      {presenter.selectedMenu && (
        <div className="mt-6 p-4 bg-luminous-sage/10 border border-luminous-sage rounded-xl">
          <p className="text-center text-luminous-sage font-medium">
            Menu sélectionné : {presenter.selectedMenu.title} ({presenter.selectedMenu.price} €/pers.)
          </p>
        </div>
      )}

      {/* Navigation */}
      <div className="flex flex-col sm:flex-row justify-center gap-3 mx-auto w-full mt-8">
        <LuminousButton
          onClick={presenter.onPrevious}
          variant="secondary"
        >
          Précédent
        </LuminousButton>
        <LuminousButton
          onClick={presenter.onContinue}
          variant="success"
        >
          Continuer
        </LuminousButton>
      </div>
    </LuminousCard>
  );
};
```

**Step 2: Commit**

```bash
git add front/src/modules/order/react/sections/meals-preview/MealsPreviewSection.tsx
git commit -m "feat(order): add menu cards to MEALS_PREVIEW section"
```

---

## Task 13: Frontend - Update guest form to inherit selected menu

**Files:**
- Modify: `front/src/modules/order/core/form/guest.form.ts`

**Step 1: Read the current file first, then update createGuest method**

The guest factory should set `menuId` from the selected menu when creating guests. Find the method that creates guests and add `menuId: null` as default, then we'll pass it from the form.

**Step 2: Update GuestFactory**

Modify `front/src/modules/order/core/model/guest.factory.ts`:

```typescript
import { OrderingDomainModel } from "@taotask/modules/order/core/model/ordering.domain-model";

export class GuestFactory {
    static create(overrides: Partial<OrderingDomainModel.Guest> = {}): OrderingDomainModel.Guest {
        return {
            id: "1",
            firstName: "John",
            lastName: "Doe",
            age: 30,
            meals: {
                entry: null,
                mainCourse: null,
                dessert: null,
                drink: null
            },
            restaurantId: null,
            isOrganizer: false,
            menuId: null,  // ADD THIS
            ...overrides,
        };
    }
}
```

**Step 3: Commit**

```bash
git add front/src/modules/order/core/model/guest.factory.ts
git commit -m "feat(order): add menuId to guest factory"
```

---

## Task 14: Frontend - Update GUESTS section to apply selected menu to guests

**Files:**
- Modify: `front/src/modules/order/react/sections/guest/use-guest-section.ts`

**Step 1: Read current file and update to include selectedMenuId**

Add selector for `selectedMenuId` and apply it when creating guests. When the form is submitted, each guest should have `menuId` set to the selected menu (or null for à la carte).

Find where guests are created/submitted and ensure `menuId` is set from `state.ordering.selectedMenuId`.

**Step 2: Commit after implementation**

```bash
git add front/src/modules/order/react/sections/guest/use-guest-section.ts
git commit -m "feat(order): apply selected menu to guests when creating"
```

---

## Task 15: Frontend - Update MEALS section for constrained menu selection

**Files:**
- Modify: `front/src/modules/order/react/sections/meals/use-meals.hook.ts`
- Modify: `front/src/modules/order/react/sections/meals/MealsSection.tsx`

**Step 1: Update hook to include menu awareness**

Add to `use-meals.hook.ts`:

```typescript
// Add these imports and selectors
const menus = useSelector((state: AppState) => state.ordering.availableMenus.data);

// Add helper function
function getGuestMenu(guest: OrderingDomainModel.Guest): OrderingDomainModel.Menu | null {
    if (!guest.menuId) return null;
    return menus.find(m => m.id === guest.menuId) || null;
}

function getRequiredMealTypes(guest: OrderingDomainModel.Guest): OrderingDomainModel.MealType[] {
    const menu = getGuestMenu(guest);
    if (!menu) return []; // À la carte - no requirements
    return menu.items
        .filter(item => item.quantity > 0)
        .map(item => item.mealType);
}

function isGuestComplete(guest: OrderingDomainModel.Guest): boolean {
    const menu = getGuestMenu(guest);
    if (!menu) return true; // À la carte always valid

    return menu.items.every(item => {
        if (item.quantity === 0) return true;
        const mealId = getMealIdForType(guest, item.mealType);
        return mealId !== null;
    });
}

function getMealIdForType(guest: OrderingDomainModel.Guest, mealType: OrderingDomainModel.MealType): string | null {
    switch (mealType) {
        case OrderingDomainModel.MealType.ENTRY: return guest.meals.entry;
        case OrderingDomainModel.MealType.MAIN_COURSE: return guest.meals.mainCourse;
        case OrderingDomainModel.MealType.DESSERT: return guest.meals.dessert;
        case OrderingDomainModel.MealType.DRINK: return guest.meals.drink;
    }
}

function getMenuProgress(guest: OrderingDomainModel.Guest): { selected: number; total: number } | null {
    const menu = getGuestMenu(guest);
    if (!menu) return null;

    const requiredItems = menu.items.filter(item => item.quantity > 0);
    const total = requiredItems.length;
    const selected = requiredItems.filter(item => {
        const mealId = getMealIdForType(guest, item.mealType);
        return mealId !== null;
    }).length;

    return { selected, total };
}

// Add to return object
return {
    // ...existing
    menus,
    getGuestMenu,
    getRequiredMealTypes,
    isGuestComplete,
    getMenuProgress,
}
```

**Step 2: Update MealsSection.tsx**

Add menu badge, progress indicator, and filter categories based on menu:

```typescript
// In the component, add:
const guestMenu = presenter.getGuestMenu(presenter.currentGuest);
const requiredTypes = presenter.getRequiredMealTypes(presenter.currentGuest);
const menuProgress = presenter.getMenuProgress(presenter.currentGuest);

// Filter groupedMeals to only show required types for menu guests
const displayedMealTypes = guestMenu
  ? Object.values(OrderingDomainModel.MealType).filter(type => requiredTypes.includes(type))
  : Object.values(OrderingDomainModel.MealType);

// Add menu badge in header
{guestMenu && (
  <div className="flex justify-center mb-4">
    <span className="bg-luminous-gold/20 text-luminous-gold px-4 py-1 rounded-full text-sm font-medium">
      {guestMenu.title} - {guestMenu.price} €
    </span>
  </div>
)}

// Add progress indicator
{menuProgress && (
  <p className="text-center text-luminous-text-muted text-sm mb-4">
    {menuProgress.selected}/{menuProgress.total} sélections
  </p>
)}

// Update navigation - disable "Suivant" if menu guest is incomplete
<LuminousButton
  onClick={presenter.onNext}
  variant="success"
  disabled={guestMenu && !presenter.isGuestComplete(presenter.currentGuest)}
>
  Suivant
</LuminousButton>
```

**Step 3: Commit**

```bash
git add front/src/modules/order/react/sections/meals/use-meals.hook.ts
git add front/src/modules/order/react/sections/meals/MealsSection.tsx
git commit -m "feat(order): add constrained menu selection to MEALS section"
```

---

## Task 16: Frontend - Update Summary section for menu pricing

**Files:**
- Modify: `front/src/modules/order/react/sections/summary/use-summary.hook.ts`
- Modify: `front/src/modules/order/react/sections/summary/SummarySection.tsx`

**Step 1: Update hook for menu-aware pricing**

```typescript
// Add menu selector
const menus = useSelector((state: AppState) => state.ordering.availableMenus.data);

// Update selectSummary to include menuId per guest
// In the guest mapping, add:
menuId: guest.menuId,
menuTitle: guest.menuId ? menus.find(m => m.id === guest.menuId)?.title : null,
menuPrice: guest.menuId ? menus.find(m => m.id === guest.menuId)?.price : null,

// Update totalPrice calculation
const totalPrice = useMemo(() => {
    let total = 0;
    summary.guests.forEach((guest: Guest) => {
        if (guest.menuId && guest.menuPrice) {
            // Menu pricing
            total += guest.menuPrice;
        } else {
            // À la carte pricing
            if (guest.meals.entry) total += guest.meals.entry.price;
            if (guest.meals.mainCourse) total += guest.meals.mainCourse.price;
            if (guest.meals.dessert) total += guest.meals.dessert.price;
            if (guest.meals.drink) total += guest.meals.drink.price;
        }
    });
    return total.toFixed(2);
}, [summary.guests]);

// Add price breakdown
const priceBreakdown = useMemo(() => {
    const menuGuests = summary.guests.filter(g => g.menuId);
    const alaCarteGuests = summary.guests.filter(g => !g.menuId);

    const menusByType = menuGuests.reduce((acc, guest) => {
        const key = guest.menuTitle || 'Menu';
        if (!acc[key]) acc[key] = { count: 0, price: guest.menuPrice || 0 };
        acc[key].count++;
        return acc;
    }, {} as Record<string, { count: number; price: number }>);

    let alaCarteTotal = 0;
    alaCarteGuests.forEach(guest => {
        if (guest.meals.entry) alaCarteTotal += guest.meals.entry.price;
        if (guest.meals.mainCourse) alaCarteTotal += guest.meals.mainCourse.price;
        if (guest.meals.dessert) alaCarteTotal += guest.meals.dessert.price;
        if (guest.meals.drink) alaCarteTotal += guest.meals.drink.price;
    });

    return { menusByType, alaCarteTotal, hasAlaCarte: alaCarteGuests.length > 0 };
}, [summary.guests]);

return {
    // ...existing
    priceBreakdown,
}
```

**Step 2: Update SummarySection.tsx**

```typescript
// Add menu badge to guest cards
{guest.menuTitle ? (
  <span className="bg-luminous-gold/20 text-luminous-gold px-2 py-0.5 rounded text-xs">
    {guest.menuTitle}
  </span>
) : (
  <span className="bg-luminous-bg-secondary text-luminous-text-muted px-2 py-0.5 rounded text-xs">
    À la carte
  </span>
)}

// Update total section with breakdown
<div className="bg-luminous-bg-secondary border-2 border-luminous-gold rounded-xl p-4 mx-auto max-w-[400px] mt-6">
  <p className="text-center font-display font-medium text-lg text-luminous-text-primary mb-3">
    Récapitulatif
  </p>

  {/* Menu breakdown */}
  {Object.entries(presenter.priceBreakdown.menusByType).map(([menuName, data]) => (
    <div key={menuName} className="flex justify-between text-sm text-luminous-text-secondary mb-1">
      <span>{data.count}× {menuName}</span>
      <span>{(data.count * data.price).toFixed(2)} €</span>
    </div>
  ))}

  {/* À la carte */}
  {presenter.priceBreakdown.hasAlaCarte && (
    <div className="flex justify-between text-sm text-luminous-text-secondary mb-1">
      <span>À la carte</span>
      <span>{presenter.priceBreakdown.alaCarteTotal.toFixed(2)} €</span>
    </div>
  )}

  <div className="border-t border-luminous-gold-border my-2"></div>

  <div className="flex justify-between">
    <span className="font-medium text-luminous-text-primary">Total estimé</span>
    <span className="text-xl font-bold text-luminous-gold">{presenter.totalPrice} €</span>
  </div>
</div>
```

**Step 3: Commit**

```bash
git add front/src/modules/order/react/sections/summary/use-summary.hook.ts
git add front/src/modules/order/react/sections/summary/SummarySection.tsx
git commit -m "feat(order): add menu pricing breakdown to Summary section"
```

---

## Task 17: Backoffice - Add items composer to menu create modal

**Files:**
- Modify: `front/src/modules/backoffice/react/sections/menus/MenusSection.tsx`

**Step 1: Update form state to include items**

```typescript
const initialFormData = {
    title: '',
    description: '',
    price: 0,
    imageUrl: '',
    items: [
        { mealType: 'ENTRY', quantity: 0 },
        { mealType: 'MAIN_COURSE', quantity: 0 },
        { mealType: 'DESSERT', quantity: 0 },
        { mealType: 'DRINK', quantity: 0 },
    ],
};
```

**Step 2: Add quantity controls in modal**

```typescript
{/* Menu Composition */}
<div className="space-y-3">
    <label className="text-sm font-medium text-luxury-text-primary">
        Composition du menu
    </label>
    {formData.items.map((item, index) => (
        <div key={item.mealType} className="flex items-center justify-between">
            <span className="text-sm text-luxury-text-secondary">
                {MEAL_TYPE_LABELS[item.mealType]}
            </span>
            <div className="flex items-center gap-2">
                <button
                    type="button"
                    onClick={() => {
                        const newItems = [...formData.items];
                        newItems[index].quantity = Math.max(0, item.quantity - 1);
                        setFormData(prev => ({ ...prev, items: newItems }));
                    }}
                    className="w-8 h-8 rounded bg-luxury-bg-secondary text-luxury-text-primary hover:bg-luxury-gold/20"
                >
                    -
                </button>
                <span className="w-8 text-center text-luxury-text-primary">
                    {item.quantity}
                </span>
                <button
                    type="button"
                    onClick={() => {
                        const newItems = [...formData.items];
                        newItems[index].quantity = item.quantity + 1;
                        setFormData(prev => ({ ...prev, items: newItems }));
                    }}
                    className="w-8 h-8 rounded bg-luxury-bg-secondary text-luxury-text-primary hover:bg-luxury-gold/20"
                >
                    +
                </button>
            </div>
        </div>
    ))}
</div>
```

**Step 3: Update handleCreate to include items**

```typescript
const handleCreate = async () => {
    await createMenu({
        restaurantId,
        title: formData.title,
        description: formData.description,
        price: formData.price,
        imageUrl: formData.imageUrl || '/placeholder-menu.jpg',
        items: formData.items.filter(item => item.quantity > 0),
    });
    setFormData(initialFormData);
    setIsCreateModalOpen(false);
};
```

**Step 4: Commit**

```bash
git add front/src/modules/backoffice/react/sections/menus/MenusSection.tsx
git commit -m "feat(backoffice): add items composer to menu create modal"
```

---

## Task 18: Backoffice - Add edit menu modal

**Files:**
- Modify: `front/src/modules/backoffice/react/sections/menus/MenusSection.tsx`

**Step 1: Add edit state**

```typescript
const [isEditModalOpen, setIsEditModalOpen] = useState(false);
const [editingMenu, setEditingMenu] = useState<BackofficeDomainModel.Menu | null>(null);
const [editFormData, setEditFormData] = useState(initialFormData);
```

**Step 2: Add edit handler**

```typescript
const handleEdit = (menu: BackofficeDomainModel.Menu) => {
    setEditingMenu(menu);
    setEditFormData({
        title: menu.title,
        description: menu.description,
        price: menu.price,
        imageUrl: menu.imageUrl,
        items: [
            { mealType: 'ENTRY', quantity: menu.items.find(i => i.mealType === 'ENTRY')?.quantity || 0 },
            { mealType: 'MAIN_COURSE', quantity: menu.items.find(i => i.mealType === 'MAIN_COURSE')?.quantity || 0 },
            { mealType: 'DESSERT', quantity: menu.items.find(i => i.mealType === 'DESSERT')?.quantity || 0 },
            { mealType: 'DRINK', quantity: menu.items.find(i => i.mealType === 'DRINK')?.quantity || 0 },
        ],
    });
    setIsEditModalOpen(true);
};

const handleUpdate = async () => {
    if (!editingMenu) return;
    await updateMenu(editingMenu.id, {
        title: editFormData.title,
        description: editFormData.description,
        price: editFormData.price,
        imageUrl: editFormData.imageUrl,
        items: editFormData.items.filter(item => item.quantity > 0),
    });
    setEditFormData(initialFormData);
    setEditingMenu(null);
    setIsEditModalOpen(false);
};
```

**Step 3: Add edit button to menu card**

```typescript
<div className="flex gap-2 mt-4">
    <LuxuryButton
        variant="secondary"
        onClick={() => handleEdit(menu)}
    >
        Modifier
    </LuxuryButton>
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
```

**Step 4: Add edit modal (same form as create)**

```typescript
<LuxuryModal
    isOpen={isEditModalOpen}
    onClose={() => setIsEditModalOpen(false)}
    title="Modifier le menu"
>
    {/* Same form as create modal but with editFormData and handleUpdate */}
</LuxuryModal>
```

**Step 5: Commit**

```bash
git add front/src/modules/backoffice/react/sections/menus/MenusSection.tsx
git commit -m "feat(backoffice): add edit menu modal"
```

---

## Task 19: Wire up HttpMenuGateway in app dependencies

**Files:**
- Modify: `front/src/modules/app/react/providers/DependenciesProvider.tsx` (or wherever dependencies are wired)

**Step 1: Find and update dependencies provider**

Add HttpMenuGateway instantiation alongside other gateways:

```typescript
import { HttpMenuGateway } from '@taotask/modules/order/core/gateway/http.menu-gateway';

// In the dependencies object:
menuGateway: new HttpMenuGateway(httpClient),
```

**Step 2: Commit**

```bash
git add front/src/modules/app/
git commit -m "feat(app): wire HttpMenuGateway in dependencies provider"
```

---

## Task 20: Final integration test

**Step 1: Start backend**

```bash
cd back && pnpm start:dev
```

**Step 2: Start frontend**

```bash
cd front && pnpm dev
```

**Step 3: Test backoffice menu creation**

1. Go to `/admin`
2. Select a restaurant
3. Go to Menus tab
4. Create a menu with items (1E + 1P + 1D)
5. Verify it appears in the list

**Step 4: Test customer flow**

1. Go to `/order/[restaurantId]` or `/terminal?restaurantId=X`
2. At MEALS_PREVIEW, verify menus appear
3. Select a menu
4. Continue through flow
5. At MEALS step, verify only menu categories are shown
6. Complete selection
7. At SUMMARY, verify menu pricing breakdown

**Step 5: Final commit**

```bash
git add .
git commit -m "feat: complete menu composer feature implementation"
```

---

## Summary

| Task | Description | Files |
|------|-------------|-------|
| 1 | Backend GET /menus/:id | menu.controller.ts, get-menus.use-case.ts, menu.repository |
| 2 | Domain model Menu types | ordering.domain-model.ts |
| 3 | Redux menu state | ordering.slice.ts |
| 4 | Menu gateway port | menu.gateway.ts |
| 5 | HTTP menu gateway | http.menu-gateway.ts |
| 6 | Test stubs | stub.menu-gateway.ts, failing.menu-gateway.ts |
| 7 | Menu factory | menu.factory.ts |
| 8 | Register dependency | dependencies.ts |
| 9 | Fetch menus use case | fetch-menus.usecase.ts + test |
| 10 | Fetcher listener | fetcher.listener.ts |
| 11 | MEALS_PREVIEW hook | use-meals-preview.hook.ts |
| 12 | MEALS_PREVIEW UI | MealsPreviewSection.tsx |
| 13 | Guest factory menuId | guest.factory.ts |
| 14 | GUESTS apply menu | use-guest-section.ts |
| 15 | MEALS constrained | use-meals.hook.ts, MealsSection.tsx |
| 16 | Summary pricing | use-summary.hook.ts, SummarySection.tsx |
| 17 | Backoffice create | MenusSection.tsx |
| 18 | Backoffice edit | MenusSection.tsx |
| 19 | Wire gateway | DependenciesProvider.tsx |
| 20 | Integration test | Manual testing |
