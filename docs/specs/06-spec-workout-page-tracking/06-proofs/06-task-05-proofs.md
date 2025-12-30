# Task 5.0 Proof Artifacts - Auto-Navigation and Workout Progression

## Video: Auto-Navigation to First Incomplete Workout

**Scenario:**
- User has completed Week 1: Squat, Bench, Deadlift
- Week 2: Squat is in progress (some sets complete)
- User loads `/workout` page

**What to Demonstrate:**
1. Page loads initially (may show loading state)
2. Page automatically navigates to Week 2, Squat
3. URL shows `/workout?week=2&lift=squat`
4. First incomplete workout displayed

**Status:** ⬜ Not Started / 🟡 In Progress / ✅ Complete

**Video/Screenshots:**
```
[Insert video link or series of screenshots showing auto-navigation]
```

---

## Screenshot: All Workouts Complete Message

**Location:** `/workout` page when all sets across all weeks are complete

**What to Capture:**
- Message: "All workouts complete!" or similar congratulatory message
- "Generate New Plan" button visible and styled
- No workout view shown (replaced by completion message)
- Celebratory styling

**Status:** ⬜ Not Started / 🟡 In Progress / ✅ Complete

**Screenshot:**
```
[Insert screenshot or drag image file here]
```

---

## Screenshot: Theoretical 1RM on Account Page

**Location:** `/account` page, AccountOneRMSection component

**What to Capture:**
- Current 1RM values shown
- Theoretical 1RM values calculated from AMRAP data displayed separately
- Clear labels distinguishing current vs theoretical
- All four lifts shown: Squat, Bench, Deadlift, Overhead Press

**Example Display:**
```
Current 1RM: 250 lbs
Theoretical 1RM: 267 lbs (based on last AMRAP)
```

**Status:** ⬜ Not Started / 🟡 In Progress / ✅ Complete

**Screenshot:**
```
[Insert screenshot or drag image file here]
```

---

## Screenshot: Navigation Warning Dialog

**Location:** Browser dialog when user tries to navigate away from workout page

**Scenario:**
- User has marked some sets as complete
- AMRAP has NOT been recorded yet
- User clicks to navigate away (e.g., clicks "Home" link)

**What to Capture:**
- Browser beforeunload dialog or custom warning
- Message: "You have unsaved progress. Leave anyway?" or similar
- Stay/Leave buttons

**Status:** ⬜ Not Started / 🟡 In Progress / ✅ Complete

**Screenshot:**
```
[Insert screenshot or drag image file here]
```

---

## Test: Auto-Increment Logic

**Command:**
```bash
npm test lib/autoIncrementLogic.test.ts
```

**Expected Output:**
```
✓ increases 1RM by 10 lbs when AMRAP target met (lbs)
✓ increases 1RM by 5 kg when AMRAP target met (kg)
✓ keeps 1RM unchanged when AMRAP target missed
✓ handles mixed results (some lifts met, some missed)
✓ correctly determines target reps for each week
```

**Status:** ⬜ Not Started / 🟡 In Progress / ✅ Complete

**Actual Output:**
```
[Paste test output here]
```

---

## Database Query: Auto-Incremented 1RM Values

**Scenario:**
- User completed full program with these AMRAP results:
  - Week 3 Squat: 225 lbs × 7 reps (target: 1+, MET)
  - Week 3 Bench: 185 lbs × 1 rep (target: 1+, MET but barely)
  - Week 3 Deadlift: 275 lbs × 0 reps (target: 1+, MISSED)
  - Week 3 OHP: 115 lbs × 3 reps (target: 1+, MET)

**Query:**
```javascript
// After clicking "Generate New Plan" and saving
db.users.findOne(
  { email: "user@example.com" },
  { "oneRM": 1 }
)
```

**Expected Result:**
```json
{
  "oneRM": {
    "squat": 260,        // increased from 250 (met target)
    "bench": 195,        // increased from 185 (met target)
    "deadlift": 300,     // unchanged from 300 (missed target)
    "overheadPress": 125, // increased from 115 (met target)
    "units": "lbs"
  }
}
```

**Status:** ⬜ Not Started / 🟡 In Progress / ✅ Complete

**Actual Result:**
```
[Paste actual query result here]
```

---

## Test: Workout Navigation Logic

**Command:**
```bash
npm test lib/workoutNavigation.test.ts
```

**Expected Output:**
```
✓ finds first incomplete workout correctly
✓ returns null when all workouts complete
✓ handles partially complete weeks
✓ correctly checks all sets in all lifts
```

**Status:** ⬜ Not Started / 🟡 In Progress / ✅ Complete

**Actual Output:**
```
[Paste test output here]
```

---

## Notes

- Test auto-navigation with various completion states
- Verify beforeunload only fires when there's actual unsaved progress
- Test theoretical 1RM calculation with different AMRAP data points
- Ensure auto-increment only applies when generating new plan from completed workout
