# Spec 08-a Addendum: Application-Level Sampling Removal

**Date:** 2026-01-04
**Status:** Implementation Complete
**Related Spec:** 08-a-spec-otel-auto-instrumentation.md

## Context

Unit 4 of Spec 08-a implemented application-level "tail-based sampling." However, investigation revealed critical issues:

1. **Architectural Flaw:** Implementation was head-based sampling (decisions at span creation) not tail-based
2. **Broken Logic:** Slow request detection never worked - duration unavailable at sampling time
3. **Incorrect Design:** True tail-based sampling requires complete trace data, only available in collector

## Root Cause

OpenTelemetry's `Sampler.shouldSample()` is called at span **creation** time:
- Duration: Unknown (span hasn't completed)
- HTTP status: Often unknown (request not processed yet)
- Result: `slowThresholdMs` config was read but never usable

## Decision

Move to OpenTelemetry best practices:
- **Application:** Use `ParentBasedSampler` with `AlwaysOnSampler` (100% sampling)
- **Collector:** Implement true tail-based sampling with complete trace data
- **Benefits:** Simpler application code, correct architectural separation

## Changes Made

### Code Deletions
- Deleted `/lib/otel/sampler.ts` (70 lines)
- Removed sampler import/usage from `instrumentation.ts`
- Replaced with `ParentBasedSampler({ root: new AlwaysOnSampler() })`

### Configuration Removals
- Removed `OTEL_SAMPLING_SLOW_THRESHOLD_MS` from all configs
- Removed `OTEL_SAMPLING_SUCCESS_RATE` from all configs
- Updated `.env.example`, `k8s/deployment.yaml`, `docker-compose.yml`

### Documentation Updates
- Updated `docs/observability/otel-guide.md` to explain collector-based sampling
- Marked Unit 4 as DEPRECATED in spec, tasks, and validation docs
- Created this addendum for historical reference
- Added collector configuration guidance to `k8s/README.md`

## Validation

See: `08-a-validation-auto-instrumentation-v2.md` for updated validation steps focusing on:
- 100% of spans exported to collector
- Span attributes correctly populated
- No application-level sampling decisions
