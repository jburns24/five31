# Task 3.0 Proof Artifacts - Set Completion Tracking with API Integration

## Screenshot: Set Row Completion UI

**Location:** `/workout` page showing a workout with sets

**What to Capture:**
- At least 3 sets visible showing different states:
  - Uncompleted set (normal appearance)
  - Completed set (with checkmark, strikethrough, or different background)
  - AMRAP set with "+" badge
- Clear visual distinction between completed and uncompleted states

**Status:** ⬜ Not Started / 🟡 In Progress / ✅ Complete

**Screenshot:**
```
[Insert screenshot or drag image file here]
```

---

## Video: Set Completion Interaction

**Interaction to Demonstrate:**
1. Click on an uncompleted set row → Visual feedback (animation, color change)
2. Set becomes completed (checkmark appears, strikethrough, etc.)
3. Click same set again → Toggles back to uncompleted
4. Complete all sets → "Record AMRAP" button appears

**Status:** ⬜ Not Started / 🟡 In Progress / ✅ Complete

**Video/Screenshots:**
```
[Insert video link or series of screenshots showing the toggle interaction]
```

---

## Database Query: Set Persistence

**Query:**
```javascript
// Query to show completed sets in database
db.workoutplans.findOne(
  { userId: ObjectId("...") },
  { "weeklyWorkouts.lifts.sets": 1 }
)
```

**Expected Result:**
```json
{
  "weeklyWorkouts": [
    {
      "lifts": [
        {
          "lift": "squat",
          "sets": [
            { "setNumber": 1, "weight": 180, "reps": 5, "completed": true },
            { "setNumber": 2, "weight": 200, "reps": 5, "completed": true },
            { "setNumber": 3, "weight": 225, "reps": 5, "completed": false }
          ]
        }
      ]
    }
  ]
}
```

**Status:** ⬜ Not Started / 🟡 In Progress / ✅ Complete

**Actual Result:**
```
[Paste actual query result here]
```

---

## Screenshot: Record AMRAP Button

**Location:** `/workout` page after completing all sets

**What to Capture:**
- All sets shown as completed
- "Record AMRAP" button visible and enabled
- Last set showing AMRAP badge "+"

**Status:** ⬜ Not Started / 🟡 In Progress / ✅ Complete

**Screenshot:**
```
[Insert screenshot or drag image file here]
```

---

## Test: API Endpoint Functionality

**Command:**
```bash
npm test app/api/workout/complete-set
```

**Expected Output:**
```
✓ should authenticate user
✓ should validate request body
✓ should verify user owns workout plan
✓ should update set completion state
✓ should prevent unmarking after AMRAP recorded
✓ should return updated workout data
```

**Status:** ⬜ Not Started / 🟡 In Progress / ✅ Complete

**Actual Output:**
```
[Paste test output here]
```

---

## Screenshot: State Locking

**Location:** `/workout` page with AMRAP already recorded

**What to Capture:**
- Sets showing completed state
- Sets appear disabled (grayed out, no hover effect)
- Clicking does not toggle completion
- "Record AMRAP" button disabled or hidden

**Status:** ⬜ Not Started / 🟡 In Progress / ✅ Complete

**Screenshot:**
```
[Insert screenshot or drag image file here]
```

---

## Notes

- Test optimistic UI updates with network throttling
- Verify error rollback if API call fails
- Ensure loading states prevent double-clicks
