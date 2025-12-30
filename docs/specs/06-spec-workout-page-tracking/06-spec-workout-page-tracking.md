# 06-spec-workout-page-tracking.md

## Introduction/Overview

This specification defines enhancements to the `/workout` page to transform it from a read-only workout plan viewer into a fully interactive workout tracking system. The feature enables users to mark sets as complete, record AMRAP (As Many Reps As Possible) performance, receive PR (Personal Record) notifications, and track their progress through a 4-week 5/3/1 program. The system will intelligently navigate users to their next incomplete workout and provide data-driven feedback to improve their training.

## Goals

1. Enable real-time workout tracking with set completion and AMRAP recording
2. Provide automatic PR detection and motivational feedback based on historical performance
3. Streamline navigation by auto-jumping to the next incomplete workout
4. Support progression planning by auto-incrementing 1RM values based on AMRAP performance
5. Maintain a comprehensive AMRAP history for theoretical 1RM calculation and progress tracking

## User Stories

1. **As a lifter**, I want to mark sets as complete during my workout so that I can track my progress in real-time and know exactly what I've finished.

2. **As a lifter**, I want to record my AMRAP performance so that the system can track my strength gains and calculate my theoretical 1RM.

3. **As a lifter**, I want to receive immediate feedback when I achieve a PR so that I feel motivated and can celebrate my progress.

4. **As a lifter**, I want the workout page to automatically show my next incomplete workout so that I can quickly start training without searching through all the weeks.

5. **As a lifter**, I want my 1RM values to auto-increment based on my AMRAP performance when starting a new program so that each cycle progressively challenges me.

6. **As a lifter**, I want to access my workout from the main navigation so that I can quickly get to my training plan from anywhere in the app.

## Demoable Units of Work

### Unit 1: Navigation Integration and Workout View

**Purpose:** Make the workout page accessible from navigation and display a focused single-workout view with week/workout navigation controls.

**Functional Requirements:**
- The system shall add a "My Workout" link to both desktop and mobile navigation menus
- The system shall display only one week and one workout at a time on the workout page
- The system shall provide a week dropdown selector showing weeks 1-4
- The system shall provide workout tab navigation showing all four lifts (Squat, Bench Press, Deadlift, Overhead Press)
- The system shall provide previous/next arrow buttons for sequential workout navigation
- The user shall be able to navigate between weeks and workouts using any combination of the provided controls
- The system shall redirect users without an active workout plan to the account page
- The system shall display the current week number and workout name prominently

**Proof Artifacts:**
- Screenshot: Desktop navigation showing "My Workout" link demonstrates navigation integration
- Screenshot: Mobile navigation showing "My Workout" link demonstrates mobile navigation integration
- Screenshot: Workout page showing single workout with week dropdown and workout tabs demonstrates focused view
- Video/Screenshot: Navigation between workouts using dropdowns and arrows demonstrates navigation controls

### Unit 2: Set Completion Tracking

**Purpose:** Allow users to mark individual sets as complete and persist this state in the database for progress tracking.

**Functional Requirements:**
- The system shall allow users to mark any set as complete by clicking anywhere on the set row
- The system shall visually distinguish completed sets from incomplete sets (e.g., strikethrough, checkmark, different background)
- The system shall persist set completion state to the WorkoutPlan model in the database
- The system shall allow users to unmark sets as complete only if the workout's AMRAP has not been recorded
- The system shall prevent unmarking sets after the AMRAP is recorded for that workout
- The system shall display set completion state immediately on page load by reading from the database
- The system shall save set completion changes via API call without requiring page refresh
- The system shall display a "Record AMRAP" button when all sets in a workout are marked complete AND the last set is an AMRAP set

**Proof Artifacts:**
- Screenshot: Set row with visual completion indicator demonstrates completion UI
- Video: Clicking set to toggle completion demonstrates interaction
- Database query: WorkoutPlan document showing `completed: true` on specific sets demonstrates persistence
- Screenshot: "Record AMRAP" button appearing after all sets complete demonstrates conditional display
- Test: Set unmarking blocked after AMRAP recorded demonstrates state locking

### Unit 3: AMRAP Recording and PR Detection

**Purpose:** Capture AMRAP performance data, detect personal records, and provide immediate motivational feedback.

**Functional Requirements:**
- The system shall display an AMRAP recording dialog when the "Record AMRAP" button is clicked
- The user shall provide the number of reps achieved and optionally add notes
- The system shall validate AMRAP input and warn if reps are significantly lower than the target (e.g., <50% of expected)
- The system shall store AMRAP records in the User model as a global history array including: lift type, weight, reps, date, workout plan reference, and notes
- The system shall detect PRs by comparing the current AMRAP to all historical AMRAPs for that lift
- The system shall recognize two PR types: (1) more reps at the same weight, (2) higher calculated 1RM
- The system shall display different PR messages for each type: "Rep PR: +X reps at Y lbs!" vs "1RM PR: New theoretical 1RM!"
- The system shall show PR notifications immediately after recording AMRAP, including improvement details, previous PR date, and previous notes
- The system shall disable the "Record AMRAP" button after submission to prevent duplicate entries
- The system shall mark the workout as finished in the WorkoutPlan after AMRAP is recorded

**Proof Artifacts:**
- Screenshot: AMRAP recording dialog with reps input and notes field demonstrates interface
- Screenshot: PR notification showing rep improvement and previous PR date demonstrates detection
- Database query: User model showing AMRAP history array with multiple entries demonstrates storage
- Test: PR detection correctly identifies rep PR (same weight, more reps) demonstrates rep PR logic
- Test: PR detection correctly identifies 1RM PR (different weight, higher calculated 1RM) demonstrates 1RM PR logic
- Screenshot: Validation warning for low rep count demonstrates input validation

### Unit 4: Auto-Navigation and Theoretical 1RM

**Purpose:** Automatically navigate to the first incomplete workout and provide theoretical 1RM calculations based on AMRAP performance.

**Functional Requirements:**
- The system shall determine the first incomplete workout when the page loads by finding the first workout with any incomplete sets
- The system shall navigate to and display the first incomplete workout automatically on page load
- The system shall calculate theoretical 1RM on-demand when viewing the account/profile page using the Epley formula: weight × (1 + reps/30)
- The system shall display theoretical 1RM values on the account page for each lift where AMRAP data exists
- The system shall show a "All workouts complete!" message when all sets across all weeks are marked complete
- The system shall provide a "Generate New Plan" button when all workouts are complete
- The system shall navigate to the account page when "Generate New Plan" is clicked
- The system shall auto-increment 1RM values on the account page based on AMRAP performance: if AMRAP reps met or exceeded target, increase 1RM by 10 lbs (or 5 kg); otherwise keep current value
- The user shall be warned before navigating away if sets are marked complete but AMRAP has not been recorded for that workout

**Proof Artifacts:**
- Video: Page load automatically showing Week 2, Workout 3 (first incomplete) demonstrates auto-navigation
- Screenshot: Account page showing theoretical 1RM calculated from AMRAP data demonstrates calculation
- Screenshot: "All workouts complete!" message with "Generate New Plan" button demonstrates completion state
- Test: Auto-increment logic increases squat 1RM by 10 lbs when target met demonstrates progression logic
- Test: Auto-increment logic keeps bench 1RM unchanged when target not met demonstrates selective progression
- Screenshot: Navigation warning dialog when leaving mid-workout demonstrates unsaved work protection

## Non-Goals (Out of Scope)

1. **Editing historical AMRAP records**: Once an AMRAP is recorded, it cannot be modified or deleted
2. **Custom workout modifications**: Users cannot change prescribed weights, reps, or percentages
3. **Rest timer functionality**: No built-in rest timer between sets
4. **Exercise video demonstrations**: No exercise instruction or form guidance
5. **Social features**: No sharing workouts or competing with other users
6. **Multi-week overview**: No calendar view or progress charts spanning multiple weeks
7. **Workout notes per set**: Notes are only available for AMRAP sets, not individual working sets
8. **Offline support**: Requires internet connection for all tracking features

## Design Considerations

**Visual Hierarchy:**
- Completed sets should have clear visual distinction (lighter opacity, strikethrough text, checkmark icon)
- AMRAP sets should remain visually prominent with the "+" badge
- Current week/workout should be clearly highlighted in navigation controls
- PR notifications should use celebratory design (confetti emoji, bold text, highlight color)

**Responsive Design:**
- Desktop: Show week dropdown + workout tabs side-by-side with prev/next arrows
- Mobile: Stack week dropdown above workout tabs, larger touch targets for set rows
- Desktop may show additional metadata (last workout date, completion percentage)
- Mobile focuses on essential information only

**Interaction Feedback:**
- Set clicks should provide immediate visual feedback (animation, color change)
- AMRAP submission should show loading state during API call
- Navigation changes should be smooth (fade/slide transitions)
- Error states should be non-blocking with clear remediation steps

**Accessibility:**
- All navigation controls keyboard accessible
- Set completion toggleable via keyboard (Enter/Space)
- ARIA labels for screen readers on all interactive elements
- Focus management when dialogs open/close

## Repository Standards

**Follow established patterns from the codebase:**

- Use TypeScript with strict typing for all components and models
- Server components for data fetching, client components for interactivity (mark with 'use client')
- Mongoose schemas with TypeScript interfaces for data models
- Next.js API routes under `/app/api/` for mutations (e.g., `/app/api/workout/complete-set/route.ts`)
- Consistent naming: kebab-case for files, PascalCase for components, camelCase for variables
- Use existing auth pattern with `getServerSession(authOptions)` for protected routes
- Follow existing CSS organization in `globals.css` with BEM-style class naming
- Use Next.js Link component for navigation
- Lean queries with `.lean()` for read-only data
- MongoDB ObjectId handling with proper type casting

**Testing:**
- Add unit tests for theoretical 1RM calculation logic
- Add unit tests for PR detection logic
- Add unit tests for auto-increment 1RM logic

## Technical Considerations

**Database Schema Updates:**
- Extend `IWorkoutSet` interface to include `completed?: boolean` field
- Extend `IWorkoutSet` interface to include `amrapRecorded?: boolean` field to track if AMRAP was submitted
- Add to User model:
  ```typescript
  amrapHistory?: Array<{
    lift: 'squat' | 'bench' | 'deadlift' | 'overheadPress';
    weight: number;
    reps: number;
    units: 'lbs' | 'kg';
    date: Date;
    workoutPlanId: Types.ObjectId;
    weekNumber: number;
    notes?: string;
  }>;
  ```

**API Endpoints Required:**
- `POST /api/workout/complete-set` - Mark set as complete/incomplete
- `POST /api/workout/record-amrap` - Record AMRAP performance
- `GET /api/workout/check-pr` - Check if AMRAP is a PR (could be combined with record-amrap)

**State Management:**
- Use React state for UI interactions (set completion toggle, dialog open/close)
- Optimistic UI updates for set completion with rollback on error
- Server-side state as source of truth, client hydrates from server data

**Navigation State:**
- Track current week/workout in URL query params for shareable links and browser back button support
- Example: `/workout?week=2&lift=squat`

**Performance:**
- Limit AMRAP history to prevent unbounded array growth (e.g., keep last 100 records per lift)
- Index workoutPlanId and userId for efficient queries
- Consider pagination if AMRAP history UI is added in the future

## Security Considerations

**API Security:**
- All workout tracking API endpoints require authentication via NextAuth session
- Validate that user owns the WorkoutPlan before allowing modifications
- Sanitize user input for AMRAP notes to prevent XSS attacks
- Rate limit AMRAP recording endpoint to prevent abuse (max 4 AMRAPs per day per user)

**Data Privacy:**
- AMRAP records contain user performance data and should only be accessible to the owning user
- Do not expose other users' workout data or AMRAP history
- Notes field should be validated for appropriate content length (<500 characters)

**Proof Artifact Security:**
- Screenshots will show user-specific data (name, email, workout progress)
- Database queries in proofs should redact sensitive fields (email, googleId)
- Test data should use mock users, not production data

## Success Metrics

1. **Feature Adoption**: >80% of users with active workout plans mark at least one set as complete within 7 days of feature launch
2. **Workout Completion Rate**: >60% of users complete at least one full week (4 workouts) within 30 days
3. **AMRAP Recording**: >70% of users who complete a workout record their AMRAP performance
4. **Plan Progression**: >50% of users who complete a full 4-week program generate a new plan with auto-incremented weights
5. **User Engagement**: Average time on workout page increases by >200% compared to pre-tracking baseline

## Open Questions

No open questions at this time. All requirements have been clarified through the question rounds.
