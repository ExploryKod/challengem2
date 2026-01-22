# Backoffice Frontend Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a luxury-styled internal backoffice for restaurant owners to manage establishments, tables, meals, and reservations.

**Architecture:** Hexagonal architecture with Redux Toolkit. Domain models in `core/model/`, gateways (ports) in `core/gateway/`, use cases as Redux thunks in `core/useCase/`, React components follow presenter pattern with companion hooks.

**Tech Stack:** Next.js 16, React 18, Redux Toolkit, Tailwind CSS, TypeScript, Jest

---

## Phase 1: Luxury UI Components

### Task 1.1: Create Tailwind Color Configuration

**Files:**
- Modify: `front/tailwind.config.ts`

**Step 1: Add luxury color palette to Tailwind config**

Open `front/tailwind.config.ts` and extend the theme colors:

```typescript
// Add inside theme.extend.colors:
luxury: {
  bg: {
    primary: '#1E1E2E',
    secondary: '#1A1A2E',
    card: '#252538',
  },
  gold: {
    DEFAULT: '#D4AF37',
    muted: 'rgba(212, 175, 55, 0.7)',
    border: 'rgba(212, 175, 55, 0.3)',
    glow: 'rgba(212, 175, 55, 0.2)',
  },
  text: {
    primary: '#FAF3E0',
    secondary: 'rgba(250, 243, 224, 0.7)',
  },
  rose: {
    DEFAULT: '#8B3A4A',
    hover: '#9B4A5A',
  },
},
```

**Step 2: Commit**

```bash
git add front/tailwind.config.ts
git commit -m "feat(backoffice): add luxury color palette to Tailwind config"
```

---

### Task 1.2: Create LuxuryButton Component

**Files:**
- Create: `front/src/modules/backoffice/react/components/ui/LuxuryButton.tsx`

**Step 1: Create the component file**

```typescript
import React from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'destructive';

interface LuxuryButtonProps {
  children: React.ReactNode;
  variant?: ButtonVariant;
  onClick?: () => void;
  disabled?: boolean;
  type?: 'button' | 'submit';
  className?: string;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary: 'bg-luxury-gold text-luxury-bg-primary hover:bg-luxury-gold/90 focus:ring-luxury-gold/50',
  secondary: 'bg-transparent border border-luxury-gold text-luxury-gold hover:bg-luxury-gold/10 focus:ring-luxury-gold/30',
  destructive: 'bg-luxury-rose text-luxury-text-primary hover:bg-luxury-rose-hover focus:ring-luxury-rose/50',
};

export const LuxuryButton: React.FC<LuxuryButtonProps> = ({
  children,
  variant = 'primary',
  onClick,
  disabled = false,
  type = 'button',
  className = '',
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        px-6 py-3 rounded-lg font-medium uppercase tracking-wider text-sm
        transition-all duration-200 ease-in-out
        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-luxury-bg-primary
        disabled:opacity-50 disabled:cursor-not-allowed
        ${variantStyles[variant]}
        ${className}
      `}
    >
      {children}
    </button>
  );
};
```

**Step 2: Commit**

```bash
git add front/src/modules/backoffice/react/components/ui/LuxuryButton.tsx
git commit -m "feat(backoffice): add LuxuryButton component"
```

---

### Task 1.3: Create LuxuryCard Component

**Files:**
- Create: `front/src/modules/backoffice/react/components/ui/LuxuryCard.tsx`

**Step 1: Create the component file**

```typescript
import React from 'react';

interface LuxuryCardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  hoverable?: boolean;
}

export const LuxuryCard: React.FC<LuxuryCardProps> = ({
  children,
  className = '',
  onClick,
  hoverable = false,
}) => {
  return (
    <div
      onClick={onClick}
      className={`
        bg-luxury-bg-card rounded-xl p-6
        border border-luxury-gold-border
        ${hoverable ? 'cursor-pointer hover:border-luxury-gold hover:shadow-[0_0_20px_rgba(212,175,55,0.15)] transition-all duration-300' : ''}
        ${onClick ? 'cursor-pointer' : ''}
        ${className}
      `}
    >
      {children}
    </div>
  );
};
```

**Step 2: Commit**

```bash
git add front/src/modules/backoffice/react/components/ui/LuxuryCard.tsx
git commit -m "feat(backoffice): add LuxuryCard component"
```

---

### Task 1.4: Create LuxuryModal Component

**Files:**
- Create: `front/src/modules/backoffice/react/components/ui/LuxuryModal.tsx`

**Step 1: Create the component file**

```typescript
'use client';
import React, { useEffect } from 'react';

interface LuxuryModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export const LuxuryModal: React.FC<LuxuryModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
}) => {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative z-10 w-full max-w-lg mx-4 bg-luxury-bg-secondary rounded-xl border border-luxury-gold-border shadow-2xl">
        {/* Header */}
        <div className="px-6 py-4 border-b border-luxury-gold-border">
          <h2 className="text-xl font-serif text-luxury-text-primary">{title}</h2>
          <div className="mt-2 h-0.5 w-16 bg-luxury-gold" />
        </div>

        {/* Content */}
        <div className="px-6 py-4">
          {children}
        </div>

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-luxury-text-secondary hover:text-luxury-gold transition-colors"
          aria-label="Fermer"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
};
```

**Step 2: Commit**

```bash
git add front/src/modules/backoffice/react/components/ui/LuxuryModal.tsx
git commit -m "feat(backoffice): add LuxuryModal component"
```

---

### Task 1.5: Create LuxuryTabs Component

**Files:**
- Create: `front/src/modules/backoffice/react/components/ui/LuxuryTabs.tsx`

**Step 1: Create the component file**

```typescript
'use client';
import React from 'react';

interface Tab {
  id: string;
  label: string;
}

interface LuxuryTabsProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

export const LuxuryTabs: React.FC<LuxuryTabsProps> = ({
  tabs,
  activeTab,
  onTabChange,
}) => {
  return (
    <div className="border-b border-luxury-gold-border">
      <nav className="flex gap-8" aria-label="Tabs">
        {tabs.map((tab) => {
          const isActive = tab.id === activeTab;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`
                relative pb-4 px-1 text-sm font-medium uppercase tracking-wider
                transition-colors duration-200
                ${isActive
                  ? 'text-luxury-gold'
                  : 'text-luxury-text-secondary hover:text-luxury-text-primary'
                }
              `}
            >
              {tab.label}
              {isActive && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-luxury-gold" />
              )}
            </button>
          );
        })}
      </nav>
    </div>
  );
};
```

**Step 2: Commit**

```bash
git add front/src/modules/backoffice/react/components/ui/LuxuryTabs.tsx
git commit -m "feat(backoffice): add LuxuryTabs component"
```

---

### Task 1.6: Create LuxuryInput Component

**Files:**
- Create: `front/src/modules/backoffice/react/components/ui/LuxuryInput.tsx`

**Step 1: Create the component file**

```typescript
import React from 'react';

interface LuxuryInputProps {
  label: string;
  name: string;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  type?: 'text' | 'number' | 'email';
  placeholder?: string;
  error?: string | null;
  required?: boolean;
  min?: number;
  max?: number;
}

export const LuxuryInput: React.FC<LuxuryInputProps> = ({
  label,
  name,
  value,
  onChange,
  type = 'text',
  placeholder,
  error,
  required = false,
  min,
  max,
}) => {
  return (
    <div className="mb-4">
      <label
        htmlFor={name}
        className="block text-sm font-medium text-luxury-gold-muted mb-2 uppercase tracking-wider"
      >
        {label}
        {required && <span className="text-luxury-rose ml-1">*</span>}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        min={min}
        max={max}
        className={`
          w-full px-4 py-3 rounded-lg
          bg-luxury-bg-primary border
          text-luxury-text-primary placeholder-luxury-text-secondary
          focus:outline-none focus:ring-2 focus:ring-luxury-gold/50 focus:border-luxury-gold
          transition-all duration-200
          ${error ? 'border-luxury-rose' : 'border-luxury-gold-border'}
        `}
      />
      {error && (
        <p className="mt-1 text-sm text-luxury-rose">{error}</p>
      )}
    </div>
  );
};
```

**Step 2: Commit**

```bash
git add front/src/modules/backoffice/react/components/ui/LuxuryInput.tsx
git commit -m "feat(backoffice): add LuxuryInput component"
```

---

### Task 1.7: Create LuxurySelect Component

**Files:**
- Create: `front/src/modules/backoffice/react/components/ui/LuxurySelect.tsx`

**Step 1: Create the component file**

```typescript
import React from 'react';

interface Option {
  value: string;
  label: string;
}

interface LuxurySelectProps {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: Option[];
  error?: string | null;
  required?: boolean;
  placeholder?: string;
}

export const LuxurySelect: React.FC<LuxurySelectProps> = ({
  label,
  name,
  value,
  onChange,
  options,
  error,
  required = false,
  placeholder,
}) => {
  return (
    <div className="mb-4">
      <label
        htmlFor={name}
        className="block text-sm font-medium text-luxury-gold-muted mb-2 uppercase tracking-wider"
      >
        {label}
        {required && <span className="text-luxury-rose ml-1">*</span>}
      </label>
      <select
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        className={`
          w-full px-4 py-3 rounded-lg
          bg-luxury-bg-primary border
          text-luxury-text-primary
          focus:outline-none focus:ring-2 focus:ring-luxury-gold/50 focus:border-luxury-gold
          transition-all duration-200
          ${error ? 'border-luxury-rose' : 'border-luxury-gold-border'}
        `}
      >
        {placeholder && (
          <option value="" className="text-luxury-text-secondary">
            {placeholder}
          </option>
        )}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && (
        <p className="mt-1 text-sm text-luxury-rose">{error}</p>
      )}
    </div>
  );
};
```

**Step 2: Commit**

```bash
git add front/src/modules/backoffice/react/components/ui/LuxurySelect.tsx
git commit -m "feat(backoffice): add LuxurySelect component"
```

---

### Task 1.8: Create UI Components Index

**Files:**
- Create: `front/src/modules/backoffice/react/components/ui/index.ts`

**Step 1: Create barrel export**

```typescript
export { LuxuryButton } from './LuxuryButton';
export { LuxuryCard } from './LuxuryCard';
export { LuxuryModal } from './LuxuryModal';
export { LuxuryTabs } from './LuxuryTabs';
export { LuxuryInput } from './LuxuryInput';
export { LuxurySelect } from './LuxurySelect';
```

**Step 2: Commit**

```bash
git add front/src/modules/backoffice/react/components/ui/index.ts
git commit -m "feat(backoffice): add UI components barrel export"
```

---

## Phase 2: Domain Model & Redux State Extensions

### Task 2.1: Extend BackofficeDomainModel

**Files:**
- Modify: `front/src/modules/backoffice/core/model/backoffice.domain-model.ts`

**Step 1: Add Table, Meal, Guest, Reservation types**

Replace the entire file with:

```typescript
export namespace BackofficeDomainModel {
    // ============ RESTAURANT ============
    export type Restaurant = {
        id: number;
        name: string;
        type: string;
    };

    export type CreateRestaurantDTO = {
        name: string;
        type: string;
    };

    export type RestaurantForm = {
        name: string;
        type: string;
    };

    // ============ TABLE ============
    export type Table = {
        id: number;
        restaurantId: number;
        title: string;
        capacity: number;
    };

    export type CreateTableDTO = {
        restaurantId: number;
        title: string;
        capacity: number;
    };

    export type UpdateTableDTO = Partial<Omit<CreateTableDTO, 'restaurantId'>>;

    // ============ MEAL ============
    export type MealType = 'ENTRY' | 'MAIN_COURSE' | 'DESSERT' | 'DRINK';

    export type Meal = {
        id: number;
        restaurantId: number;
        title: string;
        type: MealType;
        price: number;
        requiredAge: number | null;
        imageUrl: string;
    };

    export type CreateMealDTO = {
        restaurantId: number;
        title: string;
        type: MealType;
        price: number;
        requiredAge?: number | null;
        imageUrl: string;
    };

    export type UpdateMealDTO = Partial<Omit<CreateMealDTO, 'restaurantId'>>;

    // ============ GUEST ============
    export type Guest = {
        firstName: string;
        lastName: string;
        age: number;
        isOrganizer: boolean;
        entryId?: number;
        mainCourseId?: number;
        dessertId?: number;
        drinkId?: number;
    };

    // ============ RESERVATION ============
    export type Reservation = {
        id: number;
        restaurantId: number;
        tableId: number;
        guests: Guest[];
        createdAt: string;
    };

    export type CreateReservationDTO = {
        restaurantId: number;
        tableId: number;
        guests: Guest[];
    };

    export type UpdateReservationDTO = Partial<Omit<CreateReservationDTO, 'restaurantId'>>;

    // ============ HELPERS ============
    export const MealTypeLabels: Record<MealType, string> = {
        ENTRY: 'Entrée',
        MAIN_COURSE: 'Plat',
        DESSERT: 'Dessert',
        DRINK: 'Boisson',
    };
}
```

**Step 2: Commit**

```bash
git add front/src/modules/backoffice/core/model/backoffice.domain-model.ts
git commit -m "feat(backoffice): extend domain model with Table, Meal, Reservation types"
```

---

### Task 2.2: Extend Redux Slice

**Files:**
- Modify: `front/src/modules/backoffice/core/store/backoffice.slice.ts`

**Step 1: Add state for selected restaurant, tables, meals, reservations**

Replace the entire file with:

```typescript
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { BackofficeDomainModel } from "../model/backoffice.domain-model";

export type BackofficeState = {
    // Restaurants
    restaurants: BackofficeDomainModel.Restaurant[];
    selectedRestaurantId: number | null;

    // Tables (for selected restaurant)
    tables: BackofficeDomainModel.Table[];

    // Meals (for selected restaurant)
    meals: BackofficeDomainModel.Meal[];

    // Reservations (for selected restaurant)
    reservations: BackofficeDomainModel.Reservation[];

    // UI State
    isLoading: boolean;
    error: string | null;
};

export const initialState: BackofficeState = {
    restaurants: [],
    selectedRestaurantId: null,
    tables: [],
    meals: [],
    reservations: [],
    isLoading: false,
    error: null,
};

export const backofficeSlice = createSlice({
    name: 'backoffice',
    initialState,
    reducers: {
        // ============ RESTAURANTS ============
        setRestaurants: (state, action: PayloadAction<BackofficeDomainModel.Restaurant[]>) => {
            state.restaurants = action.payload;
        },
        storeRestaurant: (state, action: PayloadAction<BackofficeDomainModel.Restaurant>) => {
            state.restaurants.push(action.payload);
        },
        updateRestaurant: (state, action: PayloadAction<BackofficeDomainModel.Restaurant>) => {
            const index = state.restaurants.findIndex(r => r.id === action.payload.id);
            if (index !== -1) {
                state.restaurants[index] = action.payload;
            }
        },
        removeRestaurant: (state, action: PayloadAction<number>) => {
            state.restaurants = state.restaurants.filter(r => r.id !== action.payload);
            if (state.selectedRestaurantId === action.payload) {
                state.selectedRestaurantId = null;
                state.tables = [];
                state.meals = [];
                state.reservations = [];
            }
        },
        selectRestaurant: (state, action: PayloadAction<number | null>) => {
            state.selectedRestaurantId = action.payload;
            // Clear sub-entities when changing restaurant
            state.tables = [];
            state.meals = [];
            state.reservations = [];
        },

        // ============ TABLES ============
        setTables: (state, action: PayloadAction<BackofficeDomainModel.Table[]>) => {
            state.tables = action.payload;
        },
        storeTable: (state, action: PayloadAction<BackofficeDomainModel.Table>) => {
            state.tables.push(action.payload);
        },
        updateTable: (state, action: PayloadAction<BackofficeDomainModel.Table>) => {
            const index = state.tables.findIndex(t => t.id === action.payload.id);
            if (index !== -1) {
                state.tables[index] = action.payload;
            }
        },
        removeTable: (state, action: PayloadAction<number>) => {
            state.tables = state.tables.filter(t => t.id !== action.payload);
        },

        // ============ MEALS ============
        setMeals: (state, action: PayloadAction<BackofficeDomainModel.Meal[]>) => {
            state.meals = action.payload;
        },
        storeMeal: (state, action: PayloadAction<BackofficeDomainModel.Meal>) => {
            state.meals.push(action.payload);
        },
        updateMeal: (state, action: PayloadAction<BackofficeDomainModel.Meal>) => {
            const index = state.meals.findIndex(m => m.id === action.payload.id);
            if (index !== -1) {
                state.meals[index] = action.payload;
            }
        },
        removeMeal: (state, action: PayloadAction<number>) => {
            state.meals = state.meals.filter(m => m.id !== action.payload);
        },

        // ============ RESERVATIONS ============
        setReservations: (state, action: PayloadAction<BackofficeDomainModel.Reservation[]>) => {
            state.reservations = action.payload;
        },
        storeReservation: (state, action: PayloadAction<BackofficeDomainModel.Reservation>) => {
            state.reservations.push(action.payload);
        },
        updateReservation: (state, action: PayloadAction<BackofficeDomainModel.Reservation>) => {
            const index = state.reservations.findIndex(r => r.id === action.payload.id);
            if (index !== -1) {
                state.reservations[index] = action.payload;
            }
        },
        removeReservation: (state, action: PayloadAction<number>) => {
            state.reservations = state.reservations.filter(r => r.id !== action.payload);
        },

        // ============ UI STATE ============
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.isLoading = action.payload;
        },
        setError: (state, action: PayloadAction<string | null>) => {
            state.error = action.payload;
        },
    },
});

export const backofficeReducer = backofficeSlice.reducer;
export const backofficeActions = backofficeSlice.actions;
```

**Step 2: Commit**

```bash
git add front/src/modules/backoffice/core/store/backoffice.slice.ts
git commit -m "feat(backoffice): extend Redux slice with tables, meals, reservations state"
```

---

## Phase 3: Gateway Layer (Ports & Adapters)

### Task 3.1: Define Table Management Gateway Interface

**Files:**
- Modify: `front/src/modules/backoffice/core/gateway/table-management.gateway.ts`

**Step 1: Define the interface**

```typescript
import { BackofficeDomainModel } from "../model/backoffice.domain-model";

export interface ITableManagementGateway {
    getTables(restaurantId: number): Promise<BackofficeDomainModel.Table[]>;
    getTable(id: number): Promise<BackofficeDomainModel.Table>;
    createTable(dto: BackofficeDomainModel.CreateTableDTO): Promise<BackofficeDomainModel.Table>;
    updateTable(id: number, dto: BackofficeDomainModel.UpdateTableDTO): Promise<BackofficeDomainModel.Table>;
    deleteTable(id: number): Promise<void>;
}
```

**Step 2: Commit**

```bash
git add front/src/modules/backoffice/core/gateway/table-management.gateway.ts
git commit -m "feat(backoffice): define ITableManagementGateway interface"
```

---

### Task 3.2: Implement HTTP Table Management Gateway

**Files:**
- Modify: `front/src/modules/backoffice/core/gateway/http.table-management-gateway.ts`

**Step 1: Implement the HTTP adapter**

```typescript
import { ITableManagementGateway } from "./table-management.gateway";
import { BackofficeDomainModel } from "../model/backoffice.domain-model";
import { HttpClient } from "@taotask/modules/shared/infrastructure/http-client";

export class HttpTableManagementGateway implements ITableManagementGateway {
    constructor(private readonly httpClient: HttpClient) {}

    async getTables(restaurantId: number): Promise<BackofficeDomainModel.Table[]> {
        return this.httpClient.get<BackofficeDomainModel.Table[]>(`/admin/tables?restaurantId=${restaurantId}`);
    }

    async getTable(id: number): Promise<BackofficeDomainModel.Table> {
        return this.httpClient.get<BackofficeDomainModel.Table>(`/admin/tables/${id}`);
    }

    async createTable(dto: BackofficeDomainModel.CreateTableDTO): Promise<BackofficeDomainModel.Table> {
        return this.httpClient.post<BackofficeDomainModel.Table>('/admin/tables', dto);
    }

    async updateTable(id: number, dto: BackofficeDomainModel.UpdateTableDTO): Promise<BackofficeDomainModel.Table> {
        return this.httpClient.put<BackofficeDomainModel.Table>(`/admin/tables/${id}`, dto);
    }

    async deleteTable(id: number): Promise<void> {
        return this.httpClient.delete(`/admin/tables/${id}`);
    }
}
```

**Step 2: Commit**

```bash
git add front/src/modules/backoffice/core/gateway/http.table-management-gateway.ts
git commit -m "feat(backoffice): implement HttpTableManagementGateway"
```

---

### Task 3.3: Define Meal Management Gateway Interface

**Files:**
- Modify: `front/src/modules/backoffice/core/gateway/meal-management.gateway.ts`

**Step 1: Define the interface**

```typescript
import { BackofficeDomainModel } from "../model/backoffice.domain-model";

export interface IMealManagementGateway {
    getMeals(restaurantId: number): Promise<BackofficeDomainModel.Meal[]>;
    getMeal(id: number): Promise<BackofficeDomainModel.Meal>;
    createMeal(dto: BackofficeDomainModel.CreateMealDTO): Promise<BackofficeDomainModel.Meal>;
    updateMeal(id: number, dto: BackofficeDomainModel.UpdateMealDTO): Promise<BackofficeDomainModel.Meal>;
    deleteMeal(id: number): Promise<void>;
}
```

**Step 2: Commit**

```bash
git add front/src/modules/backoffice/core/gateway/meal-management.gateway.ts
git commit -m "feat(backoffice): define IMealManagementGateway interface"
```

---

### Task 3.4: Implement HTTP Meal Management Gateway

**Files:**
- Modify: `front/src/modules/backoffice/core/gateway/http.meal-management-gateway.ts`

**Step 1: Implement the HTTP adapter**

```typescript
import { IMealManagementGateway } from "./meal-management.gateway";
import { BackofficeDomainModel } from "../model/backoffice.domain-model";
import { HttpClient } from "@taotask/modules/shared/infrastructure/http-client";

export class HttpMealManagementGateway implements IMealManagementGateway {
    constructor(private readonly httpClient: HttpClient) {}

    async getMeals(restaurantId: number): Promise<BackofficeDomainModel.Meal[]> {
        return this.httpClient.get<BackofficeDomainModel.Meal[]>(`/admin/meals?restaurantId=${restaurantId}`);
    }

    async getMeal(id: number): Promise<BackofficeDomainModel.Meal> {
        return this.httpClient.get<BackofficeDomainModel.Meal>(`/admin/meals/${id}`);
    }

    async createMeal(dto: BackofficeDomainModel.CreateMealDTO): Promise<BackofficeDomainModel.Meal> {
        return this.httpClient.post<BackofficeDomainModel.Meal>('/admin/meals', dto);
    }

    async updateMeal(id: number, dto: BackofficeDomainModel.UpdateMealDTO): Promise<BackofficeDomainModel.Meal> {
        return this.httpClient.put<BackofficeDomainModel.Meal>(`/admin/meals/${id}`, dto);
    }

    async deleteMeal(id: number): Promise<void> {
        return this.httpClient.delete(`/admin/meals/${id}`);
    }
}
```

**Step 2: Commit**

```bash
git add front/src/modules/backoffice/core/gateway/http.meal-management-gateway.ts
git commit -m "feat(backoffice): implement HttpMealManagementGateway"
```

---

### Task 3.5: Define Reservation Management Gateway Interface

**Files:**
- Modify: `front/src/modules/backoffice/core/gateway/reservation-management.gateway.ts`

**Step 1: Define the interface**

```typescript
import { BackofficeDomainModel } from "../model/backoffice.domain-model";

export interface IReservationManagementGateway {
    getReservations(restaurantId: number): Promise<BackofficeDomainModel.Reservation[]>;
    getReservation(id: number): Promise<BackofficeDomainModel.Reservation>;
    createReservation(dto: BackofficeDomainModel.CreateReservationDTO): Promise<BackofficeDomainModel.Reservation>;
    updateReservation(id: number, dto: BackofficeDomainModel.UpdateReservationDTO): Promise<BackofficeDomainModel.Reservation>;
    deleteReservation(id: number): Promise<void>;
}
```

**Step 2: Commit**

```bash
git add front/src/modules/backoffice/core/gateway/reservation-management.gateway.ts
git commit -m "feat(backoffice): define IReservationManagementGateway interface"
```

---

### Task 3.6: Implement HTTP Reservation Management Gateway

**Files:**
- Modify: `front/src/modules/backoffice/core/gateway/http.reservation-management-gateway.ts`

**Step 1: Implement the HTTP adapter**

```typescript
import { IReservationManagementGateway } from "./reservation-management.gateway";
import { BackofficeDomainModel } from "../model/backoffice.domain-model";
import { HttpClient } from "@taotask/modules/shared/infrastructure/http-client";

export class HttpReservationManagementGateway implements IReservationManagementGateway {
    constructor(private readonly httpClient: HttpClient) {}

    async getReservations(restaurantId: number): Promise<BackofficeDomainModel.Reservation[]> {
        return this.httpClient.get<BackofficeDomainModel.Reservation[]>(`/admin/reservations?restaurantId=${restaurantId}`);
    }

    async getReservation(id: number): Promise<BackofficeDomainModel.Reservation> {
        return this.httpClient.get<BackofficeDomainModel.Reservation>(`/admin/reservations/${id}`);
    }

    async createReservation(dto: BackofficeDomainModel.CreateReservationDTO): Promise<BackofficeDomainModel.Reservation> {
        return this.httpClient.post<BackofficeDomainModel.Reservation>('/admin/reservations', dto);
    }

    async updateReservation(id: number, dto: BackofficeDomainModel.UpdateReservationDTO): Promise<BackofficeDomainModel.Reservation> {
        return this.httpClient.put<BackofficeDomainModel.Reservation>(`/admin/reservations/${id}`, dto);
    }

    async deleteReservation(id: number): Promise<void> {
        return this.httpClient.delete(`/admin/reservations/${id}`);
    }
}
```

**Step 2: Commit**

```bash
git add front/src/modules/backoffice/core/gateway/http.reservation-management-gateway.ts
git commit -m "feat(backoffice): implement HttpReservationManagementGateway"
```

---

## Phase 4: Test Doubles (Stubs)

### Task 4.1: Create Stub Table Management Gateway

**Files:**
- Create: `front/src/modules/backoffice/core/testing/stub.table-management-gateway.ts`

**Step 1: Create the stub**

```typescript
import { ITableManagementGateway } from "@taotask/modules/backoffice/core/gateway/table-management.gateway";
import { BackofficeDomainModel } from "@taotask/modules/backoffice/core/model/backoffice.domain-model";

export class StubTableManagementGateway implements ITableManagementGateway {
    private tables: BackofficeDomainModel.Table[] = [];
    private nextId = 1;

    constructor(initialTables: BackofficeDomainModel.Table[] = []) {
        this.tables = [...initialTables];
        if (initialTables.length > 0) {
            this.nextId = Math.max(...initialTables.map(t => t.id)) + 1;
        }
    }

    async getTables(restaurantId: number): Promise<BackofficeDomainModel.Table[]> {
        return this.tables.filter(t => t.restaurantId === restaurantId);
    }

    async getTable(id: number): Promise<BackofficeDomainModel.Table> {
        const table = this.tables.find(t => t.id === id);
        if (!table) throw new Error(`Table ${id} not found`);
        return table;
    }

    async createTable(dto: BackofficeDomainModel.CreateTableDTO): Promise<BackofficeDomainModel.Table> {
        const newTable: BackofficeDomainModel.Table = {
            id: this.nextId++,
            ...dto,
        };
        this.tables.push(newTable);
        return newTable;
    }

    async updateTable(id: number, dto: BackofficeDomainModel.UpdateTableDTO): Promise<BackofficeDomainModel.Table> {
        const table = this.tables.find(t => t.id === id);
        if (!table) throw new Error(`Table ${id} not found`);
        Object.assign(table, dto);
        return table;
    }

    async deleteTable(id: number): Promise<void> {
        const index = this.tables.findIndex(t => t.id === id);
        if (index === -1) throw new Error(`Table ${id} not found`);
        this.tables.splice(index, 1);
    }
}
```

**Step 2: Commit**

```bash
git add front/src/modules/backoffice/core/testing/stub.table-management-gateway.ts
git commit -m "test(backoffice): add StubTableManagementGateway"
```

---

### Task 4.2: Create Stub Meal Management Gateway

**Files:**
- Modify: `front/src/modules/backoffice/core/testing/stub.meal-management-gateway.ts`

**Step 1: Update the stub**

```typescript
import { IMealManagementGateway } from "@taotask/modules/backoffice/core/gateway/meal-management.gateway";
import { BackofficeDomainModel } from "@taotask/modules/backoffice/core/model/backoffice.domain-model";

export class StubMealManagementGateway implements IMealManagementGateway {
    private meals: BackofficeDomainModel.Meal[] = [];
    private nextId = 1;

    constructor(initialMeals: BackofficeDomainModel.Meal[] = []) {
        this.meals = [...initialMeals];
        if (initialMeals.length > 0) {
            this.nextId = Math.max(...initialMeals.map(m => m.id)) + 1;
        }
    }

    async getMeals(restaurantId: number): Promise<BackofficeDomainModel.Meal[]> {
        return this.meals.filter(m => m.restaurantId === restaurantId);
    }

    async getMeal(id: number): Promise<BackofficeDomainModel.Meal> {
        const meal = this.meals.find(m => m.id === id);
        if (!meal) throw new Error(`Meal ${id} not found`);
        return meal;
    }

    async createMeal(dto: BackofficeDomainModel.CreateMealDTO): Promise<BackofficeDomainModel.Meal> {
        const newMeal: BackofficeDomainModel.Meal = {
            id: this.nextId++,
            ...dto,
            requiredAge: dto.requiredAge ?? null,
        };
        this.meals.push(newMeal);
        return newMeal;
    }

    async updateMeal(id: number, dto: BackofficeDomainModel.UpdateMealDTO): Promise<BackofficeDomainModel.Meal> {
        const meal = this.meals.find(m => m.id === id);
        if (!meal) throw new Error(`Meal ${id} not found`);
        Object.assign(meal, dto);
        return meal;
    }

    async deleteMeal(id: number): Promise<void> {
        const index = this.meals.findIndex(m => m.id === id);
        if (index === -1) throw new Error(`Meal ${id} not found`);
        this.meals.splice(index, 1);
    }
}
```

**Step 2: Commit**

```bash
git add front/src/modules/backoffice/core/testing/stub.meal-management-gateway.ts
git commit -m "test(backoffice): update StubMealManagementGateway"
```

---

### Task 4.3: Update Stub Reservation Management Gateway

**Files:**
- Modify: `front/src/modules/backoffice/core/testing/stub.reservation-management-gateway.ts`

**Step 1: Update the stub**

```typescript
import { IReservationManagementGateway } from "@taotask/modules/backoffice/core/gateway/reservation-management.gateway";
import { BackofficeDomainModel } from "@taotask/modules/backoffice/core/model/backoffice.domain-model";

export class StubReservationManagementGateway implements IReservationManagementGateway {
    private reservations: BackofficeDomainModel.Reservation[] = [];
    private nextId = 1;

    constructor(initialReservations: BackofficeDomainModel.Reservation[] = []) {
        this.reservations = [...initialReservations];
        if (initialReservations.length > 0) {
            this.nextId = Math.max(...initialReservations.map(r => r.id)) + 1;
        }
    }

    async getReservations(restaurantId: number): Promise<BackofficeDomainModel.Reservation[]> {
        return this.reservations.filter(r => r.restaurantId === restaurantId);
    }

    async getReservation(id: number): Promise<BackofficeDomainModel.Reservation> {
        const reservation = this.reservations.find(r => r.id === id);
        if (!reservation) throw new Error(`Reservation ${id} not found`);
        return reservation;
    }

    async createReservation(dto: BackofficeDomainModel.CreateReservationDTO): Promise<BackofficeDomainModel.Reservation> {
        const newReservation: BackofficeDomainModel.Reservation = {
            id: this.nextId++,
            ...dto,
            createdAt: new Date().toISOString(),
        };
        this.reservations.push(newReservation);
        return newReservation;
    }

    async updateReservation(id: number, dto: BackofficeDomainModel.UpdateReservationDTO): Promise<BackofficeDomainModel.Reservation> {
        const reservation = this.reservations.find(r => r.id === id);
        if (!reservation) throw new Error(`Reservation ${id} not found`);
        Object.assign(reservation, dto);
        return reservation;
    }

    async deleteReservation(id: number): Promise<void> {
        const index = this.reservations.findIndex(r => r.id === id);
        if (index === -1) throw new Error(`Reservation ${id} not found`);
        this.reservations.splice(index, 1);
    }
}
```

**Step 2: Commit**

```bash
git add front/src/modules/backoffice/core/testing/stub.reservation-management-gateway.ts
git commit -m "test(backoffice): update StubReservationManagementGateway"
```

---

## Phase 5: Dependencies Registration

### Task 5.1: Register New Gateways in Dependencies

**Files:**
- Modify: `front/src/modules/store/dependencies.ts`

**Step 1: Add gateway types to Dependencies**

```typescript
import { IMealGateway } from '@taotask/modules/order/core/gateway/meal.gateway';
import { IIDProvider } from '@taotask/modules/core/id-provider';
import { ITableGateway } from '@taotask/modules/order/core/gateway/table.gateway';
import { IReservationGateway } from "@taotask/modules/order/core/gateway/reservation.gateway";
import { IRestaurantGateway } from "@taotask/modules/order/core/gateway/restaurant.gateway";
import { IParcoursGateway } from "@taotask/modules/welcome/core/gateway/parcours.gateway";
import { IRestaurantManagementGateway } from "@taotask/modules/backoffice/core/gateway/restaurant.gateway";
import { ITableManagementGateway } from "@taotask/modules/backoffice/core/gateway/table-management.gateway";
import { IMealManagementGateway } from "@taotask/modules/backoffice/core/gateway/meal-management.gateway";
import { IReservationManagementGateway } from "@taotask/modules/backoffice/core/gateway/reservation-management.gateway";

export type Dependencies = {
    idProvider?: IIDProvider;
    parcoursGateway?: IParcoursGateway;
    tableGateway?: ITableGateway;
    mealGateway?: IMealGateway;
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
git commit -m "feat(backoffice): register new management gateways in Dependencies type"
```

---

### Task 5.2: Update Test Environment with New Stubs

**Files:**
- Modify: `front/src/modules/testing/tests-environment.ts`

**Step 1: Add new stubs to createDependencies**

```typescript
import { AppState, createStore } from "@taotask/modules/store/store";
import { Dependencies } from "@taotask/modules/store/dependencies";
import { StubTableGateway } from "@taotask/modules/order/core/testing/stub.table-gateway";
import { StubMealGateway } from "@taotask/modules/order/core/testing/stub.meal-gateway";
import { StubIdProvider } from "@taotask/modules/core/stub.id-provider";
import { MockReservationGateway } from "@taotask/modules/order/core/testing/mock.reservation-gateway";
import { StubRestaurantGateway } from "@taotask/modules/backoffice/core/testing/stub.restaurant-gateway";
import { StubTableManagementGateway } from "@taotask/modules/backoffice/core/testing/stub.table-management-gateway";
import { StubMealManagementGateway } from "@taotask/modules/backoffice/core/testing/stub.meal-management-gateway";
import { StubReservationManagementGateway } from "@taotask/modules/backoffice/core/testing/stub.reservation-management-gateway";

/**
 * Create testing dependencies with provided defaults
 * @param dependencies
 * @returns
 */
const createDependencies = (
  dependencies?: Partial<Dependencies>
): Dependencies => ({
  idProvider: new StubIdProvider(),
  tableGateway: new StubTableGateway(),
  mealGateway: new StubMealGateway(),
  reservationGateway: new MockReservationGateway(),
  restaurantManagementGateway: new StubRestaurantGateway(),
  tableManagementGateway: new StubTableManagementGateway(),
  mealManagementGateway: new StubMealManagementGateway(),
  reservationManagementGateway: new StubReservationManagementGateway(),
  ...dependencies,
});

/**
 * Creates store initialized with a partial state
 * @param config
 * @returns,
 */
export const createTestStore = (config?: {
  initialState?: Partial<AppState>;
  dependencies?: any;
}) => {
  const initialStore = createStore({
    dependencies: createDependencies(config?.dependencies),
  });

  const initialState = {
    ...initialStore.getState(),
    ...config?.initialState,
  };

  const store = createStore({
    initialState,
    dependencies: createDependencies(config?.dependencies),
  });

  return store;
};

/**
 * Useful for testing selectors without setting redux up
 * @param partialState
 * @returns
 */
export const createTestState = (partialState?: Partial<AppState>) => {
  const store = createStore({
    dependencies: createDependencies(),
  });

  const storeInitialState = store.getState();

  const merged = {
    ...storeInitialState,
    ...partialState,
  };

  return createTestStore({ initialState: merged }).getState();
};
```

**Step 2: Commit**

```bash
git add front/src/modules/testing/tests-environment.ts
git commit -m "test(backoffice): register new stubs in test environment"
```

---

## Phase 6: Table Use Cases (TDD)

### Task 6.1: Write fetchTables Use Case Test

**Files:**
- Create: `front/src/modules/backoffice/core/useCase/fetch-tables.usecase.test.ts`

**Step 1: Write the failing test**

```typescript
import { createTestStore } from "@taotask/modules/testing/tests-environment";
import { fetchTables } from "@taotask/modules/backoffice/core/useCase/fetch-tables.usecase";
import { BackofficeDomainModel } from "@taotask/modules/backoffice/core/model/backoffice.domain-model";
import { StubTableManagementGateway } from "@taotask/modules/backoffice/core/testing/stub.table-management-gateway";

describe('fetchTables Use Case', () => {
    const restaurantId = 1;

    const existingTables: BackofficeDomainModel.Table[] = [
        { id: 1, restaurantId: 1, title: 'Table 1', capacity: 4 },
        { id: 2, restaurantId: 1, title: 'Table 2', capacity: 2 },
        { id: 3, restaurantId: 2, title: 'Table 3', capacity: 6 }, // Different restaurant
    ];

    it('should fetch tables for a specific restaurant and store them in state', async () => {
        // GIVEN: A store with stub gateway containing tables
        const gateway = new StubTableManagementGateway(existingTables);
        const store = createTestStore({
            dependencies: { tableManagementGateway: gateway },
        });

        // WHEN: Fetching tables for restaurant 1
        await store.dispatch(fetchTables(restaurantId));

        // THEN: Only tables for restaurant 1 should be in state
        const tables = store.getState().backoffice.tables;
        expect(tables).toHaveLength(2);
        expect(tables[0].title).toBe('Table 1');
        expect(tables[1].title).toBe('Table 2');
    });

    it('should return empty array when restaurant has no tables', async () => {
        // GIVEN: A store with empty gateway
        const gateway = new StubTableManagementGateway([]);
        const store = createTestStore({
            dependencies: { tableManagementGateway: gateway },
        });

        // WHEN: Fetching tables
        await store.dispatch(fetchTables(restaurantId));

        // THEN: State should have empty tables array
        expect(store.getState().backoffice.tables).toEqual([]);
    });
});
```

**Step 2: Run test to verify it fails**

```bash
cd front && pnpm test -- --testPathPattern="fetch-tables.usecase" --watchAll=false
```

Expected: FAIL - `fetchTables` not defined

**Step 3: Commit failing test**

```bash
git add front/src/modules/backoffice/core/useCase/fetch-tables.usecase.test.ts
git commit -m "test(backoffice): add failing test for fetchTables use case"
```

---

### Task 6.2: Implement fetchTables Use Case

**Files:**
- Create: `front/src/modules/backoffice/core/useCase/fetch-tables.usecase.ts`

**Step 1: Implement the use case**

```typescript
import { AppDispatch, AppGetState } from "@taotask/modules/store/store";
import { Dependencies } from "@taotask/modules/store/dependencies";
import { backofficeSlice } from "@taotask/modules/backoffice/core/store/backoffice.slice";

export const fetchTables = (restaurantId: number) =>
    async (dispatch: AppDispatch, getState: AppGetState, dependencies: Dependencies) => {
        const gateway = dependencies.tableManagementGateway;

        if (!gateway) {
            throw new Error('Table management gateway not available');
        }

        const tables = await gateway.getTables(restaurantId);
        dispatch(backofficeSlice.actions.setTables(tables));

        return tables;
    };
```

**Step 2: Run test to verify it passes**

```bash
cd front && pnpm test -- --testPathPattern="fetch-tables.usecase" --watchAll=false
```

Expected: PASS

**Step 3: Commit**

```bash
git add front/src/modules/backoffice/core/useCase/fetch-tables.usecase.ts
git commit -m "feat(backoffice): implement fetchTables use case"
```

---

### Task 6.3: Write createTable Use Case Test

**Files:**
- Create: `front/src/modules/backoffice/core/useCase/create-table.usecase.test.ts`

**Step 1: Write the failing test**

```typescript
import { createTestStore } from "@taotask/modules/testing/tests-environment";
import { createTable } from "@taotask/modules/backoffice/core/useCase/create-table.usecase";
import { BackofficeDomainModel } from "@taotask/modules/backoffice/core/model/backoffice.domain-model";
import { StubTableManagementGateway } from "@taotask/modules/backoffice/core/testing/stub.table-management-gateway";

describe('createTable Use Case', () => {
    const validDTO: BackofficeDomainModel.CreateTableDTO = {
        restaurantId: 1,
        title: 'Table VIP',
        capacity: 6,
    };

    it('should create a table via gateway and store it in state', async () => {
        // GIVEN: A store with empty gateway
        const gateway = new StubTableManagementGateway();
        const store = createTestStore({
            dependencies: { tableManagementGateway: gateway },
        });

        // Verify state is empty
        expect(store.getState().backoffice.tables).toEqual([]);

        // WHEN: Creating a table
        const result = await store.dispatch(createTable(validDTO));

        // THEN: Table should be in state with generated ID
        const tables = store.getState().backoffice.tables;
        expect(tables).toHaveLength(1);
        expect(tables[0]).toMatchObject({
            title: 'Table VIP',
            capacity: 6,
            restaurantId: 1,
        });
        expect(result.id).toBeDefined();
    });

    it('should return the created table with generated ID', async () => {
        // GIVEN: A store
        const gateway = new StubTableManagementGateway();
        const store = createTestStore({
            dependencies: { tableManagementGateway: gateway },
        });

        // WHEN: Creating a table
        const result = await store.dispatch(createTable(validDTO));

        // THEN: Result should have an ID
        expect(result.id).toBeDefined();
        expect(typeof result.id).toBe('number');
        expect(result.title).toBe('Table VIP');
    });
});
```

**Step 2: Run test to verify it fails**

```bash
cd front && pnpm test -- --testPathPattern="create-table.usecase" --watchAll=false
```

Expected: FAIL

**Step 3: Commit failing test**

```bash
git add front/src/modules/backoffice/core/useCase/create-table.usecase.test.ts
git commit -m "test(backoffice): add failing test for createTable use case"
```

---

### Task 6.4: Implement createTable Use Case

**Files:**
- Create: `front/src/modules/backoffice/core/useCase/create-table.usecase.ts`

**Step 1: Implement the use case**

```typescript
import { AppDispatch, AppGetState } from "@taotask/modules/store/store";
import { Dependencies } from "@taotask/modules/store/dependencies";
import { BackofficeDomainModel } from "@taotask/modules/backoffice/core/model/backoffice.domain-model";
import { backofficeSlice } from "@taotask/modules/backoffice/core/store/backoffice.slice";

export const createTable = (dto: BackofficeDomainModel.CreateTableDTO) =>
    async (dispatch: AppDispatch, getState: AppGetState, dependencies: Dependencies) => {
        const gateway = dependencies.tableManagementGateway;

        if (!gateway) {
            throw new Error('Table management gateway not available');
        }

        const newTable = await gateway.createTable(dto);
        dispatch(backofficeSlice.actions.storeTable(newTable));

        return newTable;
    };
```

**Step 2: Run test to verify it passes**

```bash
cd front && pnpm test -- --testPathPattern="create-table.usecase" --watchAll=false
```

Expected: PASS

**Step 3: Commit**

```bash
git add front/src/modules/backoffice/core/useCase/create-table.usecase.ts
git commit -m "feat(backoffice): implement createTable use case"
```

---

### Task 6.5: Write deleteTable Use Case Test

**Files:**
- Create: `front/src/modules/backoffice/core/useCase/delete-table.usecase.test.ts`

**Step 1: Write the failing test**

```typescript
import { createTestStore } from "@taotask/modules/testing/tests-environment";
import { deleteTable } from "@taotask/modules/backoffice/core/useCase/delete-table.usecase";
import { BackofficeDomainModel } from "@taotask/modules/backoffice/core/model/backoffice.domain-model";
import { StubTableManagementGateway } from "@taotask/modules/backoffice/core/testing/stub.table-management-gateway";
import { backofficeSlice } from "@taotask/modules/backoffice/core/store/backoffice.slice";

describe('deleteTable Use Case', () => {
    const existingTables: BackofficeDomainModel.Table[] = [
        { id: 1, restaurantId: 1, title: 'Table 1', capacity: 4 },
        { id: 2, restaurantId: 1, title: 'Table 2', capacity: 2 },
    ];

    it('should delete a table via gateway and remove it from state', async () => {
        // GIVEN: A store with tables in state
        const gateway = new StubTableManagementGateway(existingTables);
        const store = createTestStore({
            dependencies: { tableManagementGateway: gateway },
        });

        // Populate state
        store.dispatch(backofficeSlice.actions.setTables(existingTables));
        expect(store.getState().backoffice.tables).toHaveLength(2);

        // WHEN: Deleting table with ID 1
        await store.dispatch(deleteTable(1));

        // THEN: Table should be removed from state
        const tables = store.getState().backoffice.tables;
        expect(tables).toHaveLength(1);
        expect(tables[0].id).toBe(2);
    });
});
```

**Step 2: Run test to verify it fails**

```bash
cd front && pnpm test -- --testPathPattern="delete-table.usecase" --watchAll=false
```

Expected: FAIL

**Step 3: Commit failing test**

```bash
git add front/src/modules/backoffice/core/useCase/delete-table.usecase.test.ts
git commit -m "test(backoffice): add failing test for deleteTable use case"
```

---

### Task 6.6: Implement deleteTable Use Case

**Files:**
- Create: `front/src/modules/backoffice/core/useCase/delete-table.usecase.ts`

**Step 1: Implement the use case**

```typescript
import { AppDispatch, AppGetState } from "@taotask/modules/store/store";
import { Dependencies } from "@taotask/modules/store/dependencies";
import { backofficeSlice } from "@taotask/modules/backoffice/core/store/backoffice.slice";

export const deleteTable = (tableId: number) =>
    async (dispatch: AppDispatch, getState: AppGetState, dependencies: Dependencies) => {
        const gateway = dependencies.tableManagementGateway;

        if (!gateway) {
            throw new Error('Table management gateway not available');
        }

        await gateway.deleteTable(tableId);
        dispatch(backofficeSlice.actions.removeTable(tableId));
    };
```

**Step 2: Run test to verify it passes**

```bash
cd front && pnpm test -- --testPathPattern="delete-table.usecase" --watchAll=false
```

Expected: PASS

**Step 3: Commit**

```bash
git add front/src/modules/backoffice/core/useCase/delete-table.usecase.ts
git commit -m "feat(backoffice): implement deleteTable use case"
```

---

## Phase 7: Restaurant Detail Page & Tabs

### Task 7.1: Create Restaurant Detail Page Route

**Files:**
- Create: `front/src/app/admin/restaurants/[id]/page.tsx`

**Step 1: Create the page file**

```typescript
import { Metadata } from "next";
import { RestaurantDetailPage } from "@taotask/modules/backoffice/react/pages/restaurant-detail/RestaurantDetailPage";

export const metadata: Metadata = {
    title: "Gestion du restaurant",
    description: "Gestion du restaurant",
    robots: {
        index: false,
        follow: false,
    },
};

export default function RestaurantDetail({ params }: { params: { id: string } }) {
    return <RestaurantDetailPage restaurantId={parseInt(params.id, 10)} />;
}
```

**Step 2: Commit**

```bash
mkdir -p front/src/app/admin/restaurants/\[id\]
git add front/src/app/admin/restaurants/\[id\]/page.tsx
git commit -m "feat(backoffice): add restaurant detail page route"
```

---

### Task 7.2: Create RestaurantDetailPage Component

**Files:**
- Create: `front/src/modules/backoffice/react/pages/restaurant-detail/RestaurantDetailPage.tsx`

**Step 1: Create the component**

```typescript
'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import { LuxuryTabs } from '../../components/ui/LuxuryTabs';
import { LuxuryButton } from '../../components/ui/LuxuryButton';
import { useRestaurantDetail } from './use-restaurant-detail';
import { TablesSection } from '../../sections/tables/TablesSection';
import { MealsSection } from '../../sections/meals/MealsSection';
import { ReservationsSection } from '../../sections/reservations/ReservationsSection';
import { RestaurantInfoSection } from '../../sections/restaurant-info/RestaurantInfoSection';

interface RestaurantDetailPageProps {
    restaurantId: number;
}

const TABS = [
    { id: 'info', label: 'Informations' },
    { id: 'tables', label: 'Tables' },
    { id: 'meals', label: 'Repas' },
    { id: 'reservations', label: 'Réservations' },
];

export const RestaurantDetailPage: React.FC<RestaurantDetailPageProps> = ({ restaurantId }) => {
    const router = useRouter();
    const { restaurant, activeTab, setActiveTab, isLoading } = useRestaurantDetail(restaurantId);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-luxury-bg-primary flex items-center justify-center">
                <div className="text-luxury-gold">Chargement...</div>
            </div>
        );
    }

    if (!restaurant) {
        return (
            <div className="min-h-screen bg-luxury-bg-primary flex items-center justify-center">
                <div className="text-luxury-text-primary">Restaurant non trouvé</div>
            </div>
        );
    }

    const renderTabContent = () => {
        switch (activeTab) {
            case 'info':
                return <RestaurantInfoSection restaurant={restaurant} />;
            case 'tables':
                return <TablesSection restaurantId={restaurantId} />;
            case 'meals':
                return <MealsSection restaurantId={restaurantId} />;
            case 'reservations':
                return <ReservationsSection restaurantId={restaurantId} />;
            default:
                return null;
        }
    };

    return (
        <main className="min-h-screen bg-luxury-bg-primary">
            {/* Header */}
            <div className="border-b border-luxury-gold-border">
                <div className="container mx-auto px-6 py-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <LuxuryButton
                                variant="secondary"
                                onClick={() => router.push('/admin')}
                            >
                                ← Retour
                            </LuxuryButton>
                            <div>
                                <h1 className="text-3xl font-serif text-luxury-text-primary">
                                    {restaurant.name}
                                </h1>
                                <p className="text-luxury-gold-muted">{restaurant.type}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="container mx-auto px-6 py-6">
                <LuxuryTabs
                    tabs={TABS}
                    activeTab={activeTab}
                    onTabChange={setActiveTab}
                />
            </div>

            {/* Tab Content */}
            <div className="container mx-auto px-6 py-6">
                {renderTabContent()}
            </div>
        </main>
    );
};
```

**Step 2: Commit**

```bash
mkdir -p front/src/modules/backoffice/react/pages/restaurant-detail
git add front/src/modules/backoffice/react/pages/restaurant-detail/RestaurantDetailPage.tsx
git commit -m "feat(backoffice): add RestaurantDetailPage component"
```

---

### Task 7.3: Create useRestaurantDetail Hook

**Files:**
- Create: `front/src/modules/backoffice/react/pages/restaurant-detail/use-restaurant-detail.ts`

**Step 1: Create the hook**

```typescript
import { useState, useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '@taotask/modules/store/store';
import { getRestaurant } from '@taotask/modules/backoffice/core/useCase/get-restaurant.usecase';
import { backofficeSlice } from '@taotask/modules/backoffice/core/store/backoffice.slice';

export const useRestaurantDetail = (restaurantId: number) => {
    const dispatch = useAppDispatch();
    const [activeTab, setActiveTab] = useState('info');
    const [isLoading, setIsLoading] = useState(true);

    const restaurant = useAppSelector((state) =>
        state.backoffice.restaurants.find((r) => r.id === restaurantId)
    );

    useEffect(() => {
        const loadRestaurant = async () => {
            setIsLoading(true);
            try {
                dispatch(backofficeSlice.actions.selectRestaurant(restaurantId));
                if (!restaurant) {
                    await dispatch(getRestaurant(restaurantId));
                }
            } finally {
                setIsLoading(false);
            }
        };

        loadRestaurant();
    }, [dispatch, restaurantId, restaurant]);

    return {
        restaurant,
        activeTab,
        setActiveTab,
        isLoading,
    };
};
```

**Step 2: Commit**

```bash
git add front/src/modules/backoffice/react/pages/restaurant-detail/use-restaurant-detail.ts
git commit -m "feat(backoffice): add useRestaurantDetail hook"
```

---

### Task 7.4: Create RestaurantInfoSection

**Files:**
- Create: `front/src/modules/backoffice/react/sections/restaurant-info/RestaurantInfoSection.tsx`

**Step 1: Create the component**

```typescript
'use client';
import React, { useState } from 'react';
import { BackofficeDomainModel } from '@taotask/modules/backoffice/core/model/backoffice.domain-model';
import { LuxuryCard } from '../../components/ui/LuxuryCard';
import { LuxuryButton } from '../../components/ui/LuxuryButton';
import { LuxuryInput } from '../../components/ui/LuxuryInput';
import { useAppDispatch } from '@taotask/modules/store/store';
import { updateRestaurantUseCase } from '@taotask/modules/backoffice/core/useCase/update-restaurant.usecase';

interface RestaurantInfoSectionProps {
    restaurant: BackofficeDomainModel.Restaurant;
}

export const RestaurantInfoSection: React.FC<RestaurantInfoSectionProps> = ({ restaurant }) => {
    const dispatch = useAppDispatch();
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: restaurant.name,
        type: restaurant.type,
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const handleSave = async () => {
        await dispatch(updateRestaurantUseCase(restaurant.id, formData));
        setIsEditing(false);
    };

    const handleCancel = () => {
        setFormData({ name: restaurant.name, type: restaurant.type });
        setIsEditing(false);
    };

    return (
        <div className="max-w-2xl">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-serif text-luxury-text-primary">
                    Informations du restaurant
                </h2>
                {!isEditing && (
                    <LuxuryButton variant="secondary" onClick={() => setIsEditing(true)}>
                        Modifier
                    </LuxuryButton>
                )}
            </div>

            <LuxuryCard>
                {isEditing ? (
                    <div className="space-y-4">
                        <LuxuryInput
                            label="Nom"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                        <LuxuryInput
                            label="Type"
                            name="type"
                            value={formData.type}
                            onChange={handleChange}
                            required
                        />
                        <div className="flex gap-4 pt-4">
                            <LuxuryButton onClick={handleSave}>Enregistrer</LuxuryButton>
                            <LuxuryButton variant="secondary" onClick={handleCancel}>
                                Annuler
                            </LuxuryButton>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <div>
                            <span className="text-sm text-luxury-gold-muted uppercase tracking-wider">
                                Nom
                            </span>
                            <p className="text-luxury-text-primary text-lg">{restaurant.name}</p>
                        </div>
                        <div>
                            <span className="text-sm text-luxury-gold-muted uppercase tracking-wider">
                                Type
                            </span>
                            <p className="text-luxury-text-primary text-lg">{restaurant.type}</p>
                        </div>
                    </div>
                )}
            </LuxuryCard>
        </div>
    );
};
```

**Step 2: Commit**

```bash
mkdir -p front/src/modules/backoffice/react/sections/restaurant-info
git add front/src/modules/backoffice/react/sections/restaurant-info/RestaurantInfoSection.tsx
git commit -m "feat(backoffice): add RestaurantInfoSection component"
```

---

### Task 7.5: Create TablesSection

**Files:**
- Create: `front/src/modules/backoffice/react/sections/tables/TablesSection.tsx`

**Step 1: Create the component**

```typescript
'use client';
import React, { useState } from 'react';
import { LuxuryCard } from '../../components/ui/LuxuryCard';
import { LuxuryButton } from '../../components/ui/LuxuryButton';
import { LuxuryModal } from '../../components/ui/LuxuryModal';
import { LuxuryInput } from '../../components/ui/LuxuryInput';
import { useTables } from './use-tables.hook';

interface TablesSectionProps {
    restaurantId: number;
}

export const TablesSection: React.FC<TablesSectionProps> = ({ restaurantId }) => {
    const { tables, isLoading, createTable, deleteTable } = useTables(restaurantId);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({ title: '', capacity: 2 });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.type === 'number' ? parseInt(e.target.value, 10) : e.target.value;
        setFormData((prev) => ({ ...prev, [e.target.name]: value }));
    };

    const handleSubmit = async () => {
        await createTable({
            restaurantId,
            title: formData.title,
            capacity: formData.capacity,
        });
        setFormData({ title: '', capacity: 2 });
        setIsModalOpen(false);
    };

    const handleDelete = async (tableId: number) => {
        if (confirm('Êtes-vous sûr de vouloir supprimer cette table ?')) {
            await deleteTable(tableId);
        }
    };

    if (isLoading) {
        return <div className="text-luxury-gold">Chargement des tables...</div>;
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-serif text-luxury-text-primary">
                    Tables ({tables.length})
                </h2>
                <LuxuryButton onClick={() => setIsModalOpen(true)}>+ Ajouter</LuxuryButton>
            </div>

            {tables.length === 0 ? (
                <div className="text-center py-12 text-luxury-text-secondary">
                    Aucune table pour ce restaurant. Commencez par en créer une.
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {tables.map((table) => (
                        <LuxuryCard key={table.id} hoverable>
                            <h3 className="text-lg font-semibold text-luxury-text-primary mb-2">
                                {table.title}
                            </h3>
                            <p className="text-luxury-gold-muted mb-4">
                                {table.capacity} {table.capacity > 1 ? 'couverts' : 'couvert'}
                            </p>
                            <div className="flex gap-2">
                                <LuxuryButton
                                    variant="destructive"
                                    onClick={() => handleDelete(table.id)}
                                >
                                    Supprimer
                                </LuxuryButton>
                            </div>
                        </LuxuryCard>
                    ))}
                </div>
            )}

            <LuxuryModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Nouvelle table"
            >
                <div className="space-y-4">
                    <LuxuryInput
                        label="Nom de la table"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        placeholder="Ex: Table VIP 1"
                        required
                    />
                    <LuxuryInput
                        label="Capacité"
                        name="capacity"
                        type="number"
                        value={formData.capacity}
                        onChange={handleChange}
                        min={1}
                        required
                    />
                    <div className="flex gap-4 pt-4">
                        <LuxuryButton onClick={handleSubmit}>Créer</LuxuryButton>
                        <LuxuryButton variant="secondary" onClick={() => setIsModalOpen(false)}>
                            Annuler
                        </LuxuryButton>
                    </div>
                </div>
            </LuxuryModal>
        </div>
    );
};
```

**Step 2: Commit**

```bash
mkdir -p front/src/modules/backoffice/react/sections/tables
git add front/src/modules/backoffice/react/sections/tables/TablesSection.tsx
git commit -m "feat(backoffice): add TablesSection component"
```

---

### Task 7.6: Create useTables Hook

**Files:**
- Modify: `front/src/modules/backoffice/react/sections/tables/use-tables.hook.ts`

**Step 1: Create the hook**

```typescript
import { useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '@taotask/modules/store/store';
import { fetchTables } from '@taotask/modules/backoffice/core/useCase/fetch-tables.usecase';
import { createTable as createTableUseCase } from '@taotask/modules/backoffice/core/useCase/create-table.usecase';
import { deleteTable as deleteTableUseCase } from '@taotask/modules/backoffice/core/useCase/delete-table.usecase';
import { BackofficeDomainModel } from '@taotask/modules/backoffice/core/model/backoffice.domain-model';

export const useTables = (restaurantId: number) => {
    const dispatch = useAppDispatch();
    const tables = useAppSelector((state) => state.backoffice.tables);
    const isLoading = useAppSelector((state) => state.backoffice.isLoading);

    useEffect(() => {
        dispatch(fetchTables(restaurantId));
    }, [dispatch, restaurantId]);

    const createTable = async (dto: BackofficeDomainModel.CreateTableDTO) => {
        await dispatch(createTableUseCase(dto));
    };

    const deleteTable = async (tableId: number) => {
        await dispatch(deleteTableUseCase(tableId));
    };

    return {
        tables,
        isLoading,
        createTable,
        deleteTable,
    };
};
```

**Step 2: Commit**

```bash
git add front/src/modules/backoffice/react/sections/tables/use-tables.hook.ts
git commit -m "feat(backoffice): add useTables hook"
```

---

## Phase 8: Update Landing Page with Luxury Style

### Task 8.1: Update RestaurantsSection with Luxury Style

**Files:**
- Modify: `front/src/modules/backoffice/react/sections/restaurants/RestaurantsSection.tsx`

**Step 1: Update with luxury components and table count**

```typescript
'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { LuxuryCard } from '../../components/ui/LuxuryCard';
import { LuxuryButton } from '../../components/ui/LuxuryButton';
import { LuxuryModal } from '../../components/ui/LuxuryModal';
import { LuxuryInput } from '../../components/ui/LuxuryInput';
import { useRestaurants } from './use-restaurants.hook';

export const RestaurantsSection: React.FC = () => {
    const router = useRouter();
    const { restaurants, isLoading, error, createRestaurant, refetch } = useRestaurants();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({ name: '', type: '' });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async () => {
        await createRestaurant(formData);
        setFormData({ name: '', type: '' });
        setIsModalOpen(false);
    };

    return (
        <section className="min-h-screen bg-luxury-bg-primary">
            <div className="container mx-auto px-6 py-12">
                {/* Header */}
                <div className="flex justify-between items-center mb-12">
                    <div>
                        <h1 className="text-4xl font-serif text-luxury-text-primary mb-2">
                            Vos Établissements
                        </h1>
                        <div className="h-1 w-24 bg-luxury-gold" />
                    </div>
                    <LuxuryButton onClick={() => setIsModalOpen(true)}>
                        + Créer
                    </LuxuryButton>
                </div>

                {/* Loading */}
                {isLoading && (
                    <div className="flex justify-center py-12">
                        <div className="text-luxury-gold">Chargement...</div>
                    </div>
                )}

                {/* Error */}
                {error && (
                    <div className="bg-luxury-rose/20 border border-luxury-rose text-luxury-text-primary px-6 py-4 rounded-lg mb-8">
                        {error}
                    </div>
                )}

                {/* Empty state */}
                {!isLoading && !error && restaurants.length === 0 && (
                    <div className="text-center py-16">
                        <p className="text-luxury-text-secondary text-lg mb-6">
                            Aucun établissement créé pour le moment.
                        </p>
                        <LuxuryButton onClick={() => setIsModalOpen(true)}>
                            Créer votre premier établissement
                        </LuxuryButton>
                    </div>
                )}

                {/* Restaurant grid */}
                {!isLoading && !error && restaurants.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {restaurants.map((restaurant) => (
                            <LuxuryCard key={restaurant.id} hoverable>
                                <h3 className="text-xl font-serif text-luxury-text-primary mb-2">
                                    {restaurant.name}
                                </h3>
                                <p className="text-luxury-gold-muted mb-1">{restaurant.type}</p>
                                <p className="text-luxury-text-secondary text-sm mb-6">
                                    -- tables
                                </p>
                                <LuxuryButton
                                    variant="secondary"
                                    onClick={() => router.push(`/admin/restaurants/${restaurant.id}`)}
                                >
                                    Gérer
                                </LuxuryButton>
                            </LuxuryCard>
                        ))}
                    </div>
                )}
            </div>

            {/* Create Modal */}
            <LuxuryModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Nouvel établissement"
            >
                <div className="space-y-4">
                    <LuxuryInput
                        label="Nom"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Ex: Le Château"
                        required
                    />
                    <LuxuryInput
                        label="Type"
                        name="type"
                        value={formData.type}
                        onChange={handleChange}
                        placeholder="Ex: Gastronomique"
                        required
                    />
                    <div className="flex gap-4 pt-4">
                        <LuxuryButton onClick={handleSubmit}>Créer</LuxuryButton>
                        <LuxuryButton variant="secondary" onClick={() => setIsModalOpen(false)}>
                            Annuler
                        </LuxuryButton>
                    </div>
                </div>
            </LuxuryModal>
        </section>
    );
};
```

**Step 2: Commit**

```bash
git add front/src/modules/backoffice/react/sections/restaurants/RestaurantsSection.tsx
git commit -m "feat(backoffice): update RestaurantsSection with luxury styling"
```

---

### Task 8.2: Update RestaurantsPage to Use New Section

**Files:**
- Modify: `front/src/modules/backoffice/react/pages/restaurants/RestaurantsPage.tsx`

**Step 1: Update the page**

```typescript
'use client';
import React from 'react';
import { RestaurantsSection } from '../../sections/restaurants/RestaurantsSection';

export const RestaurantsPage: React.FC = () => {
    return <RestaurantsSection />;
};
```

**Step 2: Commit**

```bash
git add front/src/modules/backoffice/react/pages/restaurants/RestaurantsPage.tsx
git commit -m "refactor(backoffice): simplify RestaurantsPage"
```

---

### Task 8.3: Update DashboardPage to Redirect to Restaurants

**Files:**
- Modify: `front/src/modules/backoffice/react/pages/dashboard/DashboardPage.tsx`

**Step 1: Make dashboard show restaurants directly**

```typescript
'use client';
import React from 'react';
import { RestaurantsSection } from '../../sections/restaurants/RestaurantsSection';

export const DashboardPage: React.FC = () => {
    return <RestaurantsSection />;
};
```

**Step 2: Commit**

```bash
git add front/src/modules/backoffice/react/pages/dashboard/DashboardPage.tsx
git commit -m "feat(backoffice): update DashboardPage to show restaurants directly"
```

---

## Phase 9: Run All Tests & Final Verification

### Task 9.1: Run All Backoffice Tests

**Step 1: Run tests**

```bash
cd front && pnpm test -- --testPathPattern="backoffice" --watchAll=false
```

Expected: All tests PASS

**Step 2: Run type check**

```bash
cd front && pnpm typecheck
```

Expected: No errors

**Step 3: Run linting**

```bash
cd front && pnpm lint
```

Expected: No errors (or only warnings)

---

### Task 9.2: Final Commit and Summary

**Step 1: Check git status**

```bash
git status
```

**Step 2: If any uncommitted changes, commit them**

```bash
git add .
git commit -m "chore(backoffice): cleanup and finalize implementation"
```

---

## Summary

This plan implements:

1. **Luxury UI Components** (Phase 1): LuxuryButton, LuxuryCard, LuxuryModal, LuxuryTabs, LuxuryInput, LuxurySelect
2. **Domain Model Extensions** (Phase 2): Table, Meal, Guest, Reservation types
3. **Gateway Layer** (Phase 3-4): Interfaces + HTTP adapters + Stubs for all entities
4. **Dependencies Registration** (Phase 5): Wire up new gateways
5. **Table Use Cases with TDD** (Phase 6): fetchTables, createTable, deleteTable
6. **Restaurant Detail Page** (Phase 7): Tabbed interface with Info, Tables, Meals, Reservations
7. **Landing Page Update** (Phase 8): Luxury-styled restaurant list

**Remaining for future phases:**
- MealsSection implementation
- ReservationsSection implementation
- Edit modals for all entities
- Table count on restaurant cards (requires fetching tables per restaurant)
