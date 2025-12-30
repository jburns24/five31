# Task 4.0 Proof Artifacts - AMRAP Recording and PR Detection System

## Screenshot: AMRAP Recording Dialog

**Location:** Dialog/modal that appears when "Record AMRAP" is clicked

**What to Capture:**
- Dialog title indicating AMRAP recording
- Reps input field (number input)
- Notes textarea (optional field)
- Submit and Cancel buttons
- Current set details visible (weight, expected reps)

**Status:** ⬜ Not Started / 🟡 In Progress / ✅ Complete

**Screenshot:**
```
[Insert screenshot or drag image file here]
```

---

## Screenshot: Rep PR Notification

**Location:** Notification appearing after AMRAP submission that is a rep PR

**What to Capture:**
- PR notification with celebratory styling (emoji, highlight color)
- Message format: "Rep PR: +3 reps at 200 lbs!"
- Previous PR details: "Previous: 5 reps on Nov 15, 2025"
- Previous notes displayed (if any)

**Status:** ⬜ Not Started / 🟡 In Progress / ✅ Complete

**Screenshot:**
```
[Insert screenshot or drag image file here]
```

---

## Screenshot: 1RM PR Notification

**Location:** Notification appearing after AMRAP submission that results in higher calculated 1RM

**What to Capture:**
- PR notification with celebratory styling
- Message format: "1RM PR: New theoretical 1RM of 225 lbs!"
- Calculated 1RM shown
- Improvement details

**Status:** ⬜ Not Started / 🟡 In Progress / ✅ Complete

**Screenshot:**
```
[Insert screenshot or drag image file here]
```

---

## Screenshot: Validation Warning

**Location:** AMRAP dialog with low rep input

**What to Capture:**
- Reps input showing value significantly below target (e.g., 2 when target is 5+)
- Warning message: "Reps seem low - expected 5+, got 2. Continue anyway?"
- Warning styling (yellow/orange color, icon)

**Status:** ⬜ Not Started / 🟡 In Progress / ✅ Complete

**Screenshot:**
```
[Insert screenshot or drag image file here]
```

---

## Database Query: AMRAP History

**Query:**
```javascript
// Query to show multiple AMRAP entries in user history
db.users.findOne(
  { email: "user@example.com" },
  { amrapHistory: 1 }
)
```

**Expected Result:**
```json
{
  "amrapHistory": [
    {
      "lift": "squat",
      "weight": 200,
      "reps": 5,
      "units": "lbs",
      "date": "2025-11-15T12:00:00.000Z",
      "workoutPlanId": "...",
      "weekNumber": 3,
      "notes": "First cycle"
    },
    {
      "lift": "squat",
      "weight": 200,
      "reps": 8,
      "units": "lbs",
      "date": "2025-12-30T12:00:00.000Z",
      "workoutPlanId": "...",
      "weekNumber": 3,
      "notes": "Beat previous PR!"
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

## Test: PR Detection Logic

**Command:**
```bash
npm test lib/prDetection.test.ts
```

**Expected Output:**
```
✓ detects rep PR (same weight, more reps)
✓ detects 1RM PR (different weight, higher calculated 1RM)
✓ returns null when not a PR
✓ correctly calculates improvement amount
✓ includes previous PR date and notes
```

**Status:** ⬜ Not Started / 🟡 In Progress / ✅ Complete

**Actual Output:**
```
[Paste test output here]
```

---

## Test: 1RM Calculation

**Command:**
```bash
npm test lib/oneRMCalculation.test.ts
```

**Expected Output:**
```
✓ calculates 1RM using Epley formula: weight × (1 + reps/30)
✓ handles various weight/rep combinations
✓ returns accurate results for edge cases
```

**Status:** ⬜ Not Started / 🟡 In Progress / ✅ Complete

**Actual Output:**
```
[Paste test output here]
```

---

## Notes

- Redact user email in database queries
- Test both PR types with actual AMRAP submissions
- Verify AMRAP button disables after first submission (no duplicates)
- Ensure notes field supports special characters and appropriate length
