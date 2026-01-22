# QR Code Ordering Feature

**Date:** 2026-01-23
**Status:** Design approved
**Context:** Tableside ordering via QR code for customers and waiters

## Problem Statement

Currently, the order flow is designed for web pre-booking with full guest details (first name, last name, age, organizer). For tableside ordering where customers are already seated, this is unnecessarily complex.

We need a unified flow that works for:
- **Self-service customers** scanning a QR code at their table
- **Waiters** helping customers place orders using the same interface

## Design Overview

### Core Concept

Each table has a QR code that encodes a URL with pre-filled context:
```
https://yourapp.com/order?table={tableId}&restaurant={restaurantId}
```

Scanning the QR opens the order flow with table and restaurant already selected, skipping directly to a simplified guest input step.

### Flow Comparison

| Step | Web Flow | QR Flow |
|------|----------|---------|
| Restaurant | User selects | **Pre-filled from URL** |
| Meals Preview | User browses menu | **Skipped** |
| Table | User selects | **Pre-filled from URL** |
| Guests | Full form (first, last, age, organizer) | **Simplified** (name only) |
| Meals | Same | Same |
| Summary | Same | Same |
| Reserved | Same | Same |

### QR Mode Detection

**Trigger:** URL contains both `table` and `restaurant` query parameters

```typescript
// Example URL parsing
const params = new URLSearchParams(window.location.search);
const tableId = params.get('table');
const restaurantId = params.get('restaurant');
const isQRMode = tableId && restaurantId;
```

## Detailed Design

### Step 1: QR Code Scanning

**User action:** Scan QR code with phone camera or QR app

**Result:** Browser opens to order URL with pre-filled params

**QR Code content:**
```
https://smartcafe.app/order?table=5&restaurant=abc123
```

### Step 2: Simplified Guest Input

**Purpose:** Identify people at the table for order assignment

**Layout:**
- Header: "Qui mange ?" or "Combien de convives ?"
- Table context displayed: "Table 5 - Le Petit Bistrot"

**Guest form (simplified):**
- Single field per guest: Name/identifier
- Accepts: "Alice", "Bob" or "1", "2", "3"
- No last name required
- No age required
- No organizer concept

**Adding guests:**
- "Ajouter" button to add more guests
- Capacity enforced from table data (fetched via API)
- Helper text: "X/Y places"

**Validation:**
- Minimum 1 guest
- Name field required (non-empty)

**Navigation:**
- "Suivant" advances to Meals step

### Step 3: Meals Selection

**Behavior:** Identical to web flow (from worktree redesign)

- Guest stepper: one guest at a time
- Categories: Entrées, Plats, Desserts, Boissons
- Horizontal scroll per category, vertical scroll for page
- Tap to select/deselect

**Difference from web flow:**
- No age restrictions enforced (no age data)
- Waiter checks IDs manually for alcohol (real-world validation)

### Step 4: Summary

**Behavior:** Identical to web flow

- Shows all guests with their orders
- Shows total price
- No organizer badge (no organizer in QR mode)

### Step 5: Confirmation

**Behavior:** Identical to web flow

- Creates reservation/order via API
- Shows confirmation screen

## Technical Implementation

### State Management

**New state in ordering slice:**
```typescript
{
  // Existing fields...
  qrMode: boolean,
  prefilledTableId: string | null,
  prefilledRestaurantId: string | null,
}
```

**Simplified guest type for QR mode:**
```typescript
type QRGuest = {
  id: string,
  name: string,  // Could be "Alice" or "Guest 1"
  meals: {
    entry: MealId | null,
    mainCourse: MealId | null,
    dessert: MealId | null,
    drink: MealId | null
  }
}
```

### New/Modified Components

**New:**
- `QRGuestSection.tsx` - Simplified guest input for QR mode

**Modified:**
- `OrderPage.tsx` - Detect QR mode, route to correct starting step
- `ordering.slice.ts` - Add QR mode state
- `ordering.step.listener.ts` - Handle QR mode step transitions

### URL Parameter Handling

**On page load:**
1. Parse URL for `table` and `restaurant` params
2. If both present:
   - Set `qrMode: true`
   - Fetch table details (validate table exists, get capacity)
   - Fetch restaurant details (validate restaurant exists)
   - Skip to Guests step
3. If params missing or invalid:
   - Fall back to normal web flow

### API Considerations

**Existing endpoints used:**
- `GET /tables?restaurantId=xxx` - Validate table exists
- `GET /restaurants` - Validate restaurant exists
- `GET /meals?restaurantId=xxx` - Fetch menu
- `POST /reservations` - Create order

**Payload adaptation:**
When creating reservation in QR mode, map simplified guests to API format:
```typescript
// QR mode guest
{ name: "Alice", meals: {...} }

// Mapped to API format
{
  firstName: "Alice",
  lastName: "",  // Empty or "Guest"
  age: 0,        // Or null if API allows
  meals: {...}
}
```

## QR Code Generation (Future)

**Out of scope for initial implementation.**

For now: Generate QR codes manually or via external tool.

**Future enhancement:** Admin backoffice feature to generate/print QR codes per table.

## Waiter Mode (Future)

**Out of scope for initial implementation.**

Current design: Same experience for customers and waiters.

**Future enhancement:**
- Waiter authentication (PIN after scan)
- `waiterMode: true` flag in session
- Additional capabilities: notes, discounts, table management

## Edge Cases

### Invalid QR Parameters

**Scenario:** QR code has invalid table or restaurant ID

**Handling:**
1. Show error message: "Table ou restaurant introuvable"
2. Offer fallback: "Commander sans QR code" button
3. Redirects to normal web flow

### Table at Capacity

**Scenario:** User tries to add more guests than table capacity

**Handling:**
- "Ajouter" button disabled
- Helper text: "Table complète (X/X places)"

### No Meals Selected

**Scenario:** User skips all meals for a guest

**Handling:** Allowed - guest can be added without ordering (maybe just drinks later)

## Success Criteria

- [ ] QR code scan opens order page with pre-filled context
- [ ] Simplified guest input (name only)
- [ ] Same Meals/Summary/Confirmation flow as web
- [ ] Capacity enforcement from table data
- [ ] Graceful fallback for invalid QR params
- [ ] Works on mobile browsers (primary use case)

## Future Enhancements (Out of Scope)

- QR code generation in backoffice
- Waiter authentication and waiter mode
- Special notes/requests field
- Discounts and promotions
- Order history per table
- Split bill functionality
- Age verification for alcohol

---

**End of Design Document**
