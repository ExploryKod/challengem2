# Order Module UX Redesign Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Redesign order module UX with new step flow (Meals Preview), progress indicator, guest stepper for meal selection, and capacity enforcement.

**Architecture:** Frontend-only changes to React components, Redux slice (add MEALS_PREVIEW step), and hooks. No backend changes. Follow Clean Architecture pattern with state in Redux, UI in React sections.

**Tech Stack:** Next.js, React 19, Redux Toolkit, TypeScript, Tailwind CSS, LuminousCard components

---

## Task 1: Update Domain Model & Redux Slice for New Step

**Files:**
- Modify: `front/src/modules/order/core/model/ordering.domain-model.ts:60-66`
- Modify: `front/src/modules/order/core/store/ordering.slice.ts`
- Test: `front/src/modules/order/core/store/ordering.slice.test.ts` (create new)

**Step 1: Write failing test for new step enum**

Create `front/src/modules/order/core/store/ordering.slice.test.ts`:

```typescript
import { orderingSlice } from './ordering.slice';
import { OrderingDomainModel } from '../model/ordering.domain-model';

describe('orderingSlice', () => {
  it('should handle setStep to MEALS_PREVIEW', () => {
    const initialState = orderingSlice.getInitialState();
    const action = orderingSlice.actions.setStep(OrderingDomainModel.OrderingStep.MEALS_PREVIEW);
    const newState = orderingSlice.reducer(initialState, action);

    expect(newState.step).toBe(OrderingDomainModel.OrderingStep.MEALS_PREVIEW);
  });
});
```

**Step 2: Run test to verify it fails**

Run: `cd front && pnpm test -- --testPathPattern="ordering.slice" --watchAll=false`
Expected: FAIL - "Property 'MEALS_PREVIEW' does not exist"

**Step 3: Update OrderingStep enum**

In `front/src/modules/order/core/model/ordering.domain-model.ts`, update:

```typescript
export enum OrderingStep {
    RESTAURANT = 0,
    MEALS_PREVIEW = 1,  // NEW
    TABLE = 2,
    GUESTS = 3,
    MEALS = 4,
    SUMMARY = 5,
    RESERVED = 6
}
```

**Step 4: Run test to verify it passes**

Run: `cd front && pnpm test -- --testPathPattern="ordering.slice" --watchAll=false`
Expected: PASS

**Step 5: Commit**

```bash
git add front/src/modules/order/core/model/ordering.domain-model.ts front/src/modules/order/core/store/ordering.slice.test.ts
git commit -m "feat(order): add MEALS_PREVIEW step to OrderingStep enum"
```

---

## Task 2: Update Step Listener for New Flow

**Files:**
- Modify: `front/src/modules/order/core/store/ordering.step.listener.ts`
- Test: Manual verification via running app

**Step 1: Update listener to handle MEALS_PREVIEW step**

In `front/src/modules/order/core/store/ordering.step.listener.ts`, update the listener logic:

Find the listener that handles `selectRestaurant` action and update to dispatch `setStep(MEALS_PREVIEW)` instead of `setStep(GUESTS)`:

```typescript
// Update this pattern (search for selectRestaurant listener)
if (action.type === orderingSlice.actions.selectRestaurant.type) {
  listenerApi.dispatch(orderingSlice.actions.setStep(OrderingDomainModel.OrderingStep.MEALS_PREVIEW));
}
```

Find the listener that handles table selection and update to dispatch `setStep(GUESTS)`:

```typescript
// Update this pattern (search for chooseTable or assignTable)
if (action.type === orderingSlice.actions.assignTable.type) {
  listenerApi.dispatch(orderingSlice.actions.setStep(OrderingDomainModel.OrderingStep.GUESTS));
}
```

**Step 2: Verify listener logic**

Check that the flow now is:
- Restaurant selected → MEALS_PREVIEW
- Continue from preview → TABLE
- Table selected → GUESTS
- Guests submitted → MEALS
- Meals submitted → SUMMARY
- Reserve → RESERVED

**Step 3: Commit**

```bash
git add front/src/modules/order/core/store/ordering.step.listener.ts
git commit -m "feat(order): update step transitions for new flow"
```

---

## Task 3: Create ProgressBar Component

**Files:**
- Create: `front/src/modules/order/react/components/progress/ProgressBar.tsx`
- Create: `front/src/modules/order/react/components/progress/ProgressBar.test.tsx`

**Step 1: Write failing test for ProgressBar**

Create `front/src/modules/order/react/components/progress/ProgressBar.test.tsx`:

```typescript
import { render, screen } from '@testing-library/react';
import { ProgressBar } from './ProgressBar';
import { OrderingDomainModel } from '@taotask/modules/order/core/model/ordering.domain-model';

describe('ProgressBar', () => {
  it('should render progress bar with correct percentage for MEALS_PREVIEW', () => {
    render(<ProgressBar step={OrderingDomainModel.OrderingStep.MEALS_PREVIEW} />);

    const progressBar = screen.getByRole('progressbar');
    expect(progressBar).toHaveAttribute('aria-valuenow', '1');
    expect(progressBar).toHaveAttribute('aria-valuemax', '6');
    expect(screen.getByText(/Étape 2\/6/i)).toBeInTheDocument();
  });

  it('should render correct label for TABLE step', () => {
    render(<ProgressBar step={OrderingDomainModel.OrderingStep.TABLE} />);

    expect(screen.getByText(/Choix de la table/i)).toBeInTheDocument();
  });
});
```

**Step 2: Run test to verify it fails**

Run: `cd front && pnpm test -- --testPathPattern="ProgressBar" --watchAll=false`
Expected: FAIL - "Module not found"

**Step 3: Implement ProgressBar component**

Create `front/src/modules/order/react/components/progress/ProgressBar.tsx`:

```typescript
import React from 'react';
import { OrderingDomainModel } from '@taotask/modules/order/core/model/ordering.domain-model';

interface ProgressBarProps {
  step: OrderingDomainModel.OrderingStep;
}

const STEP_LABELS: Record<OrderingDomainModel.OrderingStep, string> = {
  [OrderingDomainModel.OrderingStep.RESTAURANT]: 'Choix du restaurant',
  [OrderingDomainModel.OrderingStep.MEALS_PREVIEW]: 'Aperçu des plats',
  [OrderingDomainModel.OrderingStep.TABLE]: 'Choix de la table',
  [OrderingDomainModel.OrderingStep.GUESTS]: 'Vos invités',
  [OrderingDomainModel.OrderingStep.MEALS]: 'Commandes',
  [OrderingDomainModel.OrderingStep.SUMMARY]: 'Résumé',
  [OrderingDomainModel.OrderingStep.RESERVED]: 'Confirmé',
};

export const ProgressBar: React.FC<ProgressBarProps> = ({ step }) => {
  // RESERVED step is excluded from progress (confirmation only)
  const totalSteps = 6;
  const currentStep = step >= OrderingDomainModel.OrderingStep.RESERVED ? totalSteps : step + 1;
  const percentage = (currentStep / totalSteps) * 100;

  return (
    <div className="w-full mb-6">
      <div
        className="h-1 bg-luminous-bg-secondary rounded-full overflow-hidden"
        role="progressbar"
        aria-valuenow={step}
        aria-valuemin={0}
        aria-valuemax={totalSteps}
        aria-label={`Étape ${currentStep} sur ${totalSteps}`}
      >
        <div
          className="h-full bg-gradient-to-r from-luminous-gold to-luminous-gold-light transition-all duration-500 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>
      <p className="text-center text-sm text-luminous-text-secondary mt-2">
        Étape {currentStep}/{totalSteps} : {STEP_LABELS[step]}
      </p>
    </div>
  );
};
```

**Step 4: Run test to verify it passes**

Run: `cd front && pnpm test -- --testPathPattern="ProgressBar" --watchAll=false`
Expected: PASS

**Step 5: Commit**

```bash
git add front/src/modules/order/react/components/progress/
git commit -m "feat(order): add ProgressBar component"
```

---

## Task 4: Create MealsPreviewSection Component

**Files:**
- Create: `front/src/modules/order/react/sections/meals-preview/MealsPreviewSection.tsx`
- Create: `front/src/modules/order/react/sections/meals-preview/use-meals-preview.hook.ts`

**Step 1: Create hook for MealsPreviewSection**

Create `front/src/modules/order/react/sections/meals-preview/use-meals-preview.hook.ts`:

```typescript
import { useSelector } from 'react-redux';
import { AppState, useAppDispatch } from '@taotask/modules/store/store';
import { OrderingDomainModel } from '@taotask/modules/order/core/model/ordering.domain-model';
import { orderingSlice } from '@taotask/modules/order/core/store/ordering.slice';

export const useMealsPreview = () => {
  const dispatch = useAppDispatch();
  const meals = useSelector((state: AppState) => state.ordering.meals);
  const restaurantName = useSelector((state: AppState) => {
    const restaurantId = state.ordering.restaurantList.restaurantId;
    const restaurant = state.ordering.restaurantList.restaurants.find(
      r => r.id === restaurantId
    );
    return restaurant?.restaurantName || '';
  });

  const onContinue = () => {
    dispatch(orderingSlice.actions.setStep(OrderingDomainModel.OrderingStep.TABLE));
  };

  const onPrevious = () => {
    dispatch(orderingSlice.actions.setStep(OrderingDomainModel.OrderingStep.RESTAURANT));
  };

  return {
    meals,
    restaurantName,
    onContinue,
    onPrevious,
  };
};
```

**Step 2: Create MealsPreviewSection component**

Create `front/src/modules/order/react/sections/meals-preview/MealsPreviewSection.tsx`:

```typescript
import React from 'react';
import { OrderingDomainModel } from '@taotask/modules/order/core/model/ordering.domain-model';
import Image from 'next/image';
import { LuminousCard } from '@taotask/modules/order/react/components/ui/LuminousCard';
import { LuminousButton } from '@taotask/modules/order/react/components/ui/LuminousButton';
import { useMealsPreview } from './use-meals-preview.hook';

export const MealsPreviewSection: React.FC = () => {
  const presenter = useMealsPreview();

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
        <p className="mx-auto text-luminous-text-secondary text-sm italic text-center mb-4 max-w-[600px]">
          Parcourez les plats disponibles avant de réserver votre table
        </p>
      </div>

      {/* Meals by category */}
      <div className="flex flex-col gap-8">
        {Object.values(OrderingDomainModel.MealType).map((type) => {
          const meals = groupedMeals[type];
          if (meals.length === 0) return null;

          return (
            <div key={type}>
              <h4 className="text-lg font-display font-medium text-luminous-text-primary mb-4 uppercase tracking-wide">
                {mealTypes[type]}s
              </h4>
              <div className="flex gap-4 overflow-x-auto pb-4 scroll-smooth snap-x snap-mandatory">
                {meals.map((meal) => (
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
          variant="primary"
        >
          Continuer
        </LuminousButton>
      </div>
    </LuminousCard>
  );
};
```

**Step 3: Verify component compiles**

Run: `cd front && pnpm typecheck`
Expected: No type errors

**Step 4: Commit**

```bash
git add front/src/modules/order/react/sections/meals-preview/
git commit -m "feat(order): add MealsPreviewSection component"
```

---

## Task 5: Update OrderPage to Include New Steps

**Files:**
- Modify: `front/src/modules/order/react/pages/order/OrderPage.tsx`

**Step 1: Import ProgressBar and MealsPreviewSection**

In `front/src/modules/order/react/pages/order/OrderPage.tsx`, add imports:

```typescript
import { ProgressBar } from '@taotask/modules/order/react/components/progress/ProgressBar';
import { MealsPreviewSection } from '@taotask/modules/order/react/sections/meals-preview/MealsPreviewSection';
```

**Step 2: Add ProgressBar and MealsPreviewSection to render**

Update the JSX to include ProgressBar at the top and MealsPreviewSection in the appropriate step:

```typescript
return (
  <main className="flex flex-col" ref={presenter.animText}>
    <div className="pt-5 pb-2 px-4 sm:px-6 lg:px-8 w-full content-section-minh bg-gradient-to-b from-luminous-bg-primary to-luminous-bg-secondary flex flex-col gap-6 sm:gap-8 lg:gap-10">
      {/* Progress Bar - show for all steps except RESERVED */}
      {step !== OrderingDomainModel.OrderingStep.RESERVED && (
        <ProgressBar step={step} />
      )}

      {!presenter.isTerminalMode && (
        <RestaurantSection
          restaurantList={presenter.restaurantList}
          selectRestaurant={presenter.selectRestaurant}
        />
      )}

      {presenter.restaurantList.restaurantId &&
        step === OrderingDomainModel.OrderingStep.MEALS_PREVIEW && (
          <MealsPreviewSection />
        )}

      {presenter.restaurantList.restaurantId &&
        step === OrderingDomainModel.OrderingStep.TABLE && <TableSection />}

      {presenter.restaurantList.restaurantId &&
        step === OrderingDomainModel.OrderingStep.GUESTS && (
          <GuestSection
            restaurantList={presenter.restaurantList}
            meals={presenter.meals}
          />
        )}

      {presenter.restaurantList.restaurantId &&
        step === OrderingDomainModel.OrderingStep.MEALS && <MealsSection />}

      {presenter.restaurantList.restaurantId &&
        step === OrderingDomainModel.OrderingStep.SUMMARY && <SummarySection />}

      {presenter.restaurantList.restaurantId &&
        step === OrderingDomainModel.OrderingStep.RESERVED && <ReservedSection />}
    </div>
    <div ref={presenter.bottomRef}></div>
  </main>
);
```

**Step 3: Verify app runs without errors**

Run: `cd front && pnpm dev`
Navigate to order page and verify ProgressBar appears and MealsPreviewSection renders when restaurant selected.

**Step 4: Commit**

```bash
git add front/src/modules/order/react/pages/order/OrderPage.tsx
git commit -m "feat(order): integrate ProgressBar and MealsPreviewSection into OrderPage"
```

---

## Task 6: Add Capacity Enforcement to GuestSection

**Files:**
- Modify: `front/src/modules/order/react/sections/guest/GuestSection.tsx`
- Modify: `front/src/modules/order/react/sections/guest/use-guest-section.ts`

**Step 1: Update hook to get table capacity**

In `front/src/modules/order/react/sections/guest/use-guest-section.ts`, add:

```typescript
const tableCapacity = useSelector((state: AppState) => {
  const tableId = state.ordering.form.tableId;
  const table = state.ordering.availableTables.data?.find(t => t.id === tableId);
  return table?.capacity || 0;
});

return {
  // ... existing returns
  tableCapacity,
  isAddGuestDisabled: form.guests.length >= tableCapacity,
};
```

**Step 2: Update GuestSection to show capacity info**

In `front/src/modules/order/react/sections/guest/GuestSection.tsx`, update:

```typescript
export const GuestSection: React.FC<{
  restaurantList: OrderingDomainModel.RestaurantList;
  meals?: OrderingDomainModel.Meal[];
}> = ({restaurantList, meals = []}) => {
  const presenter:any = useGuestSection();

  // ... existing code ...

  return (
    <div className="flex flex-col gap-6">
      <LuminousCard className="mx-auto py-8 sm:py-12 w-full max-w-[1200px] animate-fade-in-down">
        <div className="flex flex-col mx-auto mb-5 w-full">
          {restaurantList.restaurantId ? (
            <>
              <h2 className="mx-auto my-3 font-display font-medium text-luminous-text-primary text-xl sm:text-2xl text-center">
                Qui voulez-vous inviter chez "{restaurantList.restaurants
                  .filter((restaurant:OrderingDomainModel.Restaurant) => restaurant.id === restaurantList.restaurantId)[0].restaurantName}" ?
              </h2>
              {presenter.tableCapacity > 0 && (
                <p className="text-center text-luminous-gold text-sm mb-2">
                  Table de {presenter.tableCapacity} personne{presenter.tableCapacity > 1 ? 's' : ''}
                </p>
              )}
            </>
          ) : (
            <h2 className="mx-auto my-3 font-display font-medium text-luminous-text-primary text-xl sm:text-2xl text-center">
              Pour inviter, choisissez un restaurant
            </h2>
          )}
          <div className="h-1 w-16 bg-luminous-gold mx-auto my-4" />
          {/* ... existing explanatory text ... */}
        </div>

        {/* ... existing guest rows ... */}

        <div ref={presenter.bottomGuestRef} className="flex flex-col sm:flex-row justify-center gap-3 mx-auto w-full mt-6">
          <LuminousButton
            onClick={presenter.addGuest}
            variant="secondary"
            disabled={presenter.isAddGuestDisabled}
          >
            + Inviter une personne
            {presenter.tableCapacity > 0 && (
              <span className="ml-2 text-xs">
                ({presenter.form.guests.length}/{presenter.tableCapacity})
              </span>
            )}
          </LuminousButton>
          <LuminousButton
            onClick={presenter.onNext}
            disabled={presenter.isSubmitable === false}
            variant="success"
          >
            Suivant
          </LuminousButton>
        </div>
      </LuminousCard>

      {/* Remove meals preview section - it's now a separate step */}
    </div>
  );
};
```

**Step 3: Remove meals preview from GuestSection**

Delete the entire meals preview section (lines ~88-157 in current GuestSection.tsx) since it's now a separate step.

**Step 4: Commit**

```bash
git add front/src/modules/order/react/sections/guest/
git commit -m "feat(order): add capacity enforcement and remove meals preview from GuestSection"
```

---

## Task 7: Redesign MealsSection with Guest Stepper

**Files:**
- Modify: `front/src/modules/order/react/sections/meals/MealsSection.tsx`
- Modify: `front/src/modules/order/react/sections/meals/use-meals.hook.ts`
- Create: `front/src/modules/order/react/components/meals/MealSelectionSummary.tsx`

**Step 1: Create MealSelectionSummary component**

Create `front/src/modules/order/react/components/meals/MealSelectionSummary.tsx`:

```typescript
import React from 'react';
import { OrderingDomainModel } from '@taotask/modules/order/core/model/ordering.domain-model';
import { Check, Minus } from 'lucide-react';

interface MealSelectionSummaryProps {
  guest: OrderingDomainModel.Guest;
  meals: OrderingDomainModel.Meal[];
}

export const MealSelectionSummary: React.FC<MealSelectionSummaryProps> = ({ guest, meals }) => {
  const getMealById = (id: string | null) => {
    if (!id) return null;
    return meals.find(m => m.id === id);
  };

  const entry = getMealById(guest.meals.entry);
  const mainCourse = getMealById(guest.meals.mainCourse);
  const dessert = getMealById(guest.meals.dessert);
  const drink = getMealById(guest.meals.drink);

  return (
    <div className="sticky bottom-0 bg-luminous-bg-card border-t-2 border-luminous-gold-border p-4 rounded-t-xl shadow-lg">
      <p className="text-sm font-medium text-luminous-text-primary mb-2">
        {guest.firstName} {guest.lastName}
      </p>
      <div className="flex flex-wrap gap-3 text-xs">
        <div className="flex items-center gap-1">
          <span className="text-luminous-meal-entry font-medium">Entrée:</span>
          {entry ? (
            <>
              <Check className="w-3 h-3 text-luminous-sage" />
              <span className="text-luminous-text-secondary">{entry.title}</span>
            </>
          ) : (
            <>
              <Minus className="w-3 h-3 text-luminous-text-muted" />
              <span className="text-luminous-text-muted">—</span>
            </>
          )}
        </div>
        <div className="flex items-center gap-1">
          <span className="text-luminous-meal-main font-medium">Plat:</span>
          {mainCourse ? (
            <>
              <Check className="w-3 h-3 text-luminous-sage" />
              <span className="text-luminous-text-secondary">{mainCourse.title}</span>
            </>
          ) : (
            <>
              <Minus className="w-3 h-3 text-luminous-text-muted" />
              <span className="text-luminous-text-muted">—</span>
            </>
          )}
        </div>
        <div className="flex items-center gap-1">
          <span className="text-luminous-meal-dessert font-medium">Dessert:</span>
          {dessert ? (
            <>
              <Check className="w-3 h-3 text-luminous-sage" />
              <span className="text-luminous-text-secondary">{dessert.title}</span>
            </>
          ) : (
            <>
              <Minus className="w-3 h-3 text-luminous-text-muted" />
              <span className="text-luminous-text-muted">—</span>
            </>
          )}
        </div>
        <div className="flex items-center gap-1">
          <span className="text-luminous-meal-drink font-medium">Boisson:</span>
          {drink ? (
            <>
              <Check className="w-3 h-3 text-luminous-sage" />
              <span className="text-luminous-text-secondary">{drink.title}</span>
            </>
          ) : (
            <>
              <Minus className="w-3 h-3 text-luminous-text-muted" />
              <span className="text-luminous-text-muted">—</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
```

**Step 2: Update use-meals.hook to support guest stepper**

In `front/src/modules/order/react/sections/meals/use-meals.hook.ts`, add:

```typescript
import { useState } from 'react';

export const useMeals = () => {
  const [currentGuestIndex, setCurrentGuestIndex] = useState(0);

  // ... existing code ...

  const currentGuest = presenter.guests[currentGuestIndex];
  const isLastGuest = currentGuestIndex === presenter.guests.length - 1;
  const isFirstGuest = currentGuestIndex === 0;

  const onNextGuest = () => {
    if (!isLastGuest) {
      setCurrentGuestIndex(currentGuestIndex + 1);
    }
  };

  const onPreviousGuest = () => {
    if (!isFirstGuest) {
      setCurrentGuestIndex(currentGuestIndex - 1);
    }
  };

  return {
    // ... existing returns
    currentGuest,
    currentGuestIndex,
    totalGuests: presenter.guests.length,
    isLastGuest,
    isFirstGuest,
    onNextGuest,
    onPreviousGuest,
  };
};
```

**Step 3: Redesign MealsSection with vertical scroll**

In `front/src/modules/order/react/sections/meals/MealsSection.tsx`, replace the entire component:

```typescript
import React from "react";
import { OrderingDomainModel } from '@taotask/modules/order/core/model/ordering.domain-model';
import Image from 'next/image';
import { useMeals } from '@taotask/modules/order/react/sections/meals/use-meals.hook';
import { LuminousCard } from '@taotask/modules/order/react/components/ui/LuminousCard';
import { LuminousButton } from '@taotask/modules/order/react/components/ui/LuminousButton';
import { MealSelectionSummary } from '@taotask/modules/order/react/components/meals/MealSelectionSummary';

export const MealsSection = () => {
  const presenter = useMeals();

  if (!presenter.currentGuest) {
    return null;
  }

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
    [OrderingDomainModel.MealType.ENTRY]: presenter.getSelectableEntries(presenter.currentGuest.id),
    [OrderingDomainModel.MealType.MAIN_COURSE]: presenter.getSelectableMainCourses(presenter.currentGuest.id),
    [OrderingDomainModel.MealType.DESSERT]: presenter.getSelectableDesserts(presenter.currentGuest.id),
    [OrderingDomainModel.MealType.DRINK]: presenter.getSelectableDrinks(presenter.currentGuest.id),
  };

  return (
    <LuminousCard className="mx-auto py-8 sm:py-12 w-full max-w-[1200px] animate-fade-in-down relative">
      <div className="flex flex-col mx-auto mb-5 w-full">
        <h3 className="mx-auto my-3 font-display font-medium text-luminous-text-primary text-xl sm:text-2xl text-center tracking-wide">
          Commande de {presenter.currentGuest.firstName} {presenter.currentGuest.lastName}
        </h3>
        <p className="text-center text-luminous-text-secondary text-sm mb-2">
          Invité {presenter.currentGuestIndex + 1}/{presenter.totalGuests}
        </p>
        <div className="h-1 w-16 bg-luminous-gold mx-auto my-4" />
      </div>

      {/* Vertical scroll sections for meal categories */}
      <div className="flex flex-col gap-8 mb-8">
        {Object.values(OrderingDomainModel.MealType).map((type) => {
          const meals = groupedMeals[type];
          if (meals.length === 0) return null;

          const selectedMealId =
            type === OrderingDomainModel.MealType.ENTRY ? presenter.currentGuest.meals.entry :
            type === OrderingDomainModel.MealType.MAIN_COURSE ? presenter.currentGuest.meals.mainCourse :
            type === OrderingDomainModel.MealType.DESSERT ? presenter.currentGuest.meals.dessert :
            presenter.currentGuest.meals.drink;

          return (
            <div key={type}>
              <h4 className="text-lg font-display font-medium text-luminous-text-primary mb-4 uppercase tracking-wide">
                {mealTypes[type]}s
              </h4>
              <div className="flex gap-4 overflow-x-auto pb-4 scroll-smooth snap-x snap-mandatory">
                {meals.map((meal) => {
                  const isSelected = selectedMealId === meal.id;
                  const isAgeRestricted = meal.requiredAge && meal.requiredAge > presenter.currentGuest.age;

                  return (
                    <div
                      key={meal.id}
                      onClick={() => {
                        if (!isAgeRestricted) {
                          presenter.onMealSelected(presenter.currentGuest.id, meal.id, meal.type);
                        }
                      }}
                      className={`flex-shrink-0 w-[140px] sm:w-[180px] snap-start cursor-pointer ${isAgeRestricted ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      <div className={`relative rounded-xl overflow-hidden border-2 ${isSelected ? mealBorder[meal.type] : 'border-luminous-gold-border'} ${isSelected ? mealBadgeStyles[meal.type] : 'bg-luminous-bg-card'} shadow-[0_4px_20px_rgba(201,162,39,0.08)] hover:shadow-[0_8px_30px_rgba(201,162,39,0.12)] transition-all duration-300`}>
                        {/* Meal type badge */}
                        <span className={`absolute top-2 left-2 z-10 ${mealBadgeStyles[meal.type]} px-2 py-0.5 rounded-full text-xs font-medium`}>
                          {mealTypes[meal.type]}
                        </span>

                        {/* Selected checkmark */}
                        {isSelected && (
                          <div className="absolute top-2 right-2 z-10 w-6 h-6 bg-luminous-sage rounded-full flex items-center justify-center">
                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                        )}

                        {/* Meal image */}
                        <Image
                          width={200}
                          height={200}
                          src={meal.imageUrl}
                          alt={meal.title}
                          className="w-full h-[120px] sm:h-[150px] object-cover"
                        />

                        {/* Meal info */}
                        <div className="p-3">
                          <h5 className="text-sm font-medium text-luminous-text-primary text-center truncate">
                            {meal.title}
                          </h5>
                          <p className="text-sm font-semibold text-luminous-gold text-center mt-1">
                            {meal.price} €
                          </p>
                          {meal.requiredAge && (
                            <p className={`text-xs text-center mt-1 ${isAgeRestricted ? 'text-luminous-rose' : 'text-luminous-text-muted'}`}>
                              {meal.requiredAge}+ ans requis
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Selection summary */}
      <MealSelectionSummary guest={presenter.currentGuest} meals={presenter.meals} />

      {/* Navigation */}
      <div className="flex flex-col sm:flex-row justify-center gap-3 mx-auto w-full mt-8">
        {!presenter.isFirstGuest && (
          <LuminousButton
            onClick={presenter.onPreviousGuest}
            variant="secondary"
          >
            Invité précédent
          </LuminousButton>
        )}

        {presenter.currentGuestIndex === 0 && (
          <LuminousButton
            onClick={presenter.onPrevious}
            variant="secondary"
          >
            Précédent
          </LuminousButton>
        )}

        <LuminousButton
          onClick={presenter.onSkip}
          variant="destructive"
        >
          Passer les commandes
        </LuminousButton>

        {!presenter.isLastGuest ? (
          <LuminousButton
            onClick={presenter.onNextGuest}
            variant="success"
          >
            Invité suivant
          </LuminousButton>
        ) : (
          <LuminousButton
            onClick={presenter.onNext}
            variant="success"
          >
            Suivant
          </LuminousButton>
        )}
      </div>
    </LuminousCard>
  );
};
```

**Step 4: Commit**

```bash
git add front/src/modules/order/react/sections/meals/ front/src/modules/order/react/components/meals/
git commit -m "feat(order): redesign MealsSection with guest stepper and vertical scroll"
```

---

## Task 8: Add Price Total to SummarySection

**Files:**
- Modify: `front/src/modules/order/react/sections/summary/SummarySection.tsx`
- Modify: `front/src/modules/order/react/sections/summary/use-summary.hook.ts`

**Step 1: Update hook to calculate total price**

In `front/src/modules/order/react/sections/summary/use-summary.hook.ts`, add:

```typescript
const totalPrice = useMemo(() => {
  let total = 0;
  presenter.summary.guests.forEach((guest: any) => {
    if (guest.meals.entry) total += guest.meals.entry.price;
    if (guest.meals.mainCourse) total += guest.meals.mainCourse.price;
    if (guest.meals.dessert) total += guest.meals.dessert.price;
    if (guest.meals.drink) total += guest.meals.drink.price;
  });
  return total.toFixed(2);
}, [presenter.summary.guests]);

return {
  // ... existing returns
  totalPrice,
};
```

Don't forget to import `useMemo` from React.

**Step 2: Add price total to SummarySection**

In `front/src/modules/order/react/sections/summary/SummarySection.tsx`, add after the guests grid:

```typescript
{/* Price Total */}
<div className="bg-luminous-bg-secondary border-2 border-luminous-gold rounded-xl p-4 mx-auto max-w-[400px] mt-6">
  <p className="text-center font-display font-medium text-lg text-luminous-text-primary">
    Total estimé
  </p>
  <p className="text-center text-2xl font-bold text-luminous-gold mt-2">
    {presenter.totalPrice} €
  </p>
  <p className="text-center text-xs text-luminous-text-muted mt-1 italic">
    (hors pourboire)
  </p>
</div>
```

**Step 3: Commit**

```bash
git add front/src/modules/order/react/sections/summary/
git commit -m "feat(order): add price total to SummarySection"
```

---

## Task 9: Manual Testing & Refinement

**Step 1: Run the app and test complete flow**

```bash
cd front && pnpm dev
```

Navigate to order page and test:
1. Select restaurant → verify progress bar shows
2. See meals preview → verify all categories display
3. Click continue → verify goes to table selection
4. Select table → verify goes to guests
5. Add guests up to capacity → verify "Add guest" disables
6. Submit guests → verify goes to meals
7. Order meals for each guest → verify stepper works
8. Go to summary → verify price total shows
9. Reserve → verify confirmation

**Step 2: Fix any issues found**

Document and fix issues discovered during testing.

**Step 3: Run full test suite**

```bash
cd front && pnpm test -- --watchAll=false
```

Expected: All tests pass

**Step 4: Commit any fixes**

```bash
git add .
git commit -m "fix(order): address issues found in manual testing"
```

---

## Task 10: Final Cleanup & Documentation

**Step 1: Remove unused code**

- Remove old carousel logic if not used
- Remove unused imports
- Clean up any commented code

**Step 2: Update CLAUDE.md if needed**

Document any new patterns or components added.

**Step 3: Final commit**

```bash
git add .
git commit -m "chore(order): final cleanup after UX redesign"
```

**Step 4: Push branch**

```bash
git push -u origin feature/order-ux-redesign
```

---

## Success Criteria

- ✅ Progress bar visible on all steps (except RESERVED)
- ✅ New flow: Restaurant → Meals Preview → Table → Guests → Meals → Summary → Reserved
- ✅ Meals Preview shows all categories, view-only
- ✅ Table selected before guests (capacity constraint established)
- ✅ Guests step shows capacity, disables "Add guest" when full
- ✅ Meals step uses guest stepper (one guest at a time)
- ✅ Meal categories show vertically (horizontal scroll within each)
- ✅ Selection summary shows current guest's picks
- ✅ Age restrictions enforced (dimmed, cannot select)
- ✅ Summary shows price total
- ✅ All existing tests pass
- ✅ Manual testing confirms smooth UX

---

## Notes for Engineer

**YAGNI Applied:**
- No inline edit from Summary (use "Précédent" instead)
- No wishlist/favorites in Meals Preview
- No auto-advance on single-select steps
- No table descriptions/layouts

**Testing Strategy:**
- TDD for new components (ProgressBar, MealSelectionSummary)
- Manual testing for complex flows (guest stepper, capacity enforcement)
- Regression testing for existing use cases

**Common Pitfalls:**
- Don't forget to update step listeners when changing flow
- Ensure currentGuestIndex resets when re-entering Meals step
- Verify age restrictions work correctly (guest.age vs meal.requiredAge)
- Test with 1 guest, max capacity guests, and in-between

**Performance:**
- Horizontal scrolls use CSS (no JS libraries)
- Images lazy-load via Next.js Image component
- Progress bar uses CSS transitions (smooth, hardware-accelerated)

---

**End of Implementation Plan**
