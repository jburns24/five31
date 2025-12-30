# 05 Questions Round 1 - 1RM Workout Generator

Please answer each question below (select one or more options, or add your own notes). Feel free to add additional context under any question.

## 1. 1RM Data Entry & Validation

What validation and UX should apply when users enter their 1RM values?

- [x] (A) Require all four lifts (squat, bench, deadlift, overhead press) before enabling "Generate Workout"
- [ ] (B) Allow partial entry; generate workout with only the lifts that have values entered
- [x] (C) Add minimum/maximum weight validation (e.g., no negative numbers, reasonable upper bounds)
- [x] (D) Include unit selection (lbs vs kg) for the user
- [ ] (E) Other (describe)

**Additional notes:**

## 2. 1RM Card UI Behavior

How should the 1RM card display and handle existing data?

- [x] (A) Always show input fields, pre-filled with existing values if user has previously entered 1RM data
- [ ] (B) Show read-only display of current 1RM values with an "Edit" button to switch to input mode
- [ ] (C) Show a "Get Started" state if no 1RM data exists, then switch to read-only display after first entry
- [ ] (D) Allow users to update 1RM values anytime without confirmation (auto-save on change)
- [ ] (E) Other (describe)

**Additional notes:**

## 3. Workout Generation Logic

Which variant of the 5/3/1 program should the workout generator implement?

- [x] (A) Standard 4-week cycle (Week 1: 3×5, Week 2: 3×3, Week 3: 5/3/1, Week 4: Deload) as described in program-details.md
- [ ] (B) Beginner template with 3-day frequency
- [ ] (C) Standard 4-day template (one lift per day)
- [ ] (D) Include FSL (First Set Last) 5×5 accessory work
- [ ] (E) Other (describe)

**Additional notes:**

## 4. Workout Plan Data Model

What should the workout plan store and how should it be structured?

- [x] (A) Store full 4-week cycle with all sets/reps/weights pre-calculated
- [ ] (B) Store only the configuration (Training Max, template choice) and calculate on-demand
- [x] (C) Include progress tracking (completed sets, actual reps performed on AMRAP sets)
- [x] (D) Store rounding preference (round to smallest plate, round to 2.5lb/1kg, etc.)
- [ ] (E) Other (describe)

**Additional notes:**

## 5. Confirmation Dialog Details

What should the warning/confirmation say when user clicks "Generate Workout"?

- [ ] (A) Use the exact text: "Warning: Any unfinished workout cycle will be lost and a new one generated"
- [x] (B) Add more context about what happens (e.g., "This will create a new 4-week workout plan based on your 1RM values")
- [ ] (C) Include option to "Save current workout" before generating new one
- [ ] (D) Show preview of what will be generated (Training Max values, week 1 weights, etc.)
- [ ] (E) Other (describe)

**Additional notes:**

## 6. Workout Display & Access

After generating a workout, how should users access and view it?

- [x] (A) Redirect to a new `/workout` page showing the full plan
- [ ] (B) Show a success message with a link to view the workout
- [ ] (C) Expand the 1RM card to show a summary of the generated plan
- [ ] (D) Add a new card on the account page showing current workout status
- [ ] (E) Other (describe)

**Additional notes:**

## 7. Unit Testing Scope

What aspects of workout generation need unit tests?

- [ ] (A) Training Max calculation (TM = 0.90 × 1RM)
- [ ] (B) Working set percentage calculations for all weeks
- [ ] (C) Rounding logic for plate math
- [ ] (D) Full workout plan structure generation
- [x] (E) All of the above
- [ ] (F) Other (describe)

**Additional notes:**

## 8. Weight Units & Rounding

How should the system handle weight units and rounding?

- [x] (A) Default to pounds (lbs) with option to switch to kg in user preferences
- [ ] (B) Auto-detect based on user's locale/region
- [ ] (C) Round to nearest 5 lbs (or 2.5 kg) for simplicity
- [x] (D) Round to smallest available plate (2.5 lbs / 1.25 kg)
- [ ] (E) Other (describe)

**Additional notes:**

## 9. Overwriting Existing Workouts

What happens if a user already has an active workout plan?

- [ ] (A) Show the confirmation warning, then completely replace the old plan with new one
- [x] (B) Archive the old plan (keep in database with archived flag) before creating new one
- [ ] (C) Prevent generation if incomplete workout exists, force user to complete or manually delete first
- [ ] (D) Show "last updated" date on the 1RM card to indicate when current plan was generated
- [ ] (E) Other (describe)

**Additional notes:**

## 10. Proof Artifacts

What demonstrations will prove this feature works correctly?

- [ ] (A) Screenshot of 1RM card with inputs filled out
- [ ] (B) Screenshot of confirmation dialog before workout generation
- [ ] (C) Screenshot/URL of generated workout plan display
- [ ] (D) Test output showing unit tests passing for workout generation logic
- [ ] (E) Database query showing User model with 1RM data and WorkoutPlan model created
- [x] (F) All of the above
- [ ] (G) Other (describe)

**Additional notes:**
