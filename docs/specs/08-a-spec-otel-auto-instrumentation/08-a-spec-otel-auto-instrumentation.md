# 08-a-spec-otel-auto-instrumentation.md

## Introduction/Overview

This specification covers the implementation of OpenTelemetry (OTel) auto-instrumentation for the five31 workout tracker application. Auto-instrumentation will automatically capture telemetry data for HTTP requests, Next.js API routes, and fetch calls without requiring manual span creation. This establishes the foundation for observability by providing baseline distributed tracing capabilities and setting up the infrastructure for wide events pattern implementation. The instrumentation will export telemetry data to a central OpenTelemetry Collector running in the Kubernetes cluster.

## Goals

- Implement OpenTelemetry SDK with auto-instrumentation for Next.js server-side operations
- Configure trace export to central OTel Collector in Kubernetes cluster
- Establish wide events middleware pattern with main span marking and context storage
- Enrich main spans with service metadata (name, version, environment, deployment info)
- Set up tail-based sampling configuration to retain errors, slow requests, and sample successful requests
- Provide comprehensive documentation for querying and analyzing traces

## User Stories

**As a developer**, I want OpenTelemetry auto-instrumentation enabled so that I can automatically capture distributed traces for all HTTP requests and API calls without manually creating spans.

**As a developer**, I want a wide events middleware pattern established so that I can progressively enrich main request spans with business context throughout request processing.

**As an SRE**, I want traces exported to our central OTel Collector so that I can aggregate observability data from multiple services in our Kubernetes cluster.

**As a developer investigating production issues**, I want service metadata (version, environment, deployment age) on every trace so that I can correlate errors with specific deployments.

**As a developer**, I want comprehensive documentation with example queries so that I can effectively use the observability data to debug issues.

## Demoable Units of Work

### Unit 1: OpenTelemetry SDK Installation and Basic Configuration

**Purpose:** Install OTel packages and create foundational configuration files to enable auto-instrumentation for Node.js/Next.js

**Functional Requirements:**
- The system shall install @opentelemetry/sdk-node, @opentelemetry/auto-instrumentations-node, @opentelemetry/exporter-trace-otlp-http packages
- The system shall create an instrumentation configuration file (instrumentation.ts) that initializes the OTel SDK before Next.js application code loads
- The system shall configure auto-instrumentation for http, https, and fetch operations
- The system shall configure the OTLP HTTP exporter to send traces to a configurable collector endpoint
- The system shall use Next.js experimental instrumentation hook to load OTel SDK on server startup
- The system shall add required environment variables to .env.example (OTEL_EXPORTER_OTLP_ENDPOINT, OTEL_SERVICE_NAME, etc.)

**Proof Artifacts:**
- Package.json: Shows @opentelemetry dependencies installed
- File exists: /instrumentation.ts demonstrates instrumentation entry point created
- Console output: Application startup logs show "OpenTelemetry instrumentation loaded" message demonstrates SDK initialized
- CLI command: `NODE_OPTIONS='--require ./instrumentation.ts' npm run dev` starts application without errors demonstrates instrumentation doesn't break application

### Unit 2: Wide Events Middleware and Main Span Enrichment

**Purpose:** Establish middleware pattern for marking main request spans and storing references for downstream enrichment (wide events pattern)

**Functional Requirements:**
- The system shall create a Next.js middleware file (middleware.ts) that runs on every API request
- The system shall mark the auto-instrumented HTTP span with attribute `main=true` to distinguish it from child spans
- The system shall store a reference to the main span in AsyncLocalStorage context for reliable access throughout request lifecycle
- The system shall create a utility function `setMainSpanAttributes()` that retrieves the main span from context and adds attributes
- The system shall add service metadata attributes to every main span: service.name, service.version, service.environment
- The system shall handle cases where no active span exists gracefully (no-op if span unavailable)

**Proof Artifacts:**
- File exists: /middleware.ts demonstrates middleware created
- File exists: /lib/otel/utils.ts demonstrates utility functions for span enrichment
- Console/OTel Collector: Trace JSON output shows `main: true` attribute on HTTP spans demonstrates main span marking works
- Console/OTel Collector: Trace shows service.name, service.version, service.environment attributes demonstrates metadata enrichment works

### Unit 3: Service Metadata and Deployment Context

**Purpose:** Enrich main spans with comprehensive service metadata including Git SHA, deployment timestamp, and environment details

**Functional Requirements:**
- The system shall capture Git SHA from environment variable (GIT_SHA) or generate from git command during build
- The system shall add service.version attribute with Git SHA value to all main spans
- The system shall add service.environment attribute with environment name (development, staging, production)
- The system shall calculate and add deployment.age_minutes attribute based on container start time
- The system shall add runtime metadata: node.version, process.pid, process.platform
- The system shall update Dockerfile to capture GIT_SHA as build arg and expose as environment variable
- The system shall update docker-compose.yml to pass GIT_SHA and environment variables

**Proof Artifacts:**
- Dockerfile: Shows ARG GIT_SHA and ENV GIT_SHA=${GIT_SHA} demonstrates build-time capture
- docker-compose.yml: Shows environment variables passed to container demonstrates configuration
- Console/OTel Collector: Trace shows service.version with git SHA demonstrates version tracking works
- Console/OTel Collector: Trace shows deployment.age_minutes demonstrates deployment tracking works

### Unit 4: Tail-Based Sampling Configuration

**Purpose:** Implement sampling strategy to retain important traces (errors, slow requests) while sampling successful fast requests

**Functional Requirements:**
- The system shall configure tail-based sampling processor in application code (not collector)
- The system shall always retain traces where http.status_code >= 400 (errors)
- The system shall always retain traces where duration > P95 threshold (configurable, default 2000ms)
- The system shall sample successful fast requests at configurable rate (default 10%)
- The system shall add sample.rate attribute to all spans indicating sampling decision (e.g., 100 for "1 in 100")
- The system shall make sampling thresholds configurable via environment variables (OTEL_SAMPLING_SLOW_THRESHOLD_MS, OTEL_SAMPLING_SUCCESS_RATE)
- The system shall log sampling decisions at debug level for troubleshooting

**Proof Artifacts:**
- File exists: /lib/otel/sampler.ts demonstrates custom sampler implementation
- Code inspection: sampler.ts shows logic for error retention, slow request retention, and probabilistic sampling
- Console output: Debug logs show "Sampled: true/false" with reason demonstrates sampling decisions logged
- OTel Collector: Traces show sample.rate attribute demonstrates sampling metadata captured

### Unit 5: Kubernetes and OTel Collector Integration

**Purpose:** Configure application to export traces to central OTel Collector in Kubernetes cluster and update deployment manifests

**Functional Requirements:**
- The system shall configure OTLP exporter to send traces to http://otel-collector.observability.svc.cluster.local:4318/v1/traces (configurable via env var)
- The system shall set appropriate timeout for trace export (default 30 seconds)
- The system shall implement retry logic with exponential backoff for failed exports
- The system shall add Kubernetes deployment environment variables for OTEL_EXPORTER_OTLP_ENDPOINT
- The system shall add Kubernetes readiness probe that checks OTel SDK initialization status
- The system shall document expected OTel Collector configuration (OTLP receiver on port 4318)
- The system shall handle collector unavailability gracefully (log warning, don't crash application)

**Proof Artifacts:**
- File: instrumentation.ts shows exporter configuration with endpoint from env var demonstrates flexible configuration
- k8s-deployment.yaml: Shows OTEL_EXPORTER_OTLP_ENDPOINT environment variable demonstrates k8s integration
- Console output: Application logs show "Connected to OTel Collector" or warning if unavailable demonstrates connectivity handling
- OTel Collector logs: Shows received traces from five31 service demonstrates end-to-end export works

### Unit 6: Comprehensive Documentation

**Purpose:** Create detailed documentation for developers to understand, query, and troubleshoot OTel instrumentation

**Functional Requirements:**
- The system shall create a documentation file /docs/observability/otel-guide.md
- The documentation shall explain the wide events pattern and hybrid approach used
- The documentation shall provide example queries for common debugging scenarios (errors by endpoint, slow requests, deployment correlation)
- The documentation shall document all environment variables with descriptions and defaults
- The documentation shall provide troubleshooting guide for common instrumentation issues
- The documentation shall include examples of how to view traces in OTel Collector/backend
- The documentation shall document the tail-based sampling strategy and how to adjust thresholds

**Proof Artifacts:**
- File exists: /docs/observability/otel-guide.md demonstrates documentation created
- File content: Documentation shows 10+ example queries demonstrates practical guidance
- File content: Documentation shows environment variables table demonstrates configuration reference
- File content: Documentation shows troubleshooting section demonstrates operational guidance

## Non-Goals (Out of Scope)

1. **Manual instrumentation of specific user flows** - User creation, login, workout plan generation, and MongoDB operations will be manually instrumented in follow-up spec (08-b)
2. **Client-side (browser) instrumentation** - React component and browser-side fetch instrumentation is planned for future implementation
3. **Custom metrics and logs** - This spec focuses on distributed tracing only; metrics and structured logging are out of scope
4. **Feature flag integration** - Feature flag tracking will be added in future when feature flag system is implemented
5. **Integration tests** - Automated testing of instrumentation will be added after initial implementation
6. **OTel Collector configuration** - This spec assumes OTel Collector is already deployed in k8s cluster; collector setup is out of scope
7. **Alerting and dashboards** - Creation of alerts and monitoring dashboards in observability backend is out of scope

## Design Considerations

**Wide Events Middleware Pattern:**
The middleware implementation will follow the pattern researched from loggingsucks.com, storing main span references in AsyncLocalStorage context to enable reliable attribute enrichment throughout request processing. This hybrid approach uses wide events for main spans while allowing child spans for complex operations.

**Next.js Instrumentation Hook:**
Next.js 13.4+ provides an experimental instrumentation hook (instrumentation.ts) that runs once when the server starts. This is the recommended way to initialize OpenTelemetry before application code loads.

**Span Context Reliability:**
Storing a reference to the main span in context prevents issues where `trace.getActiveSpan()` returns child spans instead of the main request span. This pattern is critical for the wide events approach.

## Repository Standards

This implementation should follow existing repository patterns:

**TypeScript Standards:**
- Use strict TypeScript configuration from tsconfig.json
- Follow existing import path alias pattern (@/lib, @/components)
- Maintain type safety for all OTel configuration and utility functions

**Code Organization:**
- Place OTel utilities in /lib/otel/ directory (sampler.ts, utils.ts)
- Use Next.js middleware.ts at root for request interception
- Use instrumentation.ts at root for OTel SDK initialization (Next.js convention)

**Environment Configuration:**
- Add all OTel environment variables to .env.example with comments
- Use dotenv pattern for local development
- Document required vs optional environment variables

**Testing Conventions:**
- While integration tests are out of scope initially, structure code to be testable
- Use Jest patterns from existing test files for any utility function tests
- Follow existing test file naming convention (*.test.ts)

**Docker and Deployment:**
- Follow multi-stage Dockerfile pattern from existing Dockerfile
- Capture build metadata (Git SHA) as Docker build args
- Use standalone Next.js output mode (already configured)
- Add health check considerations for OTel SDK initialization

## Technical Considerations

**OpenTelemetry Auto-Instrumentation:**
The @opentelemetry/auto-instrumentations-node package provides automatic instrumentation for common Node.js libraries including http, https, and fetch. This requires loading the SDK before application code, which Next.js supports via the instrumentation hook.

**AsyncLocalStorage for Context:**
Node.js AsyncLocalStorage provides a way to store request-scoped data without explicitly passing it through function parameters. This is essential for reliably accessing the main span from anywhere in the request lifecycle.

**OTLP HTTP Exporter:**
The OTLP (OpenTelemetry Protocol) HTTP exporter sends traces to the OTel Collector over HTTP. This is more firewall-friendly than gRPC and well-supported in Kubernetes environments.

**Tail-Based Sampling Implementation:**
While tail-based sampling is typically implemented in the OTel Collector, this spec implements basic sampling logic in the application to demonstrate the pattern. The collector can provide more sophisticated sampling if needed.

**Next.js Server vs Edge Runtime:**
Auto-instrumentation only works in the Node.js runtime, not Edge runtime. All instrumented API routes must use Node.js runtime (this is the default for Next.js API routes).

**Environment Variables:**
Required environment variables:
- OTEL_EXPORTER_OTLP_ENDPOINT (default: http://otel-collector.observability.svc.cluster.local:4318)
- OTEL_SERVICE_NAME (default: five31-workout-tracker)
- GIT_SHA (captured at build time)
- NODE_ENV (development, staging, production)

Optional environment variables:
- OTEL_SAMPLING_SLOW_THRESHOLD_MS (default: 2000)
- OTEL_SAMPLING_SUCCESS_RATE (default: 0.1 for 10%)
- OTEL_LOG_LEVEL (default: info)

## Security Considerations

**Sensitive Data Exclusion:**
- Never log passwords, API keys, auth tokens, session cookies, or PII in span attributes
- The middleware shall not capture request/response bodies automatically (only metadata)
- User identifiers (user.id) will be added in manual instrumentation phase, not in auto-instrumentation
- Email addresses from NextAuth.js shall not be added to spans (will use user ID only in manual instrumentation)

**OTel Collector Security:**
- Communication with OTel Collector should use internal Kubernetes service networking (cluster.local)
- In production, consider mTLS between application and collector (out of scope for initial implementation)
- Ensure OTel Collector is configured to sanitize any sensitive data before forwarding to backends

**Environment Variable Security:**
- Do not commit .env file with actual OTEL_EXPORTER_OTLP_ENDPOINT values
- Use Kubernetes secrets for sensitive collector credentials if required
- Document which environment variables may contain sensitive values

## Success Metrics

1. **Instrumentation Coverage**: 100% of API routes automatically instrumented with HTTP spans
2. **Trace Export Success Rate**: >99% of traces successfully exported to OTel Collector
3. **Performance Overhead**: <5ms p99 latency overhead from instrumentation
4. **Span Attribute Completeness**: 100% of main spans include service.name, service.version, service.environment, and main=true attributes
5. **Sampling Accuracy**: 100% of error traces (status >= 400) retained, 100% of slow traces (>threshold) retained
6. **Developer Adoption**: Documentation enables developers to write 5+ useful queries without additional assistance

## Open Questions

1. Should we implement automatic trace correlation with external services (e.g., MongoDB Atlas, Google OAuth) via trace context propagation, or handle that in manual instrumentation phase?
2. Should the tail-based sampling threshold for "slow requests" be based on a fixed millisecond value or calculated dynamically from P95/P99?
3. Should we add a /health endpoint that reports OTel SDK initialization status, or rely on application logs?
4. Should we implement span batching configuration to reduce network calls to OTel Collector, or use default batching?
