# 05-spec-1rm-workout-generator.md

## Introduction/Overview

This specification defines a 1RM (One Rep Max) workout generator feature that allows authenticated users to input their maximum lifts for the four main compound exercises and generate a complete 4-week workout plan based on Jim Wendler's 5/3/1 program. The feature extends the existing account page with a new card for 1RM entry and creates a dedicated workout plan page to display the generated program.

## Goals

- Enable users to track their one-rep max (1RM) values for the big four lifts: squat, bench press, deadlift, and overhead press
- Generate a personalized 4-week workout plan using the 5/3/1 methodology with Training Max calculations
- Provide a clear workflow from 1RM entry to workout generation with proper user confirmations
- Establish a data foundation for future workout tracking and progress monitoring features
- Implement comprehensive unit tests for all workout calculation logic to ensure accuracy

## User Stories

- **As a strength athlete**, I want to enter my current 1RM values for the big four lifts so that I can generate a scientifically-backed workout program tailored to my strength levels.
- **As a user with an active workout plan**, I want to be warned before generating a new plan so that I don't accidentally lose my current progress.
- **As a lifter who uses different equipment**, I want to choose between pounds and kilograms so that the workout matches my gym's equipment.
- **As a user new to 5/3/1**, I want my workout weights automatically calculated and rounded appropriately so that I can load the bar correctly without doing math.
- **As a user returning to the app**, I want my previous 1RM values to be saved so that I can easily update them or generate a new plan without re-entering everything.

## Demoable Units of Work

### Unit 1: 1RM Data Entry Card

**Purpose:** Allows users to input and persist their one-rep max values, providing the foundation for workout plan generation.

**Functional Requirements:**
- The system shall display a "1RM Tracker" card on the `/account` page for authenticated users
- The system shall provide input fields for all four lifts: squat, bench press, deadlift, and overhead press
- The system shall provide a unit selector (lbs/kg) that defaults to pounds
- The system shall validate that all four 1RM values are entered before enabling the "Generate Workout" button
- The system shall validate that entered values are positive numbers with reasonable bounds (minimum: 1, maximum: 2000 lbs or 900 kg)
- The system shall pre-fill input fields with existing 1RM data if user has previously saved values
- The user shall be able to update 1RM values at any time
- The system shall extend the User model schema to store 1RM data (squat, bench, deadlift, overheadPress, units, roundingPreference)

**Proof Artifacts:**
- Screenshot: 1RM card on `/account` page with all four input fields demonstrates UI implementation
- Screenshot: Validation errors when entering invalid data (negative, zero, or missing values) demonstrates validation logic
- Screenshot: Pre-filled inputs showing previously saved 1RM data demonstrates data persistence
- Database query: User document showing 1RM fields populated demonstrates schema extension

### Unit 2: Workout Generation Logic & Data Model

**Purpose:** Implements the core 5/3/1 calculation engine and creates the WorkoutPlan data model to store generated programs.

**Functional Requirements:**
- The system shall create a new WorkoutPlan Mongoose model with fields: workoutId (UUID), userId (reference), dateCreated, lastUpdated, isArchived, units, roundingPreference, trainingMaxValues (object), weeklyWorkouts (array)
- The system shall calculate Training Max (TM) as 90% of each entered 1RM value
- The system shall generate a complete 4-week cycle following the standard 5/3/1 progression: Week 1 (3×5 at 65%/75%/85%), Week 2 (3×3 at 70%/80%/90%), Week 3 (5/3/1 at 75%/85%/95%), Week 4 (Deload at 40%/50%/60%)
- The system shall calculate working set weights as percentages of Training Max
- The system shall round all calculated weights to the smallest available plate increment (2.5 lbs or 1.25 kg)
- The system shall store the complete 4-week plan with all sets, reps, and weights pre-calculated
- The system shall archive existing workout plans (set isArchived: true) before creating a new one
- The system shall provide fields for progress tracking: completedSets array, amrapReps (for tracking actual reps on + sets)

**Proof Artifacts:**
- Test output: Unit tests passing for Training Max calculation (TM = 0.90 × 1RM) demonstrates calculation accuracy
- Test output: Unit tests passing for working set percentages across all four weeks demonstrates correct 5/3/1 implementation
- Test output: Unit tests passing for weight rounding logic demonstrates proper plate math
- Test output: Unit tests passing for full workout plan generation demonstrates end-to-end logic
- Database query: WorkoutPlan document showing complete 4-week structure demonstrates data model implementation

### Unit 3: Workout Generation User Flow

**Purpose:** Implements the user-facing workflow from clicking "Generate Workout" through confirmation and workout creation.

**Functional Requirements:**
- The user shall click "Generate Workout" button on the 1RM card (only enabled when all four values are valid)
- The system shall display a confirmation dialog with the message: "This will create a new 4-week workout plan based on your 1RM values. Any unfinished workout cycle will be archived and a new one generated. Continue?"
- The system shall provide "Cancel" and "Confirm" buttons in the dialog
- Upon confirmation, the system shall save/update the user's 1RM values to the User model
- The system shall archive any existing active WorkoutPlan for the user
- The system shall generate and save a new WorkoutPlan document
- The system shall redirect the user to `/workout` page displaying the generated plan
- Upon cancellation, the system shall close the dialog with no changes

**Proof Artifacts:**
- Screenshot: Confirmation dialog with proper warning text demonstrates user warning implementation
- Video/Screenshot sequence: Full flow from clicking "Generate Workout" → confirmation → redirect to `/workout` page demonstrates complete user experience
- Database query: Before/after showing old plan archived (isArchived: true) and new plan created demonstrates archival logic

### Unit 4: Workout Display Page

**Purpose:** Provides a clear, organized view of the generated 4-week workout plan with all calculated weights.

**Functional Requirements:**
- The system shall create a new protected route at `/workout` accessible only to authenticated users
- The system shall display "No active workout plan" message if user has no active (non-archived) WorkoutPlan
- The system shall retrieve and display the user's most recent active WorkoutPlan
- The system shall display the 4-week plan organized by week and lift
- The system shall show for each set: lift name, set number, weight, target reps (e.g., "Squat Set 1: 185 lbs × 5")
- The system shall display Training Max values for reference
- The system shall show the plan creation date
- The user shall be able to navigate back to `/account` page

**Proof Artifacts:**
- Screenshot: `/workout` page URL showing full 4-week plan with calculated weights demonstrates page implementation
- Screenshot: Week 1, Week 2, Week 3, and Week 4 sections with proper percentages and weights demonstrates correct rendering
- Screenshot: "No active workout plan" state for user without generated plan demonstrates empty state handling

## Non-Goals (Out of Scope)

1. **Workout progress tracking and completion marking**: Users cannot mark sets as completed or log their actual performance in this iteration
2. **Accessory exercise recommendations**: The plan will only include the main four lifts, not the push/pull/legs assistance work mentioned in the 5/3/1 program
3. **Multiple workout plan templates**: Only the standard 4-week 5/3/1 cycle will be supported; no beginner 3-day or FSL variants
4. **Auto-progression logic**: The system will not automatically increase Training Max values after cycle completion
5. **Mobile app or PWA features**: This is a web-only implementation
6. **Social features or workout sharing**: No ability to share plans with other users
7. **Workout history or analytics**: No historical tracking or trend analysis of past workout plans

## Design Considerations

**1RM Card Design:**
- Follow existing account page card styling (match the account info card)
- Use a clean, form-based layout with labeled inputs
- Group the four lift inputs in a logical order (Squat, Bench, Deadlift, Overhead Press)
- Place unit selector (lbs/kg radio buttons or dropdown) prominently near the top
- Position "Generate Workout" button at the bottom of the card, disabled state when validation fails
- Use clear error messages inline with invalid inputs

**Confirmation Dialog:**
- Use a standard modal/dialog pattern consistent with modern web UX
- Warning text should be prominent but not alarming
- Clear "Cancel" and "Confirm" button distinction (different colors/styles)

**Workout Display Page:**
- Organize by week with clear visual separation (Week 1, Week 2, Week 3, Week 4 - Deload)
- Use a table or card layout for each week's lifts
- Display weights with units clearly shown
- Consider color coding the deload week differently to indicate lower intensity
- Show Training Max values in a summary section at the top

## Repository Standards

Based on existing codebase patterns:

- **TypeScript**: Use strict typing with interfaces for all data structures
- **Mongoose Models**: Follow the pattern established in `/models/User.ts` with TypeScript interfaces extending `Document`, schema definitions with validation, and index configuration
- **Server Components**: Use Next.js App Router server components for pages with session checks via `getServerSession`
- **File Organization**: Place new model in `/models/WorkoutPlan.ts`, new page at `/app/workout/page.tsx`
- **Authentication**: Protect routes using `getServerSession(authOptions)` and redirect pattern from `/app/account/page.tsx`
- **Database Connection**: Use `connectDB()` from `/lib/mongodb.ts` before database operations
- **Component Naming**: Use PascalCase for React components, place in `/components` if reusable
- **Styling**: Follow existing CSS class naming patterns from `globals.css`

## Technical Considerations

**Testing Framework:**
- No testing framework is currently installed; implementation will require adding Jest or Vitest to `devDependencies`
- Test files should follow naming convention: `*.test.ts` or `*.spec.ts`
- Place unit tests for workout generation logic alongside the implementation or in a `__tests__` directory

**Workout Calculation Module:**
- Create a pure function module (e.g., `/lib/workoutCalculator.ts`) for all 5/3/1 calculation logic
- Keep calculation logic separate from database/API layer for testability
- Export functions: `calculateTrainingMax()`, `generateWeek()`, `roundToPlate()`, `generateWorkoutPlan()`

**Data Model Considerations:**
- WorkoutPlan documents could grow large with full 4-week data; consider indexing strategy
- Use MongoDB `_id` as workoutId or generate UUID for easier reference
- Index on `userId` and `isArchived` for efficient queries
- Consider TTL index for auto-cleanup of very old archived plans

**API Route:**
- Create `/app/api/workout/generate/route.ts` for workout generation POST endpoint
- Validate session server-side before processing
- Return appropriate error responses (400 for validation, 401 for auth, 500 for server errors)

## Security Considerations

**Authentication & Authorization:**
- All workout-related routes and API endpoints must verify user session
- Users should only be able to generate and view their own workout plans
- Validate userId matches authenticated session before database operations

**Data Validation:**
- Server-side validation of all 1RM inputs (never trust client-side validation alone)
- Sanitize user inputs before database storage to prevent injection attacks
- Validate numeric bounds to prevent unreasonable values that could cause calculation errors

**Sensitive Data:**
- No particularly sensitive data (1RM values are not PII)
- Database credentials remain in environment variables as currently configured
- No API keys or third-party services required for this feature

**Proof Artifacts:**
- Safe to commit screenshots and test outputs to repository
- Database queries in proof artifacts should not expose connection strings or credentials

## Success Metrics

1. **Feature Adoption**: 50%+ of active users enter 1RM data within first month of release
2. **Workout Generation**: 80%+ of users who enter 1RM data successfully generate at least one workout plan
3. **Calculation Accuracy**: 100% of unit tests pass for all workout calculation functions
4. **Error Rate**: < 1% of workout generation attempts result in errors (tracked via error logging)
5. **User Retention**: Users who generate a workout plan have 2x higher return rate within 1 week

## Open Questions

No open questions at this time. All required details have been clarified through the questions document.
