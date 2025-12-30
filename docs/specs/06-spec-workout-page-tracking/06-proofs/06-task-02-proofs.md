# Task 2.0 Proof Artifacts - Navigation Integration and Single Workout View

## Screenshot: Desktop Navigation

**Location:** Desktop header navigation bar

**What to Capture:**
- Full header with navigation links visible
- "My Workout" link clearly visible between "Home" and "Profile" links
- User authenticated state shown

**Status:** ⬜ Not Started / 🟡 In Progress / ✅ Complete

**Screenshot:**
```
[Insert screenshot or drag image file here]
```

---

## Screenshot: Mobile Navigation

**Location:** Mobile hamburger menu (expanded)

**What to Capture:**
- Mobile menu open showing all navigation items
- "My Workout" link visible in menu
- User authenticated state shown

**Status:** ⬜ Not Started / 🟡 In Progress / ✅ Complete

**Screenshot:**
```
[Insert screenshot or drag image file here]
```

---

## Screenshot: Single Workout View with Navigation

**Location:** `/workout` page

**What to Capture:**
- Week dropdown showing current week (e.g., "Week 2")
- Lift tabs showing all 4 lifts with one active (e.g., "Squat" highlighted)
- Previous/Next arrow buttons visible
- Only one workout displayed (not all 4 weeks)
- Sets for the selected lift shown

**Status:** ⬜ Not Started / 🟡 In Progress / ✅ Complete

**Screenshot:**
```
[Insert screenshot or drag image file here]
```

---

## Screenshot: URL State Management

**Location:** Browser URL bar while on workout page

**What to Capture:**
- URL showing query parameters: `/workout?week=2&lift=bench`
- Corresponding workout displayed on page matching the URL params

**Status:** ⬜ Not Started / 🟡 In Progress / ✅ Complete

**Screenshot:**
```
[Insert screenshot or drag image file here]
```

---

## Video/Screenshot: Navigation Controls

**Interaction to Demonstrate:**
1. Change week dropdown from Week 1 to Week 2 → URL updates, workout changes
2. Click Bench Press tab → URL updates to `&lift=bench`, shows bench workout
3. Click Next arrow → Cycles to next workout (Deadlift)
4. Click Previous arrow → Goes back to Bench Press

**Status:** ⬜ Not Started / 🟡 In Progress / ✅ Complete

**Video/Screenshots:**
```
[Insert video link or series of screenshots demonstrating the navigation flow]
```

---

## Notes

- Verify navigation only shows for authenticated users
- Test redirect to `/account` when no active workout plan exists
- Ensure mobile responsiveness (navigation stacks properly)
