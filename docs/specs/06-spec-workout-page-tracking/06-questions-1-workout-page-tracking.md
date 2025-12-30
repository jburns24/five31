# 06 Questions Round 1 - Workout Page Tracking

Please answer each question below (select one or more options, or add your own notes). Feel free to add additional context under any question.

## 1. Workout and Week Navigation

How should users navigate between different workouts and weeks?

- [ ] (A) Dropdown selectors at the top (Week selector + Workout selector within that week)
- [x (B) Previous/Next arrow buttons to step through workouts sequentially
- [ ] (C) Tab-style navigation showing all 4 workouts in the week with the current one expanded
- [x] (D) Combined approach: Week dropdown (1-4) + Workout tabs (Squat/Bench/Deadlift/OHP) within each week
- [ ] (E) Other (describe)

Additional notes:

## 2. Set Completion Interaction

How should marking a set as "done" work visually and functionally?

- [x] (A) Click anywhere on the set row to toggle done/not done
- [ ] (B) Checkbox on each set row
- [ ] (C) Tap/click on the set number or weight value to mark complete
- [ ] (D) Dedicated "Mark Complete" button on each set
- [] (E) Other (describe)

Should users be able to unmark a set as "done" after marking it?
- [ ] (A) Yes, users can freely toggle sets on/off
- [ ] (B) No, once marked done it stays done
- [x] (C) Only if the workout isn't finished yet (AMRAP not recorded)

Additional notes:

## 3. AMRAP Recording Interface

When the "Record AMRAP" button appears, what information should the user provide?

- [] (A) Only the number of reps achieved (weight is already known from the workout)
- [ ] (B) Both weight and reps (in case they used a different weight)
- [ ] (C) Weight, reps, and optional notes
- [x] (D) Other (describe): number of reps, optional notes

Should there be any validation or warnings?
- [x] (A) Warn if reps are significantly lower than expected
- [ ] (B) Warn if weight differs from prescribed weight
- [ ] (C) No warnings, accept any input
- [ ] (D) Other (describe)

Additional notes:

## 4. PR (Personal Record) Detection and Display

When should PR notifications be shown to the user?

- [x] (A) Immediately after recording AMRAP if it's a PR
- [ ] (B) When viewing the workout page (banner or notification)
- [x] (C) On the account/profile page showing recent PRs
- [ ] (D) All of the above
- [ ] (E) Other (describe)

What information should be shown in a PR notification?
- [ ] (A) "New PR! You did [X] reps at [Y] lbs, previous was [Z] reps"
- [ ] (B) Show the improvement: "+2 reps" or "10% improvement"
- [ ] (C) Show both absolute numbers and improvement
- [x] (D) Other (describe): Snow the improvement, when the previous PR was set, and any notes the user added last time

Additional notes:

## 5. Theoretical 1RM Storage and Display

Where should the theoretical 1RM be calculated and stored?

- [ ] (A) Calculated when AMRAP is recorded and stored in User model
- [x] (B) Calculated on-demand when viewing profile/account page
- [ ] (C) Stored in a separate WorkoutHistory or Progress model
- [ ] (D) Other (describe)

Should the theoretical 1RM be displayed on the workout page?
- [ ] (A) Yes, show after recording AMRAP
- [x] (B) Only on account/profile page
- [ ] (C) Show in both places
- [ ] (D) Other (describe)

Additional notes:

## 6. Data Model and Persistence

How should workout completion data be stored?

- [x] (A) Add completion tracking directly to the WorkoutPlan model (add `completed: boolean` to each set)
- [ ] (B) Create a separate WorkoutProgress model that references the WorkoutPlan
- [ ] (C) Store completion data in the User model with references to specific sets
- [ ] (D) Hybrid: completion in WorkoutPlan, AMRAP history in User model
- [ ] (E) Other (describe)

Should AMRAP records be stored per workout plan or globally across all plans?
- [ ] (A) Per workout plan (so each cycle tracks its own AMRAPs)
- [ ] (B) Globally (all-time history of AMRAP performance for PR tracking)
- [ ] (C) Both (link to specific plan but also maintain global history)

Additional notes:

## 7. Auto-Navigation to Incomplete Workout

What should happen when a user loads the workout page?

- [x] (A) Jump to the first workout that has any incomplete sets
- [ ] (B) Jump to the first completely unstarted workout
- [ ] (C) Remember their last viewed workout and return to it
- [ ] (D) Start at Week 1, Workout 1 always (user navigates manually)
- [ ] (E) Other (describe)

If all workouts are complete, where should it navigate?
- [ ] (A) Show Week 1, Workout 1
- [ ] (B) Show the last completed workout
- [ ] (C) Show a "All workouts complete!" message with option to archive plan
- [x] (D) Other (describe): Show "All workouts complete!" message with a button to generate a new plan. Clicking this button should take the user to the account page where their previous 1RM values are auto-incremented if they met or exceeded the AMRAP targets for the given lift.(For example, if their AMRAP target for Squat was 5 reps at 200 lbs and they did 6 reps, their new 1RM should be calculated based on 200 lbs + 10 lbs = 210 lbs for the next plan. If in that same workout plan they did not meet the target for Bench Press, their 1RM for Bench should remain unchanged when generating the new plan.)

Additional notes:

## 8. Mobile vs Desktop Experience

Should the mobile and desktop experiences differ?

- [ ] (A) Identical experience on both
- [x] (B) Desktop shows more details (like week overview), mobile is simplified
- [ ] (C) Desktop can show side-by-side comparisons, mobile shows one workout at a time
- [ ] (D) Other (describe)

Additional notes:

## 9. Navigation Link Label

What should the workout page link be called in the navigation bars?

- [ ] (A) "Workout"
- [x] (B) "My Workout"
- [ ] (C) "Active Plan"
- [ ] (D) "Training"
- [ ] (E) Other (describe)

Additional notes:

## 10. Edge Cases and Error Handling

What should happen in these scenarios?

**If user doesn't have an active workout plan:**
- [ ] (A) Show existing empty state (as currently implemented)
- [ ] (B) Show empty state with option to generate plan directly from workout page
- [x] (C) Redirect to account page
- [ ] (D) Other (describe)

**If user tries to record AMRAP twice:**
- [ ] (A) Show error message, don't allow
- [ ] (B) Allow but warn that previous record will be lost
- [x] (C) This is prevented by disabling the button after first submission
- [ ] (D) Other (describe)

**If user navigates away mid-workout:**
- [ ] (A) All completed sets are saved automatically (no loss of data)
- [x] (B) Warn user before navigating if sets are marked but AMRAP not recorded
- [ ] (C) No special handling needed
- [ ] (D) Other (describe)

Additional notes:
