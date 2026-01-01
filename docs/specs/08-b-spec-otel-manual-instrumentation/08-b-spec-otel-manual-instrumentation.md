# 08-b-spec-otel-manual-instrumentation.md

## Introduction/Overview

This specification covers manual OpenTelemetry instrumentation of key user flows in the five31 workout tracker application, building on the auto-instrumentation foundation from spec 08-a. Manual instrumentation will enrich main request spans with business context following the wide events pattern, including user authentication flow, MongoDB operations, and workout plan generation. This implementation adopts a hybrid approach: wide events for main spans (50-80 attributes per request) with child spans used sparingly for complex operations. Static error slugs will be implemented for all error paths to enable efficient grouping and code lookup.

## Goals

- Manually instrument user creation and login flow with authentication timing, user metadata, and OAuth context
- Implement MongoDB instrumentation to capture query counts, durations, and operation types on main request spans
- Manually instrument workout plan generation flow with business context (1RM values, training max calculations, plan metadata)
- Implement static error slug pattern for all try/catch blocks and validation failures
- Enrich main spans with performance breakdowns (auth duration, business logic duration, database duration)
- Maintain 50-80 attributes per main span following the wide events pattern

## User Stories

**As a developer debugging authentication issues**, I want user creation and login flows instrumented with timing breakdowns and OAuth metadata so that I can identify slow authentication steps and correlate errors with specific OAuth providers.

**As a developer investigating database performance**, I want MongoDB operation counts and durations aggregated on main request spans so that I can identify API endpoints making excessive database queries without viewing waterfall traces.

**As a developer debugging workout generation failures**, I want business context (1RM values, training max, validation failures) captured on the main span so that I can understand why specific workout generations failed.

**As an SRE investigating production errors**, I want static error slugs on all error spans so that I can quickly group errors by type and grep the codebase to find error handling code.

**As a developer analyzing performance**, I want phase-level timing (auth, business logic, database) on main spans so that I can identify which phase of request processing is slow without analyzing child spans.

## Demoable Units of Work

### Unit 1: MongoDB Operations Instrumentation

**Purpose:** Instrument MongoDB operations to capture aggregate query counts, durations, and operation types on main request spans

**Functional Requirements:**
- The system shall wrap the MongoDB connection function (connectDB) with instrumentation that tracks all queries
- The system shall increment stats.mongodb.query_count attribute on the main span for each query executed
- The system shall accumulate stats.mongodb.query_duration_ms attribute on the main span for total database time
- The system shall track MongoDB operation types (find, findOne, insertOne, updateOne, etc.) in stats.mongodb.operation_types array
- The system shall create child spans for MongoDB queries only when query duration exceeds threshold (default 500ms)
- The system shall add MongoDB connection metadata to main span: db.system=mongodb, db.name, db.mongodb.cluster
- The system shall implement error slugs for MongoDB errors: err-mongodb-connection-failed, err-mongodb-query-timeout, err-mongodb-duplicate-key
- The system shall handle MongoDB connection failures gracefully and add error context to span

**Proof Artifacts:**
- File exists: /lib/otel/mongoInstrumentation.ts demonstrates MongoDB instrumentation wrapper
- Code inspection: mongodb.ts shows connectDB wrapped with instrumentation demonstrates integration
- Console/OTel Collector: Trace shows stats.mongodb.query_count and stats.mongodb.query_duration_ms demonstrates aggregate stats captured
- Console/OTel Collector: Trace with MongoDB error shows error.slug=err-mongodb-connection-failed demonstrates error slug pattern

### Unit 2: User Authentication Flow Instrumentation

**Purpose:** Instrument NextAuth.js callbacks to capture authentication timing, user creation events, and OAuth metadata

**Functional Requirements:**
- The system shall instrument the NextAuth.js signIn callback to capture authentication events
- The system shall add auth.provider attribute (google) to main span during authentication
- The system shall measure and add auth.duration_ms attribute for authentication callback processing time
- The system shall add auth.event attribute (signin, user_created, user_existing) to distinguish authentication types
- The system shall add user.id attribute to main span after successful authentication (use MongoDB ObjectId, not email)
- The system shall add user.account_age_days attribute calculated from user creation date
- The system shall add user.is_new_user boolean attribute to distinguish first-time signins
- The system shall implement error slugs for auth errors: err-auth-callback-failed, err-user-creation-failed, err-oauth-token-invalid
- The system shall NOT log email addresses, OAuth tokens, or session secrets in span attributes

**Proof Artifacts:**
- Code inspection: /app/auth.ts shows signIn callback instrumented with setMainSpanAttributes demonstrates integration
- Console/OTel Collector: Trace for user signin shows auth.provider=google, auth.duration_ms, auth.event demonstrates auth context captured
- Console/OTel Collector: Trace shows user.id (ObjectId format) and user.account_age_days demonstrates user context captured
- Console/OTel Collector: Trace for new user signup shows user.is_new_user=true demonstrates new user detection

### Unit 3: Workout Plan Generation Flow Instrumentation

**Purpose:** Instrument workout plan generation endpoint with business context including 1RM inputs, training max calculations, and plan metadata

**Functional Requirements:**
- The system shall instrument POST /api/workout/generate endpoint with manual span enrichment
- The system shall add workout.generation.input.squat_1rm, bench_1rm, deadlift_1rm, overhead_press_1rm attributes (sanitized to remove decimals if needed)
- The system shall add workout.generation.training_max_squat, training_max_bench, training_max_deadlift, training_max_overhead_press attributes
- The system shall add workout.generation.plan_id attribute with generated WorkoutPlan MongoDB ObjectId
- The system shall add workout.generation.weeks_count attribute (always 4 for 5/3/1 program)
- The system shall measure and add business_logic.duration_ms attribute for workout calculation time
- The system shall add validation.input_validation_duration_ms attribute for input validation time
- The system shall implement error slugs: err-workout-generation-invalid-input, err-workout-generation-plan-save-failed, err-workout-generation-failed
- The system shall add workout.generation.archived_previous_plan boolean indicating if previous plan was archived

**Proof Artifacts:**
- Code inspection: /app/api/workout/generate/route.ts shows setMainSpanAttributes calls demonstrates manual instrumentation
- Console/OTel Collector: Trace shows workout.generation.input.* and workout.generation.training_max_* attributes demonstrates business context captured
- Console/OTel Collector: Trace shows workout.generation.plan_id demonstrates plan creation tracked
- Console/OTel Collector: Trace with validation failure shows error.slug=err-workout-generation-invalid-input demonstrates error slug pattern

### Unit 4: Static Error Slug Implementation

**Purpose:** Implement comprehensive static error slug pattern for all error paths to enable efficient error grouping and code lookup

**Functional Requirements:**
- The system shall create a centralized error slug mapping utility (/lib/otel/errorSlugs.ts)
- The system shall define error slug constants for all known error types with grep-friendly names (err-*)
- The system shall implement recordError utility function that adds error.slug, error.message, error.type, error.code to main span
- The system shall call span.recordException(error) for all errors to capture stack traces
- The system shall set span status to ERROR with appropriate message
- The system shall add error.context.* attributes for relevant error context (e.g., error.context.user_id, error.context.operation)
- The system shall document all error slugs in /docs/observability/error-slugs.md with descriptions and resolution steps
- The system shall implement error slugs for all existing try/catch blocks in API routes

**Proof Artifacts:**
- File exists: /lib/otel/errorSlugs.ts demonstrates error slug utility
- File exists: /docs/observability/error-slugs.md demonstrates error documentation
- Code inspection: API route error handlers show recordError() calls demonstrates error slug adoption
- CLI: `grep -r "err-" ./lib ./app/api` shows 20+ error slugs demonstrates comprehensive coverage

### Unit 5: Performance Phase Timing

**Purpose:** Add phase-level performance timing breakdowns (auth, validation, business logic, database) to main spans

**Functional Requirements:**
- The system shall create timing utility functions (startPhase, endPhase) that measure durations and add to main span
- The system shall measure auth.duration_ms for authentication operations (NextAuth callbacks)
- The system shall measure validation.duration_ms for input validation operations
- The system shall measure business_logic.duration_ms for core application logic (workout calculations, etc.)
- The system shall measure serialization.duration_ms for response serialization if applicable
- The system shall ensure phase timings are non-overlapping (sequential phases)
- The system shall add total_tracked_duration_ms to verify phase timings sum correctly
- The system shall make timing utilities reusable across all API routes

**Proof Artifacts:**
- File exists: /lib/otel/timing.ts demonstrates phase timing utilities
- Code inspection: API routes show startPhase/endPhase usage demonstrates timing adoption
- Console/OTel Collector: Trace shows auth.duration_ms, validation.duration_ms, business_logic.duration_ms demonstrates phase breakdown
- Console/OTel Collector: Verify duration_ms ≈ sum of phase durations demonstrates accuracy

### Unit 6: Wide Events Validation and Documentation

**Purpose:** Validate that main spans contain 50-80 attributes following wide events pattern and document attribute schema

**Functional Requirements:**
- The system shall create a validation utility that counts attributes on main spans and logs warnings if <50 or >100 attributes
- The system shall document the wide events attribute schema in /docs/observability/span-attributes.md
- The documentation shall categorize attributes: Service Metadata, HTTP Context, User Context, Business Context, Performance Metrics, Error Context
- The documentation shall provide example values for each attribute
- The documentation shall document which attributes are always present vs conditionally present
- The system shall create example queries demonstrating the value of wide events (error rate by user type, slow requests by endpoint, etc.)
- The system shall validate that main spans marked with main=true have comprehensive attributes

**Proof Artifacts:**
- File exists: /lib/otel/validation.ts demonstrates attribute validation utility
- File exists: /docs/observability/span-attributes.md demonstrates attribute schema documentation
- Console/OTel Collector: Trace for workout generation shows 50-80 attributes demonstrates wide events pattern achieved
- Documentation: span-attributes.md shows 10+ example queries demonstrates practical usage guidance

## Non-Goals (Out of Scope)

1. **Workout tracking flow instrumentation** - Complete set, record AMRAP, and workout navigation flows will be instrumented in follow-up specs
2. **Personal record detection instrumentation** - PR detection logic and AMRAP history analysis will be instrumented in follow-up specs
3. **Statistics page instrumentation** - Stats calculations and chart data aggregation will be instrumented in follow-up specs
4. **Client-side instrumentation** - Browser-side fetch calls and React component interactions are out of scope
5. **Mongoose auto-instrumentation plugin** - Using official Mongoose OTel instrumentation library is out of scope; implementing custom wrapper
6. **Real-time span attribute validation** - Automated testing of span schemas is planned for future; manual validation only in this spec
7. **Dashboard creation** - Creating Grafana/observability backend dashboards is out of scope
8. **Alerting rules** - Setting up alerts for error rates, slow requests, etc. is out of scope

## Design Considerations

**Wide Events Attribute Count:**
Targeting 50-80 attributes per main span as specified (Standard richness level). This includes ~20 service/HTTP attributes from auto-instrumentation, ~15 user/auth attributes, ~20 business context attributes, ~10 performance timing attributes, and ~10 error context attributes when applicable.

**Child Span Usage:**
Following hybrid approach: use wide events for main spans, but create child spans for operations exceeding 500ms (e.g., slow MongoDB queries). This provides waterfall visibility for genuinely slow operations while keeping fast operations as aggregates on main span.

**Error Slug Naming Convention:**
All error slugs follow pattern: `err-<domain>-<specific-error>-<detail>` (e.g., err-workout-generation-invalid-input, err-mongodb-connection-failed). This enables efficient grep: `grep "err-workout-generation"` finds all workout generation errors.

**Async Operations and Context:**
Using AsyncLocalStorage (from auto-instrumentation spec) ensures main span reference is available even in async callbacks and promise chains. Critical for instrumenting NextAuth.js callbacks which run asynchronously.

**Performance Overhead:**
MongoDB instrumentation adds minimal overhead (<1ms per query) by incrementing counters on main span. Phase timing uses process.hrtime for nanosecond precision with negligible overhead.

## Repository Standards

**TypeScript Standards:**
- Maintain strict type safety for all instrumentation utilities
- Create TypeScript interfaces for error slug mappings and span attribute schemas
- Use existing path aliases (@/lib/otel, @/lib/mongodb)

**Code Organization:**
- Place all instrumentation utilities in /lib/otel/ (mongoInstrumentation.ts, errorSlugs.ts, timing.ts, validation.ts)
- Keep instrumentation code separate from business logic where possible
- Use decorator/wrapper pattern for MongoDB instrumentation to avoid polluting mongodb.ts

**Error Handling:**
- Follow existing error handling patterns in API routes
- Ensure instrumentation errors don't crash application (wrap in try/catch)
- Log instrumentation errors at debug level

**Testing Conventions:**
- Structure instrumentation utilities as pure functions where possible for testability
- While integration tests are out of scope, write utilities that can be unit tested
- Follow existing Jest patterns for any utility tests

**Documentation:**
- Follow existing docs/ directory structure
- Create /docs/observability/ subdirectory for all OTel documentation
- Use consistent markdown formatting and code examples

## Technical Considerations

**NextAuth.js Callback Instrumentation:**
NextAuth.js callbacks (signIn, jwt, session) execute asynchronously and outside normal request handler flow. Instrumentation must use AsyncLocalStorage to access main span. The signIn callback is the primary target for authentication instrumentation.

**MongoDB Query Interception:**
Mongoose provides query middleware (pre/post hooks) that can be used to intercept queries. However, for OTel instrumentation, wrapping the MongoDB client directly provides more control. This spec implements a wrapper pattern around the existing connectDB function.

**Training Max Calculation Context:**
The workout generation flow calculates Training Max (90% of 1RM) which is the foundation for the 5/3/1 program. Capturing both 1RM inputs and calculated training maxes provides complete context for debugging workout generation issues.

**Performance Phase Timing Challenges:**
Accurate phase timing requires careful placement of startPhase/endPhase calls. Sequential phases (auth → validation → business logic → database) are straightforward, but overlapping operations (e.g., parallel database queries) require aggregation instead of child spans.

**Error Context Preservation:**
When recording errors, capture all relevant context at error time (user ID, operation parameters, retry counts, etc.) as error.context.* attributes. This context is often lost if only error.message is recorded.

**Wide Events Attribute Schema Evolution:**
The span-attributes.md documentation should be treated as a living document. As new attributes are added in follow-up manual instrumentation specs, update the schema documentation to maintain a comprehensive reference.

## Security Considerations

**User Identifier Security:**
- Use MongoDB ObjectId (user._id) as user.id attribute, not email address
- Do NOT add user.email, user.name, or user.image to spans (PII)
- Hash or omit any personally identifiable information

**OAuth Token Security:**
- NEVER log OAuth access tokens, refresh tokens, or ID tokens in span attributes
- Only log OAuth provider name (auth.provider=google)
- Do not log OAuth callback URLs which may contain temporary tokens

**1RM Data Sensitivity:**
- 1RM values are not sensitive data (they're workout metrics), safe to log
- However, avoid logging in a way that could personally identify users
- Aggregate statistics (average 1RM across users) should use user IDs for segmentation, not names

**Error Message Sanitization:**
- Review error.message values to ensure they don't leak sensitive data
- Database error messages may contain query details or data values - sanitize if needed
- Validation error messages should be safe (e.g., "Invalid input: squat 1RM must be positive")

**MongoDB Connection String:**
- Do NOT log MongoDB connection URI (contains credentials)
- Only log db.name and db.mongodb.cluster (sanitized cluster name without credentials)
- Ensure error messages from MongoDB connection failures don't expose credentials

## Success Metrics

1. **Wide Events Completeness**: 100% of instrumented endpoints have 50-80 attributes on main spans
2. **Error Slug Coverage**: 100% of try/catch blocks and validation failures have static error slugs
3. **Authentication Instrumentation**: 100% of user signin/creation events captured with auth.event, auth.provider, user.id attributes
4. **MongoDB Query Visibility**: 100% of API endpoints with database operations show stats.mongodb.query_count and stats.mongodb.query_duration_ms
5. **Workout Generation Context**: 100% of workout generation requests capture 1RM inputs and training max calculations
6. **Performance Phase Coverage**: 100% of instrumented endpoints have auth.duration_ms, validation.duration_ms, business_logic.duration_ms where applicable
7. **Documentation Completeness**: span-attributes.md documents 100% of attributes with examples and descriptions

## Open Questions

1. Should we instrument the JWT callback in NextAuth.js in addition to the signIn callback, or is signIn sufficient for authentication visibility?
2. Should MongoDB instrumentation create child spans for all queries in development environment (for debugging) but only for slow queries in production?
3. Should we add a health check endpoint that validates OTel instrumentation is working (e.g., creates a test span and verifies attributes)?
4. Should workout.generation attributes include individual set/rep details, or only high-level plan metadata (1RMs, training maxes, plan ID)?
5. Should we implement a "debug mode" environment variable that logs all span attributes to console for troubleshooting instrumentation?
