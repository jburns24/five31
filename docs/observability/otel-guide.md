# OpenTelemetry Instrumentation Guide

## Table of Contents
- [Overview](#overview)
- [Wide Events Pattern](#wide-events-pattern)
- [Architecture](#architecture)
- [Example Queries](#example-queries)
- [Environment Variables](#environment-variables)
- [Viewing Traces](#viewing-traces)
- [Sampling Strategy](#sampling-strategy)
- [Troubleshooting](#troubleshooting)
- [Local Development](#local-development)
- [Production Deployment](#production-deployment)

## Overview

This application uses OpenTelemetry auto-instrumentation to automatically capture distributed traces for:
- HTTP requests and responses
- Next.js API routes
- Fetch calls to external services
- MongoDB operations (via auto-instrumentation)

Traces include comprehensive service metadata (version, environment, runtime info) and support tail-based sampling to reduce data volume while retaining important traces.

## Wide Events Pattern

This implementation uses a hybrid "wide events" approach:

**Wide Main Spans:** Each request has a main span enriched with 50-80 attributes including:
- Service metadata (version, environment, deployment age)
- Runtime information (Node.js version, PID, platform)
- Request details (method, URL, status code)
- Business context (can be added via `setMainSpanAttributes()`)

**Sparse Child Spans:** Complex operations can create child spans when needed, but most context lives on the main span.

**Usage in API Routes:**
```typescript
import { markAndGetMainSpan, setMainSpanAttributes } from '@/lib/otel/utils';

export async function GET(request: Request) {
  // Mark the main span at the start of your handler
  markAndGetMainSpan();
  
  // Add business context throughout processing
  setMainSpanAttributes({
    'user.id': userId,
    'operation.type': 'workout_plan_generation',
  });
  
  return Response.json({ data });
}
```

## Architecture

```
Application (Next.js)
  └─> OpenTelemetry SDK
      └─> Auto-Instrumentations (HTTP, Fetch, MongoDB)
      └─> OTLP HTTP Exporter
          └─> OTel Collector (observability namespace)
              └─> Backend (Jaeger, Tempo, etc.)
```

## Example Queries

### Find all requests to specific endpoint
```
http.target = "/api/workouts"
```

### Find slow requests
```
duration > 2000ms
```

### Group errors by HTTP status code
```
http.status_code >= 400
GROUP BY http.status_code
```

### Find errors by deployment version
```
http.status_code >= 500
GROUP BY service.version
```

### Calculate P95/P99 latency by endpoint
```
QUANTILE(duration, 0.95) BY http.target
QUANTILE(duration, 0.99) BY http.target
```

### Find requests from specific environment
```
service.environment = "production"
```

### Analyze deployment age correlation with errors
```
http.status_code >= 500
GROUP BY deployment.age_minutes
```

### Find requests with specific sample rate
```
sample.rate = 1  // All sampled (errors/slow)
sample.rate = 10 // 10% sampled
```

### Trace requests across services
```
trace_id = "abc123..."
```

### Debug specific user flow
```
user.id = "12345"
operation.type = "workout_plan_generation"
```

## Environment Variables

| Variable | Description | Default | Required | Example |
|----------|-------------|---------|----------|---------|
| `OTEL_EXPORTER_OTLP_ENDPOINT` | OTLP HTTP endpoint URL | `http://localhost:4318/v1/traces` | Yes | `http://otel-collector.observability.svc.cluster.local:4318/v1/traces` |
| `OTEL_SERVICE_NAME` | Service name in traces | `five31-workout-tracker` | Yes | `five31-workout-tracker` |
| `OTEL_LOG_LEVEL` | SDK logging level | `info` | No | `debug`, `info`, `warn`, `error` |
| `OTEL_SAMPLING_SLOW_THRESHOLD_MS` | Slow request threshold | `2000` | No | `3000` |
| `OTEL_SAMPLING_SUCCESS_RATE` | Success sampling rate | `0.1` | No | `0.05` (5%) |
| `GIT_SHA` | Git commit SHA (version) | `unknown` | No | `abc123def` |
| `NODE_ENV` | Environment name | `development` | Yes | `production`, `staging` |

## Viewing Traces

### Console Output (Development)
Traces are logged when OTEL_LOG_LEVEL=debug. Look for span exports in console.

### OTel Collector
Traces are sent to the collector configured in OTEL_EXPORTER_OTLP_ENDPOINT.

### Example Trace JSON
```json
{
  "traceId": "abc123...",
  "spanId": "def456...",
  "name": "GET /api/workouts",
  "attributes": {
    "main": true,
    "service.name": "five31-workout-tracker",
    "service.version": "abc123d",
    "service.environment": "production",
    "deployment.age_minutes": 45,
    "node.version": "v20.11.0",
    "http.method": "GET",
    "http.url": "/api/workouts",
    "http.status_code": 200,
    "sample.rate": 10
  }
}
```

## Sampling Strategy

**Tail-Based Sampling Criteria:**

1. **Always Retain Errors:** Any request with `http.status_code >= 400` is sampled at 100%
2. **Always Retain Slow Requests:** Requests taking longer than `OTEL_SAMPLING_SLOW_THRESHOLD_MS` are sampled at 100%
3. **Probabilistic Sampling:** Successful fast requests are sampled at `OTEL_SAMPLING_SUCCESS_RATE` (default 10%)

**Adjusting Thresholds:**
```bash
# Sample only 5% of successful fast requests
export OTEL_SAMPLING_SUCCESS_RATE=0.05

# Increase slow request threshold to 3 seconds
export OTEL_SAMPLING_SLOW_THRESHOLD_MS=3000
```

## Troubleshooting

### SDK not initializing

**Symptoms:** No "OpenTelemetry instrumentation initialized" log message

**Diagnosis:**
```bash
# Check if instrumentation hook is enabled
grep instrumentationHook next.config.js

# Check for errors in startup logs
npm run dev 2>&1 | grep -i error
```

**Solution:** Ensure `experimental.instrumentationHook: true` in next.config.js

### Traces not exporting

**Symptoms:** Application runs but no traces appear in collector

**Diagnosis:**
```bash
# Test collector connectivity
curl -v http://localhost:4318/v1/traces

# Check OTEL environment variables
env | grep OTEL
```

**Solution:** Verify OTEL_EXPORTER_OTLP_ENDPOINT is correct and collector is reachable

### Collector unavailable

**Symptoms:** Warning logs about failed exports

**Diagnosis:** Check application logs for "Failed to export traces"

**Solution:** Application continues running. Fix collector and traces will resume automatically.

### Missing attributes

**Symptoms:** Traces don't include expected metadata

**Diagnosis:** Check if `markAndGetMainSpan()` is called in API route handlers

**Solution:** Add `markAndGetMainSpan()` call at the start of route handlers

### Sampling not working

**Symptoms:** All traces sampled or none sampled

**Diagnosis:**
```bash
# Check sampling configuration
env | grep OTEL_SAMPLING

# Enable debug logging
export OTEL_LOG_LEVEL=debug
npm run dev
```

**Solution:** Verify OTEL_SAMPLING_* variables are set correctly

## Local Development

**Using Console Exporter (no collector needed):**
```bash
# Traces will be logged to console
export OTEL_LOG_LEVEL=debug
npm run dev
```

**Using Local Collector:**
```bash
# Run OTel Collector locally
docker run -p 4318:4318 otel/opentelemetry-collector

# Configure application
export OTEL_EXPORTER_OTLP_ENDPOINT=http://localhost:4318/v1/traces
npm run dev
```

## Production Deployment

**Kubernetes Configuration:**

1. Deploy OTel Collector in `observability` namespace
2. Update `k8s/deployment.yaml` with actual GIT_SHA:
   ```bash
   export GIT_SHA=$(git rev-parse --short HEAD)
   envsubst < k8s/deployment.yaml | kubectl apply -f -
   ```
3. Verify deployment:
   ```bash
   kubectl logs -n default deployment/five31-workout-tracker | grep "OpenTelemetry"
   ```

**Expected Collector Configuration:**
- OTLP HTTP receiver on port 4318
- Service endpoint: `otel-collector.observability.svc.cluster.local`

## References

- [OpenTelemetry Documentation](https://opentelemetry.io/docs/)
- [Next.js Instrumentation](https://nextjs.org/docs/app/building-your-application/optimizing/instrumentation)
- [OTLP Specification](https://opentelemetry.io/docs/specs/otlp/)
