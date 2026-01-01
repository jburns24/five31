# 08-b-tasks-otel-manual-instrumentation.md

## Relevant Files

- `/lib/otel/mongoInstrumentation.ts` - MongoDB query instrumentation wrapper (new file)
- `/lib/otel/errorSlugs.ts` - Error slug constants and recordError utility (new file)
- `/lib/otel/timing.ts` - Phase timing utilities (new file)
- `/lib/otel/validation.ts` - Span attribute validation utility (new file)
- `/lib/otel/utils.ts` - Main span utilities (should exist from spec 08-a, or create if missing)
- `/lib/mongodb.ts` - MongoDB connection handler (will be modified to use instrumentation wrapper)
- `/app/auth.ts` - NextAuth configuration with signIn callback (will be instrumented)
- `/app/api/workout/generate/route.ts` - Workout generation endpoint (will be instrumented)
- `/lib/workoutCalculator.ts` - Training max calculation utility (read-only reference)
- `/models/User.ts` - User model with 1RM data (read-only reference for user.id access)
- `/models/WorkoutPlan.ts` - Workout plan model (read-only reference for plan_id)
- `/docs/observability/error-slugs.md` - Error slug documentation (new file)
- `/docs/observability/span-attributes.md` - Attribute schema documentation (new file)

### Notes

- Create `/lib/otel/` directory if it doesn't exist (should be created in spec 08-a)
- Create `/docs/observability/` directory if it doesn't exist
- All instrumentation utilities should use TypeScript with strict type safety
- Follow existing path alias pattern (`@/lib/otel`, `@/lib/mongodb`, etc.)
- Instrumentation errors should not crash the application (wrap in try/catch)
- Use existing OTel SDK initialized from spec 08-a (trace.getActiveSpan(), AsyncLocalStorage)
- Test with `npm run dev` and verify traces in console or OTel Collector
- NO unit tests required initially (utilities structured as testable pure functions when possible)

## Tasks

### [ ] 1.0 Implement MongoDB Operations Instrumentation

#### 1.0 Proof Artifact(s)

- File exists: `/lib/otel/mongoInstrumentation.ts` demonstrates MongoDB instrumentation wrapper created
- Code inspection: `/lib/mongodb.ts` shows connectDB wrapped with instrumentation demonstrates integration complete
- Console/OTel Collector: Trace JSON output shows `stats.mongodb.query_count` and `stats.mongodb.query_duration_ms` attributes on main span demonstrates aggregate stats captured
- Console/OTel Collector: Trace with MongoDB connection error shows `error.slug=err-mongodb-connection-failed` demonstrates error slug pattern implemented
- Console/OTel Collector: Trace shows `db.system=mongodb`, `db.name`, and `db.mongodb.cluster` attributes demonstrates connection metadata captured

#### 1.0 Tasks

- [ ] 1.1 Create `/lib/otel/` directory if it doesn't exist (should be created in spec 08-a)
- [ ] 1.2 Create `/lib/otel/mongoInstrumentation.ts` file with TypeScript imports for Mongoose and OTel trace API
- [ ] 1.3 Implement MongoDB query tracking using Mongoose middleware (pre/post hooks on Query operations: find, findOne, insertOne, updateOne, deleteOne, etc.)
- [ ] 1.4 Add query statistics tracking: increment `stats.mongodb.query_count` attribute on main span for each query executed
- [ ] 1.5 Add query duration tracking: accumulate `stats.mongodb.query_duration_ms` attribute on main span for total database time
- [ ] 1.6 Add operation type tracking: collect MongoDB operation types in `stats.mongodb.operation_types` array attribute (e.g., ["findOne", "updateOne"])
- [ ] 1.7 Add connection metadata attributes: `db.system=mongodb`, `db.name` (from MONGODB_URI), `db.mongodb.cluster` (sanitized cluster name without credentials)
- [ ] 1.8 Implement child span creation for slow queries (threshold: 500ms default) with query details
- [ ] 1.9 Implement error handling with error slugs: `err-mongodb-connection-failed`, `err-mongodb-query-timeout`, `err-mongodb-duplicate-key`
- [ ] 1.10 Export instrumentation wrapper function `instrumentMongoose(mongooseInstance)` that applies all middleware
- [ ] 1.11 Modify `/lib/mongodb.ts` to import and apply the instrumentation wrapper after successful connection
- [ ] 1.12 Test MongoDB instrumentation by starting dev server, triggering a database operation, and verifying trace output shows MongoDB stats

### [ ] 2.0 Implement Static Error Slug Infrastructure

#### 2.0 Proof Artifact(s)

- File exists: `/lib/otel/errorSlugs.ts` demonstrates error slug constants and utility created
- File exists: `/docs/observability/error-slugs.md` demonstrates error documentation created with descriptions
- Code inspection: Error slug constants follow `err-<domain>-<specific-error>` naming pattern demonstrates grep-friendly convention
- Code inspection: `recordError()` utility function adds `error.slug`, `error.message`, `error.type`, and calls `span.recordException()` demonstrates comprehensive error capture
- CLI: `grep -r "err-" ./lib ./app/api` shows error slugs defined demonstrates error slug constants searchable

#### 2.0 Tasks

- [ ] 2.1 Create `/lib/otel/errorSlugs.ts` file with TypeScript imports for OTel trace API
- [ ] 2.2 Define error slug constants using `err-<domain>-<specific-error>` naming pattern (e.g., `export const ERR_MONGODB_CONNECTION_FAILED = 'err-mongodb-connection-failed'`)
- [ ] 2.3 Create error slug constants for MongoDB domain: connection-failed, query-timeout, duplicate-key
- [ ] 2.4 Create error slug constants for authentication domain: callback-failed, user-creation-failed, oauth-token-invalid
- [ ] 2.5 Create error slug constants for workout generation domain: invalid-input, plan-save-failed, generation-failed
- [ ] 2.6 Implement `recordError(error: Error, slug: string, context?: Record<string, any>)` utility function that retrieves main span from context
- [ ] 2.7 In recordError function: add `error.slug` attribute to span, add `error.message`, `error.type` attributes
- [ ] 2.8 In recordError function: call `span.recordException(error)` to capture stack trace
- [ ] 2.9 In recordError function: set span status to ERROR with appropriate message
- [ ] 2.10 In recordError function: add `error.context.*` attributes for any context provided (e.g., `error.context.user_id`, `error.context.operation`)
- [ ] 2.11 Create `/docs/observability/` directory if it doesn't exist
- [ ] 2.12 Create `/docs/observability/error-slugs.md` documentation file listing all error slugs with descriptions, example scenarios, and resolution steps
- [ ] 2.13 Test error slug infrastructure by manually throwing an error with recordError and verifying span attributes

### [ ] 3.0 Instrument User Authentication Flow

#### 3.0 Proof Artifact(s)

- Code inspection: `/app/auth.ts` signIn callback shows `setMainSpanAttributes()` calls demonstrates instrumentation integrated
- Console/OTel Collector: Trace for user signin shows `auth.provider=google`, `auth.duration_ms`, `auth.event` attributes demonstrates auth context captured
- Console/OTel Collector: Trace shows `user.id` (MongoDB ObjectId format), `user.account_age_days`, `user.is_new_user` attributes demonstrates user context captured (no PII)
- Console/OTel Collector: Trace for new user signup shows `auth.event=user_created` and `user.is_new_user=true` demonstrates new user flow tracked
- Console/OTel Collector: Trace with auth error shows `error.slug=err-auth-callback-failed` demonstrates error slug pattern applied

#### 3.0 Tasks

- [ ] 3.1 Import `setMainSpanAttributes` utility from `/lib/otel/utils.ts` in `/app/auth.ts`
- [ ] 3.2 Import error slug constants and `recordError` from `/lib/otel/errorSlugs.ts` in `/app/auth.ts`
- [ ] 3.3 Add timing measurement at start of signIn callback using `performance.now()` or `process.hrtime.bigint()`
- [ ] 3.4 Add `auth.provider` attribute with value from `account.provider` (e.g., "google")
- [ ] 3.5 Determine auth event type: "user_created" if new user, "user_existing" if existing user, "signin" as general event
- [ ] 3.6 Add `auth.event` attribute with determined event type
- [ ] 3.7 After user creation/lookup, add `user.id` attribute using MongoDB ObjectId (`user._id.toString()` NOT email)
- [ ] 3.8 Calculate account age: `Math.floor((Date.now() - user.createdAt.getTime()) / (1000 * 60 * 60 * 24))`
- [ ] 3.9 Add `user.account_age_days` attribute with calculated value
- [ ] 3.10 Add `user.is_new_user` boolean attribute (true for new user creation, false for existing user)
- [ ] 3.11 Calculate auth duration at end of callback and add `auth.duration_ms` attribute
- [ ] 3.12 Wrap existing try/catch with `recordError()` call using `ERR_AUTH_CALLBACK_FAILED` slug
- [ ] 3.13 Add specific error handling for user creation failures with `ERR_USER_CREATION_FAILED` slug
- [ ] 3.14 Test authentication flow by signing in with new user and existing user, verify all attributes captured (no PII like email in spans)

### [ ] 4.0 Instrument Workout Plan Generation Flow

#### 4.0 Proof Artifact(s)

- Code inspection: `/app/api/workout/generate/route.ts` shows `setMainSpanAttributes()` calls throughout handler demonstrates manual instrumentation added
- Console/OTel Collector: Trace shows `workout.generation.input.squat_1rm`, `workout.generation.input.bench_1rm`, `workout.generation.input.deadlift_1rm`, `workout.generation.input.overhead_press_1rm` attributes demonstrates 1RM inputs captured
- Console/OTel Collector: Trace shows `workout.generation.training_max_*` attributes (squat, bench, deadlift, overhead_press) demonstrates calculated training maxes captured
- Console/OTel Collector: Trace shows `workout.generation.plan_id`, `workout.generation.weeks_count`, `workout.generation.archived_previous_plan` attributes demonstrates plan metadata captured
- Console/OTel Collector: Trace with validation error shows `error.slug=err-workout-generation-invalid-input` demonstrates error slug pattern applied
- Console/OTel Collector: Trace shows `business_logic.duration_ms` and `validation.input_validation_duration_ms` demonstrates phase timing captured

#### 4.0 Tasks

- [ ] 4.1 Import `setMainSpanAttributes` utility from `/lib/otel/utils.ts` in `/app/api/workout/generate/route.ts`
- [ ] 4.2 Import error slug constants and `recordError` from `/lib/otel/errorSlugs.ts` in `/app/api/workout/generate/route.ts`
- [ ] 4.3 Import timing utilities (`startPhase`, `endPhase`) from `/lib/otel/timing.ts` (will be created in Task 5.0, or add timing manually here first)
- [ ] 4.4 Add validation phase timing: measure time spent validating input (lines 25-72 in current route.ts)
- [ ] 4.5 Add validation duration attribute: `validation.input_validation_duration_ms` with measured time
- [ ] 4.6 Add 1RM input attributes after validation: `workout.generation.input.squat_1rm`, `workout.generation.input.bench_1rm`, `workout.generation.input.deadlift_1rm`, `workout.generation.input.overhead_press_1rm`
- [ ] 4.7 Add business logic phase timing: measure time spent in workout calculation (generateWorkoutPlan call)
- [ ] 4.8 Add business logic duration attribute: `business_logic.duration_ms` with measured time
- [ ] 4.9 After generateWorkoutPlan call, extract training max values from `workoutPlanData.trainingMaxValues`
- [ ] 4.10 Add training max attributes: `workout.generation.training_max_squat`, `workout.generation.training_max_bench`, `workout.generation.training_max_deadlift`, `workout.generation.training_max_overhead_press`
- [ ] 4.11 After saving WorkoutPlan, add `workout.generation.plan_id` attribute with `newWorkoutPlan._id.toString()`
- [ ] 4.12 Add `workout.generation.weeks_count` attribute (always 4 for 5/3/1 program)
- [ ] 4.13 Add `workout.generation.archived_previous_plan` boolean attribute (true if updateMany affected any documents)
- [ ] 4.14 Replace existing validation error responses (lines 29-72) with `recordError()` calls using `ERR_WORKOUT_GENERATION_INVALID_INPUT` slug
- [ ] 4.15 Replace general error catch (line 132) with `recordError()` using `ERR_WORKOUT_GENERATION_FAILED` slug
- [ ] 4.16 Add specific error handling for WorkoutPlan save failures with `ERR_WORKOUT_GENERATION_PLAN_SAVE_FAILED` slug
- [ ] 4.17 Test workout generation by submitting valid and invalid 1RM values, verify all attributes and error slugs captured

### [ ] 5.0 Implement Performance Phase Timing Utilities

#### 5.0 Proof Artifact(s)

- File exists: `/lib/otel/timing.ts` demonstrates phase timing utilities created
- Code inspection: Timing utilities export `startPhase()` and `endPhase()` functions demonstrates reusable API
- Code inspection: Multiple API routes (auth, workout generation) show `startPhase`/`endPhase` usage demonstrates adoption
- Console/OTel Collector: Trace shows `auth.duration_ms`, `validation.duration_ms`, `business_logic.duration_ms` attributes demonstrates phase breakdown captured
- Console/OTel Collector: Trace shows `total_tracked_duration_ms` approximately equals sum of phase durations demonstrates timing accuracy

#### 5.0 Tasks

- [ ] 5.1 Create `/lib/otel/timing.ts` file with TypeScript imports for OTel trace API
- [ ] 5.2 Implement `startPhase(phaseName: string): bigint` function that returns current high-resolution time using `process.hrtime.bigint()`
- [ ] 5.3 Implement `endPhase(phaseName: string, startTime: bigint): void` function that calculates duration and adds `${phaseName}.duration_ms` attribute to main span
- [ ] 5.4 In endPhase function: calculate duration as `Number(process.hrtime.bigint() - startTime) / 1_000_000` to convert nanoseconds to milliseconds
- [ ] 5.5 In endPhase function: retrieve main span from context and call `setMainSpanAttributes({ [`${phaseName}.duration_ms`]: duration })`
- [ ] 5.6 Implement `calculateTotalTrackedDuration()` function that sums all `*.duration_ms` attributes and adds `total_tracked_duration_ms` to span
- [ ] 5.7 Export all timing utilities with TypeScript type definitions
- [ ] 5.8 Update `/app/auth.ts` to use `startPhase('auth')` and `endPhase('auth', startTime)` around signIn callback logic
- [ ] 5.9 Update `/app/api/workout/generate/route.ts` to use timing utilities for validation and business logic phases (replace manual timing from Task 4.0 if already implemented)
- [ ] 5.10 Add `calculateTotalTrackedDuration()` call at end of workout generation handler
- [ ] 5.11 Test timing utilities by triggering instrumented flows and verifying phase duration attributes are accurate
- [ ] 5.12 Verify `total_tracked_duration_ms` approximately equals sum of individual phase durations (within reasonable margin)

### [ ] 6.0 Implement Wide Events Validation and Documentation

#### 6.0 Proof Artifact(s)

- File exists: `/lib/otel/validation.ts` demonstrates attribute validation utility created
- File exists: `/docs/observability/span-attributes.md` demonstrates comprehensive attribute schema documentation
- Documentation: `span-attributes.md` shows attribute categories (Service Metadata, HTTP Context, User Context, Business Context, Performance Metrics, Error Context) demonstrates organized schema
- Documentation: `span-attributes.md` provides 10+ example queries for debugging scenarios demonstrates practical usage guidance
- Console/OTel Collector: Trace for workout generation endpoint shows 50-80 attributes on main span demonstrates wide events pattern achieved
- Console: Validation utility logs warning for spans with <50 or >100 attributes demonstrates attribute count monitoring

#### 6.0 Tasks

- [ ] 6.1 Create `/lib/otel/validation.ts` file with TypeScript imports for OTel trace API
- [ ] 6.2 Implement `validateAttributeCount(span: Span): void` function that retrieves all attributes from span
- [ ] 6.3 In validateAttributeCount function: count total attributes on span
- [ ] 6.4 In validateAttributeCount function: log warning to console if attribute count < 50 with message "Wide events pattern: span has only X attributes (target: 50-80)"
- [ ] 6.5 In validateAttributeCount function: log warning to console if attribute count > 100 with message "Wide events pattern: span has Y attributes (recommended max: 100)"
- [ ] 6.6 In validateAttributeCount function: log info to console if attribute count is between 50-80 with message "Wide events pattern: span has Z attributes (optimal range)"
- [ ] 6.7 Export validation utility with TypeScript type definitions
- [ ] 6.8 Add `validateAttributeCount()` call at end of workout generation handler to verify wide events pattern
- [ ] 6.9 Create `/docs/observability/span-attributes.md` documentation file with markdown structure
- [ ] 6.10 In span-attributes.md: document all attribute categories with tables: Service Metadata (service.name, service.version, service.environment), HTTP Context (http.method, http.route, http.status_code), User Context (user.id, user.account_age_days, user.is_new_user), Business Context (workout.generation.*, auth.*), Performance Metrics (*.duration_ms, stats.mongodb.*), Error Context (error.slug, error.message, error.context.*)
- [ ] 6.11 In span-attributes.md: provide example values for each attribute
- [ ] 6.12 In span-attributes.md: mark which attributes are always present vs conditionally present (e.g., error.* only on errors)
- [ ] 6.13 In span-attributes.md: add section with 10+ example queries for debugging scenarios (e.g., "Find all requests with MongoDB query count > 10", "Find all workout generation failures by error slug", "Find slow authentication requests where auth.duration_ms > 1000")
- [ ] 6.14 In span-attributes.md: document the wide events pattern (50-80 attributes per main span) and hybrid approach (child spans for slow operations only)
- [ ] 6.15 Test validation by triggering workout generation endpoint and verifying console logs show attribute count in 50-80 range
- [ ] 6.16 Manually count attributes in a sample trace to verify 50-80 target is achieved (include auto-instrumentation attributes + manual attributes)
