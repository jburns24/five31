# 08 Questions Round 1 - OpenTelemetry Instrumentation

Please answer each question below (select one or more options, or add your own notes). Feel free to add additional context under any question.

## 1. OpenTelemetry Backend & Export Destination

Where should the OpenTelemetry traces and wide events be exported to?

- [ ] (A) Honeycomb.io (SaaS observability platform, optimized for wide events, excellent querying)
- [ ] (B) Jaeger (open-source tracing backend, self-hosted)
- [ ] (C) Zipkin (open-source tracing backend, self-hosted)
- [ ] (D) Console/STDOUT exporter (development/testing only, prints spans to console)
- [x] (E) OpenTelemetry Collector (generic collector that can forward to multiple backends)
- [ ] (F) Other (describe - e.g., Grafana Tempo, Datadog, New Relic, etc.)

**Selected Backend(s):**

**Additional Context:**

---

## 2. Deployment Environment & Infrastructure

What is the deployment environment for this application?

- [ ] (A) Local development only (Docker Compose with OTel collector sidecar)
- [ ] (B) AWS (ECS, EKS, Lambda, etc.) - please specify
- [ ] (C) Google Cloud Platform (Cloud Run, GKE, etc.) - please specify
- [ ] (D) Azure (AKS, App Service, etc.) - please specify
- [ ] (E) Vercel or other Next.js hosting platform
- [x] (F) Self-hosted k8s cluster with ingress controller and central OTel collector
- [ ] (G) Other (describe)

**Selected Environment(s):**

**Additional Deployment Details:**

---

## 3. Wide Events Scope & Attribute Richness

How comprehensive should the wide events be (number of attributes per span)?

- [] (A) Minimal (20-30 attributes: service metadata, HTTP basics, user ID, basic timing)
- [x] (B) Standard (50-80 attributes: above + feature flags, business context, DB stats, error details)
- [ ] (C) Rich (100-150 attributes: above + detailed performance breakdowns, cache stats, upstream service timing)
- [ ] (D) Comprehensive (150+ attributes: capture everything possible for deep analysis)

**Selected Richness Level:**

**Specific Attributes You Want to Track:**
(e.g., workout plan cycle number, PR detection results, MongoDB query counts, etc.)

---

## 4. Manual Instrumentation Priority

Which user flows should be manually instrumented first? (Select all that apply)

- [x] (A) User creation (Google OAuth sign-in, User model creation). Create a spec for all other flows as well for follow-up.
- [ ] (B) User login (NextAuth.js authentication flow)
- [ ] (C) Generate workout plan (POST /api/workout/generate - 1RM input to plan creation)
- [ ] (D) Workout tracking (fetch current plan, complete sets, record AMRAP)
- [ ] (E) Personal record detection (AMRAP submission + PR calculation)
- [ ] (F) Statistics calculations (account/stats page data aggregation)
- [ ] (G) MongoDB operations (query counts, durations, connection pooling)
- [ ] (H) All of the above

**Selected Flows (in priority order):**

1. User creation/login
2. mongodb operations
3. Generate workout plan

**Additional Context:**

---

## 5. Error Handling & Error Slugs

Should we implement static error slugs (e.g., "err-workout-generation-failed") for all error paths?

- [x] (A) Yes, implement error slugs for all try/catch blocks and validation failures
- [ ] (B) Yes, but only for critical user-facing errors (auth failures, payment-like operations)
- [ ] (C) No, use dynamic error messages only
- [ ] (D) Other (describe approach)

**Selected Approach:**

**Specific Error Categories to Track:**
(e.g., auth errors, MongoDB errors, validation errors, external API errors)

---

## 6. Client-Side (Browser) Instrumentation

Should we instrument client-side React components with OpenTelemetry?

- [] (A) Yes, instrument browser-side fetch calls and user interactions (button clicks, form submissions)
- [ ] (B) No, server-side instrumentation only
- [ ] (C) Partial - only instrument critical client-side operations (specify which ones)
- [x] (D) Not in initial implementation, but plan for it in future

**Selected Approach:**

**Client-Side Operations to Instrument (if applicable):**

---

## 7. Sampling Strategy

What sampling strategy should be used to manage data volume and costs?

- [ ] (A) No sampling - capture 100% of requests (fine for low-traffic apps)
- [x] (B) Tail-based sampling (always keep errors, slow requests, specific user types; sample successful fast requests)
- [ ] (C) Head-based sampling (simple percentage sampling, e.g., 10% of all requests)
- [ ] (D) Dynamic sampling based on environment (100% in dev, 10% in production)

**Selected Strategy:**

**Sampling Rules (if applicable):**
- Always keep: errors (status >= 400), slow requests (> X ms), specific user types?
- Sample rate for successful fast requests:

---

## 8. Performance Metrics & Breakdown

Which performance breakdowns should be tracked on each request?

- [ ] (A) End-to-end request duration only
- [x] (B) Authentication duration, business logic duration, database duration
- [ ] (C) Detailed per-operation timing (each MongoDB query, each API call, each calculation step)
- [ ] (D) Aggregate stats only (total query count, total DB time, cache hit rate)

**Selected Level:**

**Specific Operations to Time:**

---

## 9. Feature Flag Integration

Are there existing feature flags in the application, or should we add feature flag support?

- [ ] (A) No feature flags currently, not needed for this instrumentation
- [ ] (B) Add feature flag support as part of instrumentation (e.g., LaunchDarkly, Flagsmith, simple env vars)
- [ ] (C) Existing feature flags already in place (specify system)
- [x] (D) Plan to add later, skip for now

**Feature Flag System (if applicable):**

**Example Flags to Track:**
(e.g., new_workout_algorithm, dark_mode_enabled, beta_stats_page)

---

## 10. Testing & Validation

How should the OpenTelemetry instrumentation be tested and validated?

- [ ] (A) Manual testing only (run app locally, check console/backend for spans)
- [ ] (B) Add Jest unit tests for span attribute validation
- [ ] (C) Add integration tests that verify spans are created for each user flow
- [ ] (D) Visual verification in observability backend (Honeycomb/Jaeger UI)
- [ ] (E) Combination of automated tests + visual verification
- [x] (F) Other (describe): Plan to add integration tests after initial implementation, skip for now

**Selected Approach:**

**Acceptance Criteria for Testing:**

---

## 11. Documentation & Developer Experience

What level of documentation should be created for the instrumentation?

- [ ] (A) Inline code comments only
- [ ] (B) README section explaining how to view traces and query wide events
- [x] (C) Comprehensive guide including example queries, dashboards, and alerting setup as a separate markdown file
- [ ] (D) Developer onboarding docs + incident response playbook

**Selected Level:**

**Specific Documentation Needs:**

---

## 12. Security & Sensitive Data

What sensitive data should be excluded from spans and traces?

- [x] (A) Never log: passwords, API keys, auth tokens, credit card numbers, PII
- [ ] (B) Redact: email addresses, user IDs (hash them instead of plaintext)
- [ ] (C) Exclude: request/response bodies entirely
- [ ] (D) Custom redaction policy (describe)

**Selected Policy:**

**Specific Fields to Redact/Exclude:**

---

## 13. Cost & Data Volume Expectations

What are your expectations around trace data volume and associated costs?

- [x] (A) Low traffic (<1000 req/day) - cost not a concern
- [ ] (B) Moderate traffic (1000-10000 req/day) - use sampling to manage costs
- [ ] (C) High traffic (>10000 req/day) - aggressive sampling needed
- [ ] (D) Unknown traffic - implement flexible sampling that can be adjusted

**Selected Expectation:**

**Budget Constraints (if any):**

---

## 14. Deployment Strategy

How should the instrumentation be deployed?

- [ ] (A) All at once - auto-instrumentation + manual instrumentation in single release
- [ ] (B) Phased approach - auto-instrumentation first, then progressively add manual instrumentation. Create two specs for each phase.
- [ ] (C) Behind feature flag - enable instrumentation gradually per environment
- [ ] (D) Canary deployment - roll out to percentage of traffic first

**Selected Strategy:**

**Rollout Plan:**

---

## 15. Wide Events Philosophy Adoption

Based on the research from loggingsucks.com, how strictly should we follow the wide events pattern?

- [ ] (A) Strictly follow - one comprehensive span per request per service, 50+ attributes minimum
- [x] (B) Hybrid approach - wide events for main spans, use child spans sparingly for complex operations
- [ ] (C) Gradually adopt - start with basic wide events, expand attributes over time based on debugging needs
- [ ] (D) OpenTelemetry standard approach - use child spans liberally, don't focus on wide events

**Selected Philosophy:**

**Rationale:**
Want to experiment with wide events but keep some flexibility for complex operations. Aiming to comparing and contrasting both approaches over time.
---

## Additional Questions or Requirements

Please add any additional requirements, constraints, or questions you have about the OpenTelemetry instrumentation:
