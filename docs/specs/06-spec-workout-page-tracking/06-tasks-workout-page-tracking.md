# 06-tasks-workout-page-tracking.md

This task list breaks down the Workout Page Tracking feature into implementable units. Each parent task represents a demoable unit of work with clear proof artifacts.

## Relevant Files

- `models/WorkoutPlan.ts` - Extend IWorkoutSet interface with completion tracking fields
- `models/User.ts` - Add amrapHistory array for global AMRAP performance tracking
- `app/api/workout/complete-set/route.ts` - New API endpoint to mark sets as complete/incomplete
- `app/api/workout/record-amrap/route.ts` - New API endpoint to record AMRAP performance and check for PRs
- `components/DesktopNav.tsx` - Add "My Workout" navigation link
- `components/MobileNav.tsx` - Add "My Workout" navigation link
- `app/workout/page.tsx` - Major refactor: convert to client component with navigation state and single workout view
- `components/WorkoutNavigation.tsx` - New component for week dropdown, lift tabs, and prev/next arrows
- `components/SetRow.tsx` - New component for clickable set rows with completion state
- `components/AMRAPDialog.tsx` - New component for AMRAP recording dialog
- `components/PRNotification.tsx` - New component for displaying PR achievements
- `lib/prDetection.ts` - New utility for detecting rep PRs and 1RM PRs
- `lib/prDetection.test.ts` - Unit tests for PR detection logic
- `lib/oneRMCalculation.ts` - New utility for calculating theoretical 1RM using Epley formula
- `lib/oneRMCalculation.test.ts` - Unit tests for 1RM calculation
- `lib/autoIncrementLogic.ts` - New utility for auto-incrementing 1RM based on AMRAP performance
- `lib/autoIncrementLogic.test.ts` - Unit tests for auto-increment logic
- `lib/workoutNavigation.ts` - New utility for finding first incomplete workout
- `lib/workoutNavigation.test.ts` - Unit tests for navigation logic
- `app/account/page.tsx` - Update to display theoretical 1RM and handle auto-increment on new plan generation
- `app/globals.css` - Add styles for new components (navigation, set completion, dialogs, notifications)

### Notes

- Unit tests should be placed alongside the code files they are testing in the same directory
- Use the repository's established testing command: `npm test` or `npm test -- [path/to/test]`
- Follow TypeScript strict typing for all new code
- Server components for data fetching, client components (with 'use client') for interactivity
- Use Next.js API route pattern with `getServerSession(authOptions)` for authentication
- Follow BEM-style class naming in CSS (e.g., `.workout-navigation`, `.set-row--completed`)
- Use optimistic UI updates with error rollback for better UX

## Tasks

### [x] 1.0 Update Data Models for Workout Tracking

#### 1.0 Proof Artifact(s)

- Database query: WorkoutPlan document showing `completed: true` and `amrapRecorded: true` fields on sets demonstrates schema update
- Database query: User document showing `amrapHistory` array with sample entry demonstrates User model extension
- Test: `npm test` passes for all existing tests demonstrates no regressions

#### 1.0 Tasks

- [x] 1.1 Update `models/WorkoutPlan.ts` to extend IWorkoutSet interface with optional `completed?: boolean` and `amrapRecorded?: boolean` fields
- [x] 1.2 Update WorkoutSetSchema in `models/WorkoutPlan.ts` to include the new optional fields with default values
- [x] 1.3 Update `models/User.ts` to extend IUser interface with optional `amrapHistory` array field
- [x] 1.4 Create AMRAPHistorySchema in `models/User.ts` with fields: lift, weight, reps, units, date, workoutPlanId, weekNumber, notes
- [x] 1.5 Add amrapHistory field to UserSchema using the AMRAPHistorySchema
- [x] 1.6 Run existing tests with `npm test` to verify no regressions from schema changes
- [x] 1.7 Test database operations: create a WorkoutPlan with completed sets and verify fields persist correctly
- [x] 1.8 Test database operations: add an AMRAP entry to User.amrapHistory and verify it persists correctly

### [~] 2.0 Navigation Integration and Single Workout View

#### 2.0 Proof Artifact(s)

- Screenshot: Desktop navigation showing "My Workout" link demonstrates navigation integration
- Screenshot: Mobile navigation menu showing "My Workout" link demonstrates mobile integration
- Screenshot: Workout page showing single workout with week dropdown and lift tabs demonstrates focused view
- Screenshot: URL bar showing `/workout?week=2&lift=bench` demonstrates URL state management
- Video/Screenshot: Navigating between workouts using dropdowns and prev/next arrows demonstrates navigation controls

#### 2.0 Tasks

- [ ] 2.1 Add "My Workout" link to `components/DesktopNav.tsx` navigation items (only show when user is authenticated)
- [ ] 2.2 Add "My Workout" link to `components/MobileNav.tsx` navigation items (only show when user is authenticated)
- [ ] 2.3 Create `components/WorkoutNavigation.tsx` client component with props for current week/lift and onChange handlers
- [ ] 2.4 In WorkoutNavigation component, implement week dropdown selector (1-4) with current week highlighted
- [ ] 2.5 In WorkoutNavigation component, implement lift tabs (Squat, Bench Press, Deadlift, Overhead Press) with current lift highlighted
- [ ] 2.6 In WorkoutNavigation component, implement prev/next arrow buttons that cycle through workouts sequentially
- [ ] 2.7 Refactor `app/workout/page.tsx` to be a client component (add 'use client' directive)
- [ ] 2.8 In workout page, implement URL query param state management for `week` and `lift` using Next.js useSearchParams and useRouter
- [ ] 2.9 In workout page, fetch workout data and filter to show only the current week and lift based on URL params
- [ ] 2.10 In workout page, implement redirect to `/account` if user has no active workout plan
- [ ] 2.11 Add CSS styles to `app/globals.css` for WorkoutNavigation component (dropdowns, tabs, arrows, responsive layout)
- [ ] 2.12 Test navigation: verify all controls (dropdown, tabs, arrows) update URL params and display correct workout
- [ ] 2.13 Test mobile responsiveness: verify navigation stacks properly and touch targets are adequate

### [ ] 3.0 Set Completion Tracking with API Integration

#### 3.0 Proof Artifact(s)

- Screenshot: Set row with checkmark/strikethrough showing completion state demonstrates completion UI
- Video: Clicking set row to toggle completion with visual feedback demonstrates interaction
- Database query: WorkoutPlan showing specific sets with `completed: true` demonstrates persistence
- Screenshot: "Record AMRAP" button appearing when all sets complete demonstrates conditional display
- Test: API endpoint tests pass for `/api/workout/complete-set` demonstrates backend functionality
- Screenshot: Set cannot be unmarked after AMRAP recorded demonstrates state locking

#### 3.0 Tasks

- [ ] 3.1 Create `components/SetRow.tsx` client component with props: set data, completed state, onClick handler, disabled state
- [ ] 3.2 In SetRow component, implement visual states: normal, completed (with checkmark/strikethrough), disabled (when AMRAP recorded)
- [ ] 3.3 In SetRow component, add click handler that calls parent callback with set identification
- [ ] 3.4 Add CSS styles to `app/globals.css` for SetRow component (normal, completed, disabled, hover, AMRAP badge)
- [ ] 3.5 Create API route `app/api/workout/complete-set/route.ts` with POST handler
- [ ] 3.6 In complete-set API, authenticate user with getServerSession and validate request body (workoutPlanId, weekNumber, lift, setNumber, completed)
- [ ] 3.7 In complete-set API, verify user owns the WorkoutPlan before allowing modification
- [ ] 3.8 In complete-set API, update the specific set's `completed` field in the database using MongoDB update query
- [ ] 3.9 In complete-set API, check if AMRAP is already recorded for this workout and prevent unmarking if true
- [ ] 3.10 In complete-set API, return updated workout data or appropriate error response
- [ ] 3.11 Update `app/workout/page.tsx` to render SetRow components for each set in the current workout
- [ ] 3.12 In workout page, implement set click handler that calls complete-set API with optimistic UI update
- [ ] 3.13 In workout page, implement error rollback for failed API calls (revert optimistic update)
- [ ] 3.14 In workout page, implement logic to check if all sets are complete and last set is AMRAP
- [ ] 3.15 In workout page, conditionally render "Record AMRAP" button when conditions are met
- [ ] 3.16 Add loading states and disabled states while API calls are in progress
- [ ] 3.17 Test set completion: verify clicking toggles state, persists to DB, and updates UI
- [ ] 3.18 Test AMRAP button: verify it only appears when all sets complete and last is AMRAP
- [ ] 3.19 Test state locking: verify sets cannot be unmarked after AMRAP recorded

### [ ] 4.0 AMRAP Recording and PR Detection System

#### 4.0 Proof Artifact(s)

- Screenshot: AMRAP recording dialog with reps input and notes field demonstrates interface
- Screenshot: PR notification showing "Rep PR: +3 reps at 200 lbs! Previous: 5 reps on Nov 15" demonstrates rep PR detection
- Screenshot: PR notification showing "1RM PR: New theoretical 1RM of 225 lbs!" demonstrates 1RM PR detection
- Screenshot: Validation warning "Reps seem low - expected 5+, got 2" demonstrates input validation
- Database query: User model showing multiple AMRAP history entries demonstrates storage
- Test: `prDetection.test.ts` passes demonstrating both PR types work correctly
- Test: `oneRMCalculation.test.ts` passes demonstrating Epley formula implementation

#### 4.0 Tasks

- [ ] 4.1 Create `lib/oneRMCalculation.ts` with function to calculate theoretical 1RM using Epley formula: weight × (1 + reps/30)
- [ ] 4.2 Create `lib/oneRMCalculation.test.ts` with test cases for various weight/rep combinations
- [ ] 4.3 Create `lib/prDetection.ts` with functions to detect rep PRs (same weight, more reps) and 1RM PRs (higher calculated max)
- [ ] 4.4 In prDetection, implement function to compare current AMRAP to historical AMRAPs for the same lift
- [ ] 4.5 In prDetection, implement function to return PR type, improvement amount, and previous PR details
- [ ] 4.6 Create `lib/prDetection.test.ts` with test cases for both PR types and non-PR scenarios
- [ ] 4.7 Create `components/AMRAPDialog.tsx` client component with reps input, notes textarea, submit/cancel buttons
- [ ] 4.8 In AMRAPDialog, implement form validation: warn if reps < 50% of expected target
- [ ] 4.9 In AMRAPDialog, implement loading state during submission and disabled state after successful submit
- [ ] 4.10 Create `components/PRNotification.tsx` client component to display PR achievements with confetti emoji
- [ ] 4.11 In PRNotification, implement different display formats for rep PR vs 1RM PR
- [ ] 4.12 In PRNotification, show improvement details, previous PR date, and previous notes
- [ ] 4.13 Add CSS styles to `app/globals.css` for AMRAPDialog (modal overlay, form, buttons, validation warnings)
- [ ] 4.14 Add CSS styles to `app/globals.css` for PRNotification (celebratory styling, different PR types)
- [ ] 4.15 Create API route `app/api/workout/record-amrap/route.ts` with POST handler
- [ ] 4.16 In record-amrap API, authenticate user and validate request body (workoutPlanId, weekNumber, lift, reps, notes)
- [ ] 4.17 In record-amrap API, verify user owns the WorkoutPlan
- [ ] 4.18 In record-amrap API, get current workout details (weight, expected reps) from WorkoutPlan
- [ ] 4.19 In record-amrap API, fetch user's AMRAP history for this lift
- [ ] 4.20 In record-amrap API, use prDetection to check if this is a PR and get PR details
- [ ] 4.21 In record-amrap API, create new AMRAP history entry and add to User.amrapHistory array
- [ ] 4.22 In record-amrap API, mark the AMRAP set as `amrapRecorded: true` in WorkoutPlan
- [ ] 4.23 In record-amrap API, return success response with PR details (if applicable)
- [ ] 4.24 Update `app/workout/page.tsx` to show AMRAPDialog when "Record AMRAP" button is clicked
- [ ] 4.25 In workout page, handle AMRAP submission: call API, show PR notification if applicable, disable button
- [ ] 4.26 In workout page, display PRNotification component when API returns PR data
- [ ] 4.27 Run `npm test lib/oneRMCalculation.test.ts` and verify all tests pass
- [ ] 4.28 Run `npm test lib/prDetection.test.ts` and verify all tests pass
- [ ] 4.29 Test AMRAP recording: submit AMRAP, verify it saves to DB and cannot be re-submitted
- [ ] 4.30 Test PR detection: record AMRAP that beats previous performance and verify notification shows correctly

### [ ] 5.0 Auto-Navigation and Workout Progression

#### 5.0 Proof Artifact(s)

- Video: Page load jumping to Week 2, Workout 3 (first incomplete workout) demonstrates auto-navigation logic
- Screenshot: "All workouts complete!" message with "Generate New Plan" button demonstrates completion state
- Screenshot: Account page showing theoretical 1RM values calculated from AMRAP data demonstrates calculation display
- Screenshot: Navigation warning dialog "You have unsaved progress. Leave anyway?" demonstrates unsaved work protection
- Test: `autoIncrementLogic.test.ts` passes demonstrating selective 1RM progression (increase when target met, keep when missed)
- Database query: User oneRM values showing auto-incremented squat (met target) and unchanged bench (missed target) demonstrates progression logic

#### 5.0 Tasks

- [ ] 5.1 Create `lib/workoutNavigation.ts` with function to find first incomplete workout in a WorkoutPlan
- [ ] 5.2 In workoutNavigation, implement logic to iterate through weeks/lifts and find first set with `completed !== true`
- [ ] 5.3 In workoutNavigation, implement function to check if all workouts are complete
- [ ] 5.4 Create `lib/workoutNavigation.test.ts` with test cases for various completion scenarios
- [ ] 5.5 Create `lib/autoIncrementLogic.ts` with function to calculate new 1RM values based on AMRAP performance
- [ ] 5.6 In autoIncrementLogic, implement logic: if reps >= target, increase 1RM by 10 lbs (5 kg); otherwise keep current
- [ ] 5.7 In autoIncrementLogic, implement function to get AMRAP target reps for each week (Week 1: 5+, Week 2: 3+, Week 3: 1+, Week 4: 5+)
- [ ] 5.8 Create `lib/autoIncrementLogic.test.ts` with test cases for met targets, missed targets, and mixed scenarios
- [ ] 5.9 Update `app/workout/page.tsx` to call workoutNavigation on page load to find first incomplete workout
- [ ] 5.10 In workout page, update URL params to navigate to first incomplete workout automatically
- [ ] 5.11 In workout page, detect when all workouts are complete and show completion message instead of workout view
- [ ] 5.12 In workout page, add "Generate New Plan" button that navigates to `/account` when all workouts complete
- [ ] 5.13 In workout page, implement beforeunload event listener to warn if sets are marked but AMRAP not recorded
- [ ] 5.14 Update `app/account/page.tsx` to fetch user's AMRAP history from database
- [ ] 5.15 In account page, use oneRMCalculation to compute theoretical 1RM from latest AMRAP for each lift
- [ ] 5.16 In account page, display theoretical 1RM values alongside current 1RM values in AccountOneRMSection
- [ ] 5.17 In account page, detect if user is coming from completed workout plan (check query param or session)
- [ ] 5.18 In account page, if coming from completed plan, use autoIncrementLogic to calculate suggested new 1RM values
- [ ] 5.19 In account page, pre-populate 1RM form fields with auto-incremented values when generating new plan
- [ ] 5.20 Add CSS styles to `app/globals.css` for completion message, generate new plan button, navigation warning
- [ ] 5.21 Run `npm test lib/workoutNavigation.test.ts` and verify all tests pass
- [ ] 5.22 Run `npm test lib/autoIncrementLogic.test.ts` and verify all tests pass
- [ ] 5.23 Test auto-navigation: verify page loads with first incomplete workout displayed
- [ ] 5.24 Test completion state: verify all complete shows message and button
- [ ] 5.25 Test navigation warning: verify warning appears when leaving with unsaved progress
- [ ] 5.26 Test theoretical 1RM display: verify account page shows calculated values
- [ ] 5.27 Test auto-increment: complete full plan, generate new plan, verify 1RM values auto-incremented correctly
