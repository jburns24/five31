# Task 2.0 Proof Artifacts - Theoretical 1RM Card Migration

## Overview

This document provides evidence that Task 2.0 has been completed successfully, migrating the theoretical 1RM section from the Account page to the Stats page.

## CLI Output

### TypeScript Check

```bash
$ npx tsc --noEmit
# No output - all type checks pass
```

### Test Results

```bash
$ npm test

PASS  lib/autoIncrementLogic.test.ts
PASS  lib/workoutCalculator.test.ts
PASS  lib/oneRMCalculation.test.ts
PASS  lib/prDetection.test.ts
PASS  lib/workoutNavigation.test.ts

Test Suites: 5 passed, 5 total
Tests:       119 passed, 119 total
```

## Files Created/Modified

### 2.1 - components/Theoretical1RMSection.tsx (Created)

New presentational component that:
- Accepts `theoretical1RMs` and `units` as props
- Displays all four lifts in a grid using existing CSS classes
- Shows "—" for lifts without data
- Includes emoji icon for visual consistency

```tsx
'use client'

import type { LiftType } from '@/lib/autoIncrementLogic'

interface Theoretical1RMSectionProps {
  theoretical1RMs: Partial<Record<LiftType, number>>
  units: 'lbs' | 'kg'
}

export default function Theoretical1RMSection({
  theoretical1RMs,
  units,
}: Theoretical1RMSectionProps) {
  // ... displays grid with all four lifts
}
```

### 2.2 - app/stats/page.tsx (Modified)

Updated to:
- Import `calculateOneRM` and `IAMRAPHistoryEntry`
- Calculate theoretical 1RM from AMRAP history (same logic as was in account page)
- Pass calculated values to `Theoretical1RMSection`

```tsx
// Calculate theoretical 1RM values from AMRAP history
const amrapHistory = (user.amrapHistory || []) as IAMRAPHistoryEntry[]
const theoretical1RMs: Partial<Record<LiftType, number>> = {}

const lifts: LiftType[] = ['squat', 'bench', 'deadlift', 'overheadPress']
for (const lift of lifts) {
  const liftHistory = amrapHistory.filter((entry) => entry.lift === lift)
  if (liftHistory.length > 0) {
    const best = liftHistory.reduce((max, entry) => {
      const theoretical = calculateOneRM(entry.weight, entry.reps)
      return theoretical > max ? theoretical : max
    }, 0)
    if (best > 0) {
      theoretical1RMs[lift] = best
    }
  }
}
```

### 2.3 - components/AccountOneRMSection.tsx (Modified)

Removed:
- `theoretical1RMs` from interface props
- `theoretical1RMs` from destructured parameters
- Entire `{theoretical1RMs && Object.keys(theoretical1RMs).length > 0 && ...}` JSX block

### 2.4 - app/account/page.tsx (Modified)

Removed:
- `import { calculateOneRM }` - no longer needed
- Entire `theoretical1RMs` calculation block
- `theoretical1RMs={theoretical1RMs}` prop from `<AccountOneRMSection>`

### 2.5 - Empty State in Theoretical1RMSection

Component handles empty state:

```tsx
if (!hasAnyData) {
  return (
    <section className="stats-section">
      <h2 className="stats-section-title">📊 Theoretical 1RM</h2>
      <p className="stats-empty-state">
        No data yet. Complete AMRAP sets in your workouts to see your theoretical 1RM values here.
      </p>
    </section>
  )
}
```

## CSS Additions

Added to `app/globals.css`:

```css
.stats-empty-state {
  color: #888888;
  font-size: 0.9375rem;
  text-align: center;
  padding: 2rem 1rem;
  background: #222222;
  border-radius: 8px;
  line-height: 1.5;
}

.stats-section-description {
  color: #888888;
  font-size: 0.875rem;
  margin-bottom: 1rem;
  text-align: center;
}
```

## Verification

### Migration Verified

- Theoretical 1RM calculation logic moved from `app/account/page.tsx` to `app/stats/page.tsx`
- Same Epley formula via `calculateOneRM` function
- Existing `theoretical-1rm-grid` CSS styles reused

### Removal Verified

- `AccountOneRMSection` no longer has `theoretical1RMs` prop
- Account page no longer calculates theoretical 1RMs
- TypeScript compilation passes without errors

### Empty State Verified

- Component checks if any lift has data
- Displays friendly message guiding users to complete AMRAP sets
- Uses styled empty state container

## Screenshots

*Note: Screenshots would be captured during manual testing.*

### Expected Visual Results:

1. Stats page shows "📊 Theoretical 1RM" section with values for each lift
2. Account page no longer shows theoretical 1RM section
3. For users without AMRAP history, Stats page shows "No data yet" placeholder
