# Order Module UX Redesign

**Date:** 2026-01-22
**Status:** Design approved
**Context:** Dual-use interface (kiosk/terminal + home pre-booking)

## Problem Statement

The current order module has several UX issues:
- No progress indicator - users feel lost
- Suboptimal step order - guests defined before knowing table capacity
- High cognitive load in meal selection - carousel per guest with all types mixed
- Missing context throughout the flow

## Design Overview

### New Flow Structure

```
Restaurant → Meals Preview → Table → Guests → Meals → Summary → Reserved
```

**Step progression:**
1. **Restaurant** - User selects restaurant
2. **Meals Preview** - User browses menu (inspiration, budget, dietary awareness)
3. **Table** - User selects table, establishing capacity constraint
4. **Guests** - User adds guests within table capacity
5. **Meals** - User orders for each guest (stepper flow)
6. **Summary** - User reviews complete reservation
7. **Reserved** - Confirmation screen

### Progress Indicator

**Design:** Progress bar + label

- Thin progress bar (4px) at top of page
- Fills left-to-right with luminous-gold gradient
- Label below: "Étape X/6 : [Step name]"
- Smooth animation on step transitions
- Fixed position, visible on all steps
- Accessibility: aria-label "Étape X sur 6"

## Step-by-Step Design

### Step 1: Restaurant Selection

**Current behavior:** Keep as-is
**Changes:** None needed, works well

---

### Step 2: Meals Preview (NEW)

**Purpose:** Informational preview to help decision-making before commitment

**Layout:**
- Header: "Découvrez notre carte" + restaurant name
- Progress: ~15% filled, "Étape 2/6 : Aperçu des plats"

**Content:**
- Meals grouped by category: Entrées, Plats, Desserts, Boissons
- Each category as horizontal scrollable row
- Cards display: image, title, price, age badge (if restricted)
- **View-only** - no selection interaction

**Card specifications:**
- Mobile: ~140px width (thumb-friendly)
- Kiosk/Desktop: ~180px width
- Horizontal scroll within each category row

**Navigation:**
- "Continuer" button at bottom
- "Précédent" returns to restaurant selection

---

### Step 3: Table Selection

**Purpose:** Establish capacity constraint

**Layout:**
- Header: "Choix de votre table"
- Progress: ~30% filled, "Étape 3/6 : Choix de la table"

**Content:**
- Grid of table cards (keep current design)
- Card shows: name, capacity icons, "X places" text
- Selected state: gold border + subtle gold background

**Behavior:**
- Single selection (radio-button style)
- "Suivant" enabled only when table selected

**Enhancement:**
- Show helper text when selected: "Vous pourrez inviter jusqu'à X personnes"
- Primes user for next step

**Navigation:**
- "Précédent" returns to Meals Preview
- "Suivant" advances to Guests

---

### Step 4: Guests

**Purpose:** Add guest information within table capacity

**Layout:**
- Header: "Vos invités"
- Subtitle: "Table de X personnes"
- Progress: ~45% filled, "Étape 4/6 : Vos invités"

**Guest form:**
- Each guest as card with fields: Prénom, Nom, Âge
- Organizer checkbox per guest
- Delete button per guest
- Keep current card styling (LuminousCard)

**Capacity enforcement:**
- "Ajouter un invité" disabled when guests = table capacity
- Helper text: "X/Y places occupées"

**Validation:**
- Minimum 1 guest required
- All fields required per guest
- Exactly 1 organizer required
- Inline validation with visual feedback

**Simplification:**
- Remove meals preview from this section (now separate step)
- Focus only on guest information

**Navigation:**
- "Précédent" returns to Table (preserves guest data)
- "Suivant" enabled when valid (≥1 guest, all fields filled, 1 organizer)

---

### Step 5: Meals (REDESIGNED)

**Purpose:** Order meals for each guest

**Layout:**
- Header: "Commande de [Prénom Nom]"
- Progress: ~60% filled, "Étape 5/6 : Commandes"
- Sub-progress: "Invité X/Y"

**Guest stepper (linear flow):**
- User completes one guest fully before moving to next
- "Invité suivant" button to advance
- "Invité précédent" to go back
- No arbitrary jumping between guests (keeps it simple)

**Meal categories (vertical scroll):**

```
┌─────────────────────────────────┐
│ ENTRÉES                         │
│ [Card] [Card] [Card] →          │
├─────────────────────────────────┤
│ PLATS                           │
│ [Card] [Card] [Card] →          │
├─────────────────────────────────┤
│ DESSERTS                        │
│ [Card] [Card] [Card] →          │
├─────────────────────────────────┤
│ BOISSONS                        │
│ [Card] [Card] [Card] →          │
└─────────────────────────────────┘
```

- Each category: label + horizontal scrollable row
- All categories visible on one page (vertical scroll)
- Horizontal scroll within each category

**Meal card:**
- Shows: image, title, price, age badge if restricted
- Selected state: gold border + subtle checkmark overlay
- Tap to select, tap again to deselect
- Empty = skipped (YAGNI - no explicit "Pas de plat" option)

**Age restriction:**
- Meals with requiredAge > guest's age are dimmed
- On tap: tooltip "Réservé aux plus de X ans"
- Cannot be selected

**Selection summary (inline or sticky):**
```
Jean: Entrée ✓ | Plat ✓ | Dessert — | Boisson ✓
```
- Shows current guest's selections at-a-glance
- "—" indicates skipped category
- Updates live as user selects/deselects

**Navigation:**
- "Invité précédent" / "Invité suivant" for guest stepper
- On last guest: "Suivant" advances to Summary
- "Précédent" (global) returns to Guests step

---

### Step 6: Summary

**Purpose:** Review complete reservation before confirming

**Layout:**
- Header: "Votre réservation"
- Progress: ~85% filled, "Étape 6/6 : Résumé"

**Content sections:**

**1. Restaurant & Table:**
```
┌─────────────────────────────────┐
│ Restaurant: Le Petit Bistrot    │
│ Table: Terrasse Sud (4 places)  │
└─────────────────────────────────┘
```

**2. Guests & Orders:**
```
┌─────────────────────────────────┐
│ Jean Dupont ⭐ Organisateur     │
│   Entrée: Salade César          │
│   Plat: Entrecôte               │
│   Boisson: Eau minérale         │
├─────────────────────────────────┤
│ Marie Martin                    │
│   Plat: Risotto                 │
│   Dessert: Tiramisu             │
│   Boisson: Vin rouge ⚠️         │
└─────────────────────────────────┘
```

- Organizer badge clearly visible
- Alcohol + organizer warning (keep current behavior)
- Skipped categories not shown (cleaner)

**3. Price Total (NEW):**
```
┌─────────────────────────────────┐
│ Total estimé: 85,00 €           │
└─────────────────────────────────┘
```
- Sum of all selected meals
- Label as "estimé" (final may vary)

**Editing:**
- No inline edit capability (YAGNI)
- User clicks "Précédent" to modify
- Avoids complex state management

**Navigation:**
- "Précédent" returns to Meals (last guest)
- "Réserver" confirms and creates reservation

---

### Step 7: Reserved

**Current behavior:** Keep as-is
**Changes:** None needed

---

## Cross-cutting Concerns

### Data Persistence

**Rule:** All steps preserve data when navigating back/forward

**Exception:** Changing restaurant clears subsequent data

- Show confirmation modal: "Changer de restaurant effacera vos sélections. Continuer?"
- Prevents accidental data loss

### Validation Strategy

- **Inline validation** where possible (guest form fields)
- **Disabled buttons** when validation fails
- **Error messages** below fields (not blocking modals)
- Clear visual feedback (red borders, helper text)

### Responsive Behavior

**Mobile:**
- Cards stack vertically
- Horizontal scrolls for meal rows
- Single-column layouts

**Kiosk/Desktop:**
- Grid layouts where appropriate
- Larger touch targets
- Same interaction patterns (no split mobile/desktop UX)

**Consistency:** No carousel vs cards differences between devices

### Accessibility

- Progress bar: `aria-label="Étape 3 sur 6"`
- Disabled buttons: `aria-disabled` + tooltip explaining why
- Card selections: proper focus states
- Keyboard navigation support

### Loading States

- Skeleton loaders during data fetching
- Progress bar remains visible during async operations
- No blocking spinners

## Technical Considerations

### State Management

**Redux state shape (ordering slice):**
```typescript
{
  step: OrderingStep,
  restaurantList: RestaurantList,
  form: {
    guests: Guest[],
    organizerId: string | null,
    tableId: string | null
  },
  availableTables: Table[],
  meals: Meal[]
}
```

**New step enum:**
```typescript
enum OrderingStep {
  RESTAURANT = 0,
  MEALS_PREVIEW = 1,  // NEW
  TABLE = 2,
  GUESTS = 3,
  MEALS = 4,
  SUMMARY = 5,
  RESERVED = 6
}
```

### Components to Create/Modify

**New:**
- `MealsPreviewSection.tsx` - Step 2
- `ProgressBar.tsx` - Global progress indicator
- `GuestStepper.tsx` - Guest navigation in Meals step
- `MealSelectionSummary.tsx` - Inline selection status

**Modified:**
- `OrderPage.tsx` - Add new step routing
- `GuestSection.tsx` - Remove meals preview, add capacity enforcement
- `MealsSection.tsx` - Complete redesign (guest stepper + vertical scroll)
- `SummarySection.tsx` - Add price total
- `ordering.slice.ts` - Add MEALS_PREVIEW step
- `ordering.step.listener.ts` - Update step transitions

### Data Flow

**Meals Preview step:**
1. Fetch meals when entering step (if not cached)
2. Display view-only
3. No state mutations

**Guests step:**
1. Read selected table capacity
2. Enforce capacity during "add guest"
3. Validate before allowing "Suivant"

**Meals step:**
1. Track current guest index (local state)
2. Update Redux when meal selected/deselected
3. Filter meals by guest age
4. Show summary per guest

**Summary step:**
1. Calculate total price (reduce over all selected meals)
2. Display read-only reservation details

## Success Metrics

**UX improvements:**
- Users can see progress at all times
- Users understand table capacity before adding guests
- Users see menu before committing to reservation
- Meal selection is clearer (one guest at a time)
- Users see total price before confirming

**Implementation checklist:**
- [ ] Progress bar component
- [ ] Meals Preview section
- [ ] Table capacity enforcement in Guests
- [ ] Guest stepper in Meals section
- [ ] Vertical scroll meal categories
- [ ] Selection summary per guest
- [ ] Price total in Summary
- [ ] Update step enum and routing
- [ ] Update Redux listeners
- [ ] Responsive testing (mobile + kiosk)
- [ ] Accessibility testing

## Future Enhancements (Out of Scope)

- Inline edit from Summary
- Jump to arbitrary guest during meal selection
- Meal wishlist/favorites in Preview
- Table descriptions/location context
- Auto-advance for single-select steps

---

**End of Design Document**
