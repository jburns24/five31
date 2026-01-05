# Manual Validation Guide: OpenTelemetry Auto-Instrumentation (v2)

**Updated:** 2026-01-04
**Replaces:** Original validation that included application-level sampling tests

## What Changed
- Application now samples 100% of traces (no sampling logic)
- Sampling moved to OTel Collector (tail-based)
- Validation focuses on instrumentation, attributes, and export

## Prerequisites
- Application running (locally or dev environment)
- Access to application logs
- OTel Collector accessible (optional for full validation)

---

## Validation 1: SDK Initialization

**Purpose:** Verify OpenTelemetry SDK loads correctly

**Steps:**
```bash
npm run dev
```

**Expected Output:**
```
OpenTelemetry instrumentation initialized
```

**Success Criteria:**
- ✅ Console shows initialization message
- ✅ No errors related to OTel SDK
- ✅ Application starts successfully

---

## Validation 2: Span Creation (100% Sampling)

**Purpose:** Verify ALL requests create spans (no sampling at app level)

**Steps:**
```bash
# Make 10 consecutive requests
for i in {1..10}; do curl http://localhost:3000/api/health; done

# Enable debug logging to see spans
export OTEL_LOG_LEVEL=debug
npm run dev

# Make request
curl http://localhost:3000/api/health
```

**Expected Output:**
- Debug logs show span created for EVERY request
- No "Sampling decision: DROP" messages
- All requests result in spans

**Success Criteria:**
- ✅ 10 out of 10 requests create spans (100%)
- ✅ No requests dropped at application level
- ✅ Debug logs show span details for all requests

---

## Validation 3: Main Span Marking

**Purpose:** Verify wide events pattern marks main spans

**Steps:**
```bash
export OTEL_LOG_LEVEL=debug
npm run dev
curl http://localhost:3000/api/health
```

**Expected Output in Debug Logs:**
```javascript
attributes: {
  'main': true,  // ← Main span marked
  'http.method': 'GET',
  'http.url': 'http://localhost:3000/api/health',
  // ... other attributes
}
```

**Success Criteria:**
- ✅ Span has `main: true` attribute
- ✅ Span includes HTTP metadata (method, url, status_code)

---

## Validation 4: Service Metadata Enrichment

**Purpose:** Verify spans include service identification and deployment context

**Setup:**
```bash
export OTEL_SERVICE_NAME=five31-workout-tracker
export NODE_ENV=development
export GIT_SHA=$(git rev-parse --short HEAD)
export OTEL_LOG_LEVEL=debug
npm run dev
```

**Make Request:**
```bash
curl http://localhost:3000/api/health
```

**Expected Span Attributes:**
```javascript
{
  'service.name': 'five31-workout-tracker',
  'service.version': '<git-sha>',
  'service.environment': 'development',
  'deployment.age_minutes': <number>,
  'node.version': '<version>',
  'process.platform': 'darwin' // or linux
}
```

**Success Criteria:**
- ✅ All metadata attributes present
- ✅ Git SHA captured correctly
- ✅ Deployment age calculated
- ✅ Runtime info included

---

## Validation 5: Error Spans

**Purpose:** Verify error conditions create spans with error status

**Steps:**
```bash
# Trigger 404 error
curl http://localhost:3000/api/nonexistent-endpoint

# Check span attributes in debug logs
```

**Expected Attributes:**
```javascript
{
  'http.status_code': 404,
  'main': true,
  // Span status should be ERROR or unset (not SAMPLED)
}
```

**Success Criteria:**
- ✅ Error request creates span
- ✅ HTTP status code captured (404, 500, etc.)
- ✅ Span exported to collector

---

## Validation 6: Collector Export

**Purpose:** Verify traces export successfully to OTel Collector

**Setup:**
```bash
# Point to local collector (if running)
export OTEL_EXPORTER_OTLP_ENDPOINT=http://localhost:4318/v1/traces

# Or use k8s collector endpoint
export OTEL_EXPORTER_OTLP_ENDPOINT=http://otel-collector.observability.svc.cluster.local:4318/v1/traces
```

**Test Export:**
```bash
npm run dev
curl http://localhost:3000/api/health
```

**Check Collector Logs:**
```bash
# If using docker collector
docker logs <collector-container-id>

# Look for received traces from "five31-workout-tracker"
```

**Success Criteria:**
- ✅ Application logs show no export errors
- ✅ Collector logs show received traces
- ✅ Service name matches in collector logs

---

## Validation 7: Graceful Degradation (No Collector)

**Purpose:** Verify application continues running if collector unavailable

**Steps:**
```bash
# Point to non-existent endpoint
export OTEL_EXPORTER_OTLP_ENDPOINT=http://nonexistent:4318/v1/traces

npm run dev
curl http://localhost:3000/api/health
```

**Expected Behavior:**
- ⚠️ Warning logged about collector unavailability
- ✅ Application starts successfully (doesn't crash)
- ✅ API requests work normally
- ✅ Spans still created (just not exported)

**Success Criteria:**
- ✅ No application crashes
- ✅ Warning message about export failure
- ✅ Requests process successfully

---

## Validation 8: Kubernetes Deployment Configuration

**Purpose:** Verify k8s manifests have correct OTel configuration

**Steps:**
```bash
cat k8s/deployment.yaml
```

**Expected Environment Variables:**
```yaml
- name: OTEL_EXPORTER_OTLP_ENDPOINT
  value: "http://otel-collector.observability.svc.cluster.local:4318/v1/traces"
- name: OTEL_SERVICE_NAME
  value: "five31-workout-tracker"
- name: OTEL_LOG_LEVEL
  value: "info"
- name: GIT_SHA
  value: "{{ GIT_SHA }}"
- name: NODE_ENV
  value: "production"
```

**Success Criteria:**
- ✅ OTEL_EXPORTER_OTLP_ENDPOINT points to collector
- ✅ OTEL_SERVICE_NAME set correctly
- ✅ GIT_SHA included for version tracking
- ❌ NO OTEL_SAMPLING_* variables present (removed)

---

## Validation 9: Docker Build with Git SHA

**Purpose:** Verify Git SHA captured during Docker build

**Steps:**
```bash
export GIT_SHA=$(git rev-parse --short HEAD)
docker build --build-arg GIT_SHA=$GIT_SHA -t five31-test .

docker run -p 3000:3000 \
  -e OTEL_LOG_LEVEL=debug \
  -e NODE_ENV=production \
  five31-test

curl http://localhost:3000/api/health
```

**Expected Span Attributes:**
```javascript
{
  'service.version': '<actual-git-sha>',
  'service.environment': 'production'
}
```

**Success Criteria:**
- ✅ Git SHA appears in traces
- ✅ Matches actual commit SHA
- ✅ Service environment set correctly

---

## Validation 10: Wide Events Utility Functions

**Purpose:** Verify span enrichment utilities work correctly

**Test in API Route:**
```typescript
import { markAndGetMainSpan, setMainSpanAttributes } from '@/lib/otel/utils';

export async function GET() {
  markAndGetMainSpan();

  setMainSpanAttributes({
    'test.custom_attribute': 'test_value',
    'test.number': 42
  });

  return Response.json({ status: 'ok' });
}
```

**Make Request:**
```bash
curl http://localhost:3000/api/your-test-route
```

**Expected:**
- Custom attributes appear in span
- No errors in logs
- Span still includes standard attributes

**Success Criteria:**
- ✅ Custom attributes added to span
- ✅ Utility functions work without errors
- ✅ Main span correctly identified

---

## Quick Validation Checklist

Run this for fast verification:

```bash
# Setup
export OTEL_SERVICE_NAME=five31-workout-tracker
export OTEL_LOG_LEVEL=debug
export GIT_SHA=$(git rev-parse --short HEAD)
export NODE_ENV=development

# Start app
npm run dev

# Make test requests
curl http://localhost:3000/api/health  # Should succeed
curl http://localhost:3000/api/invalid # Should 404

# Check console output for:
# ☑ "OpenTelemetry instrumentation initialized"
# ☑ Spans created for BOTH requests (100% sampling)
# ☑ Spans have main=true attribute
# ☑ Service metadata present (name, version, environment)
# ☑ No "sampling decision" log messages
# ☑ No export errors (if collector running)
```

---

## Summary of Changes from v1

**Removed Validations:**
- ❌ Testing that errors sampled at 100% vs 10% (all now 100%)
- ❌ Testing probabilistic sampling (10% success requests)
- ❌ Checking for sample.rate attribute
- ❌ Verifying sampling decision logs

**New Validations:**
- ✅ Verify 100% of requests create spans
- ✅ Confirm no application-level sampling decisions
- ✅ Focus on span attributes and metadata enrichment
- ✅ Validate export to collector

**Rationale:**
Application no longer makes sampling decisions - it instruments and exports 100%. The OTel Collector handles tail-based sampling with complete trace data.
