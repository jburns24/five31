# 05-tasks-1rm-workout-generator.md

## Relevant Files

### Files to Create

- `lib/workoutCalculator.ts` - Core 5/3/1 calculation logic (Training Max, percentages, rounding, workout generation)
- `lib/workoutCalculator.test.ts` - Comprehensive unit tests for all calculation functions
- `models/WorkoutPlan.ts` - Mongoose model for storing generated workout plans
- `components/OneRMCard.tsx` - Form component for 1RM data entry on account page
- `components/ConfirmDialog.tsx` - Reusable confirmation dialog component
- `app/api/workout/generate/route.ts` - API endpoint for workout plan generation
- `app/workout/page.tsx` - Protected page displaying generated workout plans

### Files to Modify

- `package.json` - Add Jest or Vitest testing framework and related dependencies
- `jest.config.js` or `vitest.config.ts` - Testing framework configuration
- `models/User.ts` - Extend IUser interface and UserSchema with 1RM fields
- `app/account/page.tsx` - Import and render OneRMCard component
- `app/globals.css` - Add styles for 1RM card, confirmation dialog, and workout display page

### Notes

- Unit tests should be placed alongside the code files they are testing (e.g., `workoutCalculator.ts` and `workoutCalculator.test.ts` in the same directory)
- Use the repository's established testing command (e.g., `npm test` or `npm run test`)
- Follow existing TypeScript patterns from `models/User.ts` for the WorkoutPlan model
- Follow existing server component patterns from `app/account/page.tsx` for authentication and data fetching
- Follow existing CSS class naming patterns from `globals.css` for styling
- All new components should use TypeScript with proper type definitions
- API routes should follow Next.js 14 App Router conventions (route.ts with named exports)

## Tasks

### [x] 1.0 Setup Testing Infrastructure and Workout Calculation Engine

**Purpose:** Establish the testing framework and implement the core 5/3/1 calculation logic as pure, testable functions.

#### 1.0 Proof Artifact(s)

- Test output: `npm test` or `npm run test` command successfully runs and shows test suite results demonstrates testing framework is configured
- Test output: `lib/workoutCalculator.test.ts` passes all tests for `calculateTrainingMax()` demonstrates TM calculation accuracy (0.90 × 1RM)
- Test output: `lib/workoutCalculator.test.ts` passes all tests for `roundToPlate()` demonstrates weight rounding to smallest plate (2.5 lbs / 1.25 kg)
- Test output: `lib/workoutCalculator.test.ts` passes all tests for `generateWeek()` demonstrates correct percentage calculations for all 4 weeks
- Test output: `lib/workoutCalculator.test.ts` passes all tests for `generateWorkoutPlan()` demonstrates complete 4-week plan generation with all lifts
- Code: `lib/workoutCalculator.ts` exports all calculation functions demonstrates implementation completeness

#### 1.0 Tasks

- [x] 1.1 Install and configure testing framework (Jest or Vitest) in package.json with TypeScript support
- [x] 1.2 Create testing configuration file (jest.config.js or vitest.config.ts) with path aliases matching tsconfig.json
- [x] 1.3 Create `lib/workoutCalculator.ts` with TypeScript interfaces for workout data structures (Lift, Set, Week, WorkoutPlan)
- [x] 1.4 Implement `calculateTrainingMax(oneRM: number): number` function that returns 90% of 1RM
- [x] 1.5 Write unit tests for `calculateTrainingMax()` covering edge cases (zero, negative, decimal values, large numbers)
- [x] 1.6 Implement `roundToPlate(weight: number, units: 'lbs' | 'kg'): number` function that rounds to 2.5 lbs or 1.25 kg increments
- [x] 1.7 Write unit tests for `roundToPlate()` covering various weights and both unit systems
- [x] 1.8 Implement `generateWeek(trainingMax: number, weekNumber: 1 | 2 | 3 | 4, units: 'lbs' | 'kg'): Set[]` function with correct percentages for each week
- [x] 1.9 Write unit tests for `generateWeek()` verifying Week 1 (65%/75%/85%), Week 2 (70%/80%/90%), Week 3 (75%/85%/95%), Week 4 (40%/50%/60%)
- [x] 1.10 Implement `generateWorkoutPlan(oneRMs: { squat, bench, deadlift, overheadPress }, units, roundingPreference): WorkoutPlanData` function that generates complete 4-week plan for all four lifts
- [x] 1.11 Write unit tests for `generateWorkoutPlan()` verifying structure includes all lifts, all weeks, and correct calculations
- [x] 1.12 Run test suite and verify all tests pass

### [x] 2.0 Extend User Model and Create WorkoutPlan Model

**Purpose:** Implement the database schemas needed to store 1RM data and generated workout plans.

#### 2.0 Proof Artifact(s)

- Code: `models/User.ts` shows 1RM fields (squat, bench, deadlift, overheadPress, units, roundingPreference) demonstrates User model extension
- Code: `models/WorkoutPlan.ts` shows complete schema with workoutId, userId, dateCreated, lastUpdated, isArchived, units, trainingMaxValues, weeklyWorkouts demonstrates WorkoutPlan model implementation
- Database query: `db.users.findOne()` showing document with 1RM fields populated demonstrates schema migration successful
- Database query: `db.workoutplans.findOne()` showing complete 4-week workout structure demonstrates WorkoutPlan model stores data correctly
- Test output: Model validation tests pass demonstrates schema constraints work correctly

#### 2.0 Tasks

- [x] 2.1 Update `models/User.ts` IUser interface to include optional 1RM fields: `oneRM?: { squat?: number, bench?: number, deadlift?: number, overheadPress?: number, units?: 'lbs' | 'kg', roundingPreference?: 'plate' | '2.5' }`
- [x] 2.2 Update `models/User.ts` UserSchema to include 1RM fields with appropriate validation (positive numbers, reasonable bounds)
- [x] 2.3 Test User model extension by creating/updating a user document with 1RM data via MongoDB shell or script
- [x] 2.4 Create `models/WorkoutPlan.ts` with IWorkoutPlan interface extending Document
- [x] 2.5 Define WorkoutPlan schema fields: userId (ObjectId ref to User), dateCreated, lastUpdated, isArchived (boolean, default false), units, roundingPreference
- [x] 2.6 Define nested schema structures for trainingMaxValues (object with squat/bench/deadlift/overheadPress) and weeklyWorkouts (array of weeks, each containing array of lifts with sets)
- [x] 2.7 Add schema indexes on userId and isArchived for efficient queries
- [x] 2.8 Add schema validation: userId required, dates auto-managed with timestamps, units enum validation
- [x] 2.9 Export WorkoutPlan model following the pattern from User.ts (prevent recompilation in Next.js hot reload)
- [x] 2.10 Create test script or use MongoDB shell to verify WorkoutPlan model can save and retrieve complete 4-week workout data
- [x] 2.11 Verify database queries work: find active plan by userId (`isArchived: false`), archive old plans (update `isArchived: true`)

### [x] 3.0 Implement 1RM Tracker Card on Account Page

**Purpose:** Create the UI for users to input their 1RM values with validation and persistence.

#### 3.0 Proof Artifact(s)

- Screenshot: `/account` page showing "1RM Tracker" card with four lift input fields and unit selector (lbs/kg) demonstrates UI implementation
- Screenshot: Validation error messages when entering invalid values (negative, zero, empty, or out-of-bounds) demonstrates client-side validation
- Screenshot: Pre-filled inputs showing previously saved 1RM data after page reload demonstrates data persistence
- Screenshot: "Generate Workout" button disabled state when validation fails demonstrates button enable/disable logic
- Code: `components/OneRMCard.tsx` (or similar) shows form implementation demonstrates component structure
- Code: `app/account/page.tsx` includes 1RM card component demonstrates integration

#### 3.0 Tasks

- [x] 3.1 Create `components/OneRMCard.tsx` as a client component ('use client' directive) with TypeScript
- [x] 3.2 Define component state for form inputs: squat, bench, deadlift, overheadPress (all numbers), units ('lbs' | 'kg'), and validation errors
- [x] 3.3 Implement input fields for all four lifts with labels and number input type
- [x] 3.4 Implement unit selector (radio buttons or dropdown) for lbs/kg with default to 'lbs'
- [x] 3.5 Implement client-side validation: check all fields filled, values > 0, values within reasonable bounds (1-2000 lbs or 1-900 kg)
- [x] 3.6 Display inline validation error messages for invalid inputs
- [x] 3.7 Implement "Generate Workout" button with disabled state when validation fails
- [x] 3.8 Add useEffect hook to pre-fill form inputs with user's existing 1RM data (passed as props from parent)
- [x] 3.9 Add CSS classes following globals.css patterns (card styling, form inputs, buttons)
- [x] 3.10 Update `app/account/page.tsx` to fetch user's 1RM data from database (user.oneRM)
- [x] 3.11 Import and render OneRMCard component in account page, passing user's 1RM data as props
- [x] 3.12 Add CSS styles to `app/globals.css` for 1RM card, form inputs, validation errors, and button states
- [x] 3.13 Test UI: verify card displays on /account page, inputs work, validation shows errors, button enables/disables correctly
- [x] 3.14 Test persistence: enter 1RM values, refresh page, verify values are pre-filled from database

### [x] 4.0 Build Workout Generation API and User Flow

**Purpose:** Implement the server-side API endpoint for workout generation with confirmation dialog and archival logic.

#### 4.0 Proof Artifact(s)

- Screenshot: Confirmation dialog with message "This will create a new 4-week workout plan based on your 1RM values. Any unfinished workout cycle will be archived and a new one generated. Continue?" demonstrates warning implementation
- Video/Screenshot sequence: Complete flow from "Generate Workout" → confirmation → API call → redirect to `/workout` demonstrates end-to-end user experience
- Code: `app/api/workout/generate/route.ts` shows POST handler with session validation demonstrates API implementation
- Database query: Before/after showing old WorkoutPlan with `isArchived: true` and new plan with `isArchived: false` demonstrates archival logic
- Test output: API route returns 401 for unauthenticated requests demonstrates authorization works
- Browser console: Network tab showing successful POST to `/api/workout/generate` with 200 response demonstrates API integration

#### 4.0 Tasks

- [x] 4.1 Create `components/ConfirmDialog.tsx` client component with props: isOpen, title, message, onConfirm, onCancel
- [x] 4.2 Implement dialog UI with modal overlay, message display, and Cancel/Confirm buttons
- [x] 4.3 Add CSS styling for dialog (modal overlay, dialog box, button styles) to globals.css
- [x] 4.4 Update `components/OneRMCard.tsx` to add state for dialog visibility and onClick handler for "Generate Workout" button
- [x] 4.5 Add ConfirmDialog component to OneRMCard with message: "This will create a new 4-week workout plan based on your 1RM values. Any unfinished workout cycle will be archived and a new one generated. Continue?"
- [x] 4.6 Create `app/api/workout/generate/route.ts` with POST handler
- [x] 4.7 Add session validation in API route using `getServerSession(authOptions)`, return 401 if not authenticated
- [x] 4.8 Add request body validation: verify 1RM values for all four lifts, units, and roundingPreference are provided and valid
- [x] 4.9 Connect to database using `connectDB()` from lib/mongodb
- [x] 4.10 Update User model with submitted 1RM values using `User.findOneAndUpdate({ email: session.user.email })`
- [x] 4.11 Archive existing active WorkoutPlans for the user: `WorkoutPlan.updateMany({ userId, isArchived: false }, { isArchived: true })`
- [x] 4.12 Import and call `generateWorkoutPlan()` from lib/workoutCalculator with user's 1RM values
- [x] 4.13 Create new WorkoutPlan document with generated data and save to database
- [x] 4.14 Return success response with workout plan ID
- [x] 4.15 Add error handling: return 400 for validation errors, 500 for server errors with appropriate error messages
- [x] 4.16 Update OneRMCard onConfirm handler to call API endpoint with fetch POST request
- [x] 4.17 Handle API response: on success, redirect to `/workout` using Next.js router; on error, display error message to user
- [x] 4.18 Test complete flow: click Generate Workout → see dialog → confirm → verify API called → verify redirect to /workout → verify database shows archived old plan and new active plan

### [ ] 5.0 Create Workout Display Page

**Purpose:** Build the protected `/workout` route that displays the generated 4-week plan with calculated weights.

#### 5.0 Proof Artifact(s)

- Screenshot: `/workout` page URL showing complete 4-week plan organized by weeks demonstrates page implementation
- Screenshot: Week 1 section showing all four lifts with sets (65%/75%/85% of TM) demonstrates correct weight calculations and display
- Screenshot: Week 2 section showing 70%/80%/90% progression demonstrates Week 2 rendering
- Screenshot: Week 3 section showing 75%/85%/95% progression demonstrates Week 3 rendering
- Screenshot: Week 4 (Deload) section showing 40%/50%/60% progression demonstrates deload week rendering
- Screenshot: Training Max values displayed in summary section demonstrates TM reference display
- Screenshot: "No active workout plan" message for user without generated plan demonstrates empty state handling
- Code: `app/workout/page.tsx` shows protected route with session check demonstrates authentication protection

#### 5.0 Tasks

- [ ] 5.1 Create `app/workout/page.tsx` as a server component with TypeScript
- [ ] 5.2 Add session validation using `getServerSession(authOptions)`, redirect to '/' if not authenticated
- [ ] 5.3 Connect to database and fetch user's active workout plan: `WorkoutPlan.findOne({ userId: user._id, isArchived: false }).sort({ dateCreated: -1 })`
- [ ] 5.4 Handle empty state: if no active workout plan found, display "No active workout plan" message with link back to /account
- [ ] 5.5 Create TypeScript interfaces/types for rendering workout data (Week, Lift, Set)
- [ ] 5.6 Implement UI layout with Training Max summary section at top showing TM values for all four lifts
- [ ] 5.7 Implement Week 1 section displaying all four lifts with sets showing weight × reps (e.g., "Squat Set 1: 185 lbs × 5")
- [ ] 5.8 Implement Week 2 section with same structure as Week 1
- [ ] 5.9 Implement Week 3 section with same structure as Week 1
- [ ] 5.10 Implement Week 4 (Deload) section with same structure, optionally styled differently to indicate deload
- [ ] 5.11 Add plan creation date display
- [ ] 5.12 Add navigation link/button back to /account page
- [ ] 5.13 Add CSS styles to globals.css for workout page layout, week sections, lift cards/tables, set displays
- [ ] 5.14 Test with generated workout: verify all weeks display correctly, weights match calculations, units shown properly
- [ ] 5.15 Test empty state: verify "No active workout plan" message shows for user without plan
- [ ] 5.16 Test authentication: verify redirect to home page when not logged in
