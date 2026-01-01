# 08-a Tasks: OpenTelemetry Auto-Instrumentation

## Relevant Files

### Files to Create

- `/instrumentation.ts` - Next.js instrumentation hook that initializes OTel SDK before application loads
- `/middleware.ts` - Next.js middleware for marking main spans and enriching with metadata
- `/lib/otel/context.ts` - AsyncLocalStorage context management for storing main span references
- `/lib/otel/utils.ts` - Utility functions for span enrichment (setMainSpanAttributes, etc.)
- `/lib/otel/metadata.ts` - Service metadata collection (version, environment, deployment age, runtime info)
- `/lib/otel/sampler.ts` - Custom tail-based sampler implementation
- `/k8s/deployment.yaml` - Kubernetes deployment manifest with OTel environment variables
- `/docs/observability/otel-guide.md` - Comprehensive OTel documentation with examples and troubleshooting

### Files to Modify

- `package.json` - Add OpenTelemetry dependencies (@opentelemetry/sdk-node, @opentelemetry/auto-instrumentations-node, @opentelemetry/exporter-trace-otlp-http, @opentelemetry/api)
- `.env.example` - Add OTel environment variables (OTEL_EXPORTER_OTLP_ENDPOINT, OTEL_SERVICE_NAME, OTEL_LOG_LEVEL, OTEL_SAMPLING_SLOW_THRESHOLD_MS, OTEL_SAMPLING_SUCCESS_RATE)
- `Dockerfile` - Add ARG GIT_SHA and ENV GIT_SHA to capture build version
- `docker-compose.yml` - Add GIT_SHA and NODE_ENV environment variables
- `next.config.js` - Enable experimental instrumentation feature (if not already enabled)

### Notes

- The instrumentation.ts file uses Next.js 13.4+ experimental instrumentation hook
- Middleware runs on all API routes by default; use matcher if specific routes need to be excluded
- AsyncLocalStorage provides request-scoped storage without passing context through function parameters
- Follow existing TypeScript strict mode and path alias patterns (@/lib)
- Use Jest testing patterns from existing tests if writing utility tests (out of scope for initial implementation)
- OTel packages should be added as regular dependencies (not devDependencies) since they're needed at runtime

## Tasks

### [x] 1.0 Install OpenTelemetry SDK and Create Instrumentation Configuration

Install OpenTelemetry packages and create the foundational instrumentation.ts file that initializes the OTel SDK before Next.js application code loads. This establishes the core auto-instrumentation for HTTP requests, fetch calls, and configures the OTLP HTTP exporter to send traces to the OTel Collector.

#### 1.0 Proof Artifact(s)

- File: `package.json` shows @opentelemetry/sdk-node, @opentelemetry/auto-instrumentations-node, @opentelemetry/exporter-trace-otlp-http, @opentelemetry/api packages installed demonstrates dependencies added
- File: `/instrumentation.ts` exists at project root demonstrates instrumentation entry point created
- Console output: Running `npm run dev` shows "OpenTelemetry instrumentation initialized" log message demonstrates SDK loads on startup
- Console output: Application starts without errors and responds to HTTP requests demonstrates instrumentation doesn't break application
- File: `.env.example` shows OTEL_EXPORTER_OTLP_ENDPOINT, OTEL_SERVICE_NAME, OTEL_LOG_LEVEL environment variables demonstrates configuration documented

#### 1.0 Tasks

- [x] 1.1 Install OpenTelemetry npm packages using `npm install --save @opentelemetry/sdk-node @opentelemetry/auto-instrumentations-node @opentelemetry/exporter-trace-otlp-http @opentelemetry/api`
- [x] 1.2 Create `/instrumentation.ts` at project root (same level as package.json)
- [x] 1.3 In instrumentation.ts, import NodeSDK from '@opentelemetry/sdk-node', getNodeAutoInstrumentations from '@opentelemetry/auto-instrumentations-node', and OTLPTraceExporter from '@opentelemetry/exporter-trace-otlp-http'
- [x] 1.4 Configure OTLPTraceExporter with endpoint from environment variable OTEL_EXPORTER_OTLP_ENDPOINT (default: 'http://localhost:4318/v1/traces')
- [x] 1.5 Initialize NodeSDK with traceExporter, instrumentations (getNodeAutoInstrumentations()), and serviceName from OTEL_SERVICE_NAME (default: 'five31-workout-tracker')
- [x] 1.6 Export a register() function that calls sdk.start() and logs "OpenTelemetry instrumentation initialized"
- [x] 1.7 Add error handling to register() to catch and log SDK initialization failures without crashing the application
- [x] 1.8 Enable Next.js experimental instrumentation in next.config.js by adding `experimental: { instrumentationHook: true }` if not already present
- [x] 1.9 Update `.env.example` to add OTEL_EXPORTER_OTLP_ENDPOINT, OTEL_SERVICE_NAME, and OTEL_LOG_LEVEL with comments explaining each variable
- [x] 1.10 Test by running `npm run dev` and verifying "OpenTelemetry instrumentation initialized" appears in console
- [x] 1.11 Test by making a request to any API route (e.g., GET /api/health) and verifying the application responds without errors

---

### [x] 2.0 Implement Wide Events Middleware Pattern

Create Next.js middleware that intercepts all API requests, marks the auto-instrumented HTTP span as the "main" span, and stores a reference in AsyncLocalStorage context. Implement utility functions that allow downstream code to reliably enrich the main span with attributes throughout request processing (wide events pattern).

#### 2.0 Proof Artifact(s)

- File: `/middleware.ts` exists at project root demonstrates Next.js middleware created
- File: `/lib/otel/utils.ts` exists demonstrates utility functions for span enrichment created
- File: `/lib/otel/context.ts` exists demonstrates AsyncLocalStorage context management created
- Console/OTel Collector: Trace JSON from any API request shows `main: true` attribute on HTTP span demonstrates main span marking works
- Console/OTel Collector: Trace shows `service.name`, `service.version`, `service.environment` attributes on main span demonstrates metadata enrichment works
- Code inspection: `setMainSpanAttributes()` utility function handles missing spans gracefully (no crashes) demonstrates error handling

#### 2.0 Tasks

- [x] 2.1 Create `/lib/otel/` directory for OTel utilities
- [x] 2.2 Create `/lib/otel/context.ts` and implement AsyncLocalStorage for storing main span references
- [x] 2.3 In context.ts, create a context key constant MAIN_SPAN_CONTEXT_KEY and export getMainSpan() and setMainSpan() functions
- [x] 2.4 Create `/lib/otel/utils.ts` for span enrichment utilities
- [x] 2.5 In utils.ts, implement setMainSpanAttributes(attributes: Record<string, any>) that retrieves main span from context and adds attributes
- [x] 2.6 In utils.ts, add error handling to setMainSpanAttributes() - if no main span exists, log at debug level and return without error
- [x] 2.7 In utils.ts, implement getActiveSpan() helper that safely retrieves current span using trace.getActiveSpan()
- [x] 2.8 Create `/middleware.ts` at project root for Next.js middleware
- [x] 2.9 In middleware.ts, import trace and context from '@opentelemetry/api'
- [x] 2.10 In middleware.ts, implement middleware function that gets active span, marks it with main=true attribute, and stores in AsyncLocalStorage
- [x] 2.11 In middleware.ts, add basic service metadata to main span: service.name (from env), service.environment (from NODE_ENV)
- [x] 2.12 In middleware.ts, configure matcher to run on all /api/* routes: `export const config = { matcher: '/api/:path*' }`
- [x] 2.13 Test middleware by making request to /api/health and checking console output or trace export shows main=true attribute
- [x] 2.14 Test setMainSpanAttributes() by calling it from an API route handler and verifying attributes appear on main span

---

### [ ] 3.0 Add Service Metadata and Deployment Context

Enrich all main spans with comprehensive service metadata including Git SHA (service version), deployment timestamp, environment name, and runtime details. Update Docker build and deployment configuration to capture and pass Git SHA as an environment variable.

#### 3.0 Proof Artifact(s)

- File: `Dockerfile` shows `ARG GIT_SHA` and `ENV GIT_SHA=${GIT_SHA}` demonstrates build-time Git SHA capture
- File: `docker-compose.yml` shows `GIT_SHA` and `NODE_ENV` passed to container demonstrates environment configuration
- Console/OTel Collector: Trace shows `service.version` attribute with git SHA value (e.g., "abc123def") demonstrates version tracking works
- Console/OTel Collector: Trace shows `service.environment` attribute with environment name (development/staging/production) demonstrates environment tracking works
- Console/OTel Collector: Trace shows `deployment.age_minutes` attribute demonstrates deployment age calculation works
- Console/OTel Collector: Trace shows `node.version`, `process.platform` attributes demonstrates runtime metadata captured

#### 3.0 Tasks

- [ ] 3.1 Create `/lib/otel/metadata.ts` for metadata collection functions
- [ ] 3.2 In metadata.ts, implement getServiceVersion() that returns GIT_SHA from env var, or falls back to git command `git rev-parse --short HEAD`, or 'unknown'
- [ ] 3.3 In metadata.ts, implement getServiceEnvironment() that returns NODE_ENV or 'development'
- [ ] 3.4 In metadata.ts, implement getDeploymentAgeMinutes() that calculates minutes since process start time (process.uptime() / 60)
- [ ] 3.5 In metadata.ts, implement getRuntimeMetadata() that returns object with node.version (process.version), process.pid (process.pid), process.platform (process.platform)
- [ ] 3.6 In metadata.ts, export getAllServiceMetadata() that returns combined metadata object with all above values
- [ ] 3.7 Update `/middleware.ts` to import getAllServiceMetadata() and add all metadata to main span using setMainSpanAttributes()
- [ ] 3.8 Update `Dockerfile` builder stage to add `ARG GIT_SHA` before RUN npm run build
- [ ] 3.9 Update `Dockerfile` builder stage to add `ENV GIT_SHA=${GIT_SHA}` to make build arg available as environment variable
- [ ] 3.10 Update `Dockerfile` runner stage to add `ENV GIT_SHA=${GIT_SHA}` to persist in final image
- [ ] 3.11 Update `docker-compose.yml` to add build args section with GIT_SHA: `build: { context: ., dockerfile: Dockerfile, args: { GIT_SHA: ${GIT_SHA:-dev} } }`
- [ ] 3.12 Update `docker-compose.yml` environment section to add GIT_SHA and NODE_ENV variables
- [ ] 3.13 Test locally by setting GIT_SHA env var and running dev server, verify service.version appears in traces
- [ ] 3.14 Test Docker build with `docker build --build-arg GIT_SHA=$(git rev-parse --short HEAD) -t five31-test .` and verify GIT_SHA is captured

---

### [ ] 4.0 Implement Tail-Based Sampling Configuration

Create a custom sampler that implements tail-based sampling strategy: always retain error traces (status >= 400) and slow requests (duration > threshold), while probabilistically sampling successful fast requests. Add sample.rate attribute to all spans and make sampling thresholds configurable via environment variables.

#### 4.0 Proof Artifact(s)

- File: `/lib/otel/sampler.ts` exists demonstrates custom sampler implementation
- Code inspection: `sampler.ts` shows logic for error retention (status >= 400), slow request retention (duration > threshold), and probabilistic sampling demonstrates sampling strategy implemented
- File: `.env.example` shows `OTEL_SAMPLING_SLOW_THRESHOLD_MS=2000` and `OTEL_SAMPLING_SUCCESS_RATE=0.1` demonstrates sampling configuration documented
- Console output: Debug logs show "Sampling decision: RECORD (error)" or "Sampling decision: DROP (fast success)" demonstrates sampling decisions logged
- Console/OTel Collector: Traces show `sample.rate` attribute (e.g., 100 for "1 in 100") demonstrates sampling metadata captured
- Manual test: Trigger error request (e.g., invalid route), verify trace is retained 100% demonstrates error retention works

#### 4.0 Tasks

- [ ] 4.1 Create `/lib/otel/sampler.ts` for custom sampler implementation
- [ ] 4.2 In sampler.ts, import Sampler, SamplingResult from '@opentelemetry/sdk-trace-base'
- [ ] 4.3 In sampler.ts, create TailBasedSampler class that implements Sampler interface
- [ ] 4.4 In TailBasedSampler constructor, accept config object with slowThresholdMs (default 2000) and successSampleRate (default 0.1)
- [ ] 4.5 In TailBasedSampler constructor, read config from environment variables OTEL_SAMPLING_SLOW_THRESHOLD_MS and OTEL_SAMPLING_SUCCESS_RATE
- [ ] 4.6 Implement shouldSample() method that examines span attributes to determine sampling decision
- [ ] 4.7 In shouldSample(), always return RECORD_AND_SAMPLED if http.status_code >= 400 (errors)
- [ ] 4.8 In shouldSample(), always return RECORD_AND_SAMPLED if span duration > slowThresholdMs (slow requests)
- [ ] 4.9 In shouldSample(), for successful fast requests, return RECORD_AND_SAMPLED with probability = successSampleRate, otherwise return NOT_RECORD
- [ ] 4.10 In shouldSample(), add sample.rate attribute to traceState indicating sample rate (1 for always, 10 for 10%, 100 for 1%)
- [ ] 4.11 Add debug logging in shouldSample() that logs sampling decisions with reason (error/slow/sampled/dropped)
- [ ] 4.12 Update `/instrumentation.ts` to import and use TailBasedSampler in NodeSDK configuration
- [ ] 4.13 Update `.env.example` to add OTEL_SAMPLING_SLOW_THRESHOLD_MS and OTEL_SAMPLING_SUCCESS_RATE with comments
- [ ] 4.14 Test by triggering an error request (e.g., POST to invalid route) and verifying trace is retained
- [ ] 4.15 Test by making multiple successful fast requests and verifying only ~10% are retained (if sample rate is 0.1)

---

### [ ] 5.0 Configure Kubernetes and OTel Collector Integration

Configure the OTLP exporter to send traces to the central OTel Collector in the Kubernetes cluster. Create or update Kubernetes deployment manifest with OTel environment variables. Implement graceful handling of collector unavailability (log warnings, don't crash application).

#### 5.0 Proof Artifact(s)

- File: `/instrumentation.ts` shows exporter configuration reading `OTEL_EXPORTER_OTLP_ENDPOINT` from environment variable demonstrates flexible configuration
- File: `/k8s/deployment.yaml` or similar k8s manifest shows `OTEL_EXPORTER_OTLP_ENDPOINT` environment variable set to collector URL demonstrates k8s integration configured
- Console output: Application logs show "OTel exporter initialized: http://otel-collector.observability.svc.cluster.local:4318" demonstrates exporter connection attempt logged
- Console output: If collector unavailable, logs show warning "Failed to export traces to OTel Collector" but application continues running demonstrates graceful degradation
- OTel Collector logs: Shows received traces from five31-workout-tracker service demonstrates end-to-end trace export works (if collector available)
- File: `.env.example` or k8s docs show default collector endpoint documented demonstrates configuration guidance

#### 5.0 Tasks

- [ ] 5.1 Update `/instrumentation.ts` to read OTEL_EXPORTER_OTLP_ENDPOINT from env var with default 'http://localhost:4318/v1/traces'
- [ ] 5.2 In instrumentation.ts, configure OTLPTraceExporter with timeout (30 seconds) and retry configuration
- [ ] 5.3 In instrumentation.ts, add try-catch around exporter initialization to handle collector connection failures gracefully
- [ ] 5.4 In instrumentation.ts, log exporter initialization with endpoint URL: "OTel exporter initialized: {endpoint}"
- [ ] 5.5 In instrumentation.ts, if exporter fails, log warning "Failed to initialize OTel exporter" but continue application startup
- [ ] 5.6 Create `/k8s/` directory for Kubernetes manifests
- [ ] 5.7 Create `/k8s/deployment.yaml` with basic Kubernetes Deployment manifest for five31-workout-tracker
- [ ] 5.8 In deployment.yaml, add container environment variables including OTEL_EXPORTER_OTLP_ENDPOINT: 'http://otel-collector.observability.svc.cluster.local:4318/v1/traces'
- [ ] 5.9 In deployment.yaml, add OTEL_SERVICE_NAME, GIT_SHA, NODE_ENV environment variables
- [ ] 5.10 In deployment.yaml, add readiness probe that checks /api/health endpoint
- [ ] 5.11 Create `/k8s/README.md` documenting expected OTel Collector configuration (OTLP receiver on port 4318)
- [ ] 5.12 Update `.env.example` to document default OTEL_EXPORTER_OTLP_ENDPOINT for local development vs k8s
- [ ] 5.13 Test locally by setting OTEL_EXPORTER_OTLP_ENDPOINT to non-existent endpoint and verifying application starts with warning
- [ ] 5.14 If OTel Collector available, test by deploying to k8s (or using kubectl port-forward) and verifying traces appear in collector

---

### [ ] 6.0 Create Comprehensive OTel Documentation

Create detailed documentation explaining the wide events pattern, providing example queries for debugging, documenting all environment variables, and including troubleshooting guidance. This enables developers to effectively use the observability data without additional assistance.

#### 6.0 Proof Artifact(s)

- File: `/docs/observability/otel-guide.md` exists demonstrates documentation created
- File content: Documentation includes "Wide Events Pattern" section explaining hybrid approach (wide main spans + sparse child spans) demonstrates pattern explained
- File content: Documentation shows 10+ example queries with explanations (e.g., "Find slow requests by endpoint", "Group errors by deployment version") demonstrates practical guidance provided
- File content: Documentation includes environment variables table with name, description, default value, and required/optional demonstrates configuration reference complete
- File content: Documentation includes "Troubleshooting" section with common issues and solutions demonstrates operational guidance provided
- File content: Documentation includes "Viewing Traces" section with examples for console output and OTel Collector/backend demonstrates trace inspection guidance provided
- File content: Documentation includes "Sampling Strategy" section explaining tail-based sampling and how to adjust thresholds demonstrates sampling configuration explained

#### 6.0 Tasks

- [ ] 6.1 Create `/docs/observability/` directory for observability documentation
- [ ] 6.2 Create `/docs/observability/otel-guide.md` with basic structure and table of contents
- [ ] 6.3 Add "Overview" section explaining auto-instrumentation and what traces capture
- [ ] 6.4 Add "Wide Events Pattern" section explaining the hybrid approach: wide main spans (50-80 attributes) with sparse child spans for complex operations
- [ ] 6.5 Add "Architecture" section with diagram or description of trace flow: Application → OTLP Exporter → OTel Collector
- [ ] 6.6 Add "Example Queries" section with 10+ practical queries:
  - Find all requests to specific endpoint
  - Find slow requests (duration > threshold)
  - Group errors by HTTP status code
  - Find errors by deployment version
  - Calculate P95/P99 latency by endpoint
  - Find requests from specific environment
  - Analyze deployment age correlation with errors
  - Find requests with specific sample rate
  - Trace requests across services (if applicable)
  - Debug specific user flow with trace ID
- [ ] 6.7 Add "Environment Variables" section with table including: OTEL_EXPORTER_OTLP_ENDPOINT, OTEL_SERVICE_NAME, OTEL_LOG_LEVEL, OTEL_SAMPLING_SLOW_THRESHOLD_MS, OTEL_SAMPLING_SUCCESS_RATE, GIT_SHA, NODE_ENV
- [ ] 6.8 For each environment variable, document: name, description, default value, required/optional, example value
- [ ] 6.9 Add "Viewing Traces" section with examples of trace JSON output and how to read span attributes
- [ ] 6.10 Add "Sampling Strategy" section explaining tail-based sampling: always retain errors and slow requests, sample successful fast requests
- [ ] 6.11 Add "Troubleshooting" section with common issues: SDK not initializing, traces not exporting, collector unavailable, missing attributes, sampling not working
- [ ] 6.12 For each troubleshooting issue, provide symptoms, diagnosis steps, and solution
- [ ] 6.13 Add "Local Development" section explaining how to run with console exporter or local collector
- [ ] 6.14 Add "Production Deployment" section explaining k8s configuration and expected collector setup
- [ ] 6.15 Review documentation for completeness, clarity, and accuracy
- [ ] 6.16 Add links to relevant OpenTelemetry documentation and Next.js instrumentation docs
