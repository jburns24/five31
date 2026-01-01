# Task 1.0 Proof Artifacts: Install OpenTelemetry SDK and Create Instrumentation Configuration

## Package Installation

### package.json Dependencies

OpenTelemetry packages installed as dependencies:

```json
{
  "dependencies": {
    "@opentelemetry/api": "^1.10.0",
    "@opentelemetry/auto-instrumentations-node": "^0.67.3",
    "@opentelemetry/exporter-trace-otlp-http": "^0.208.0",
    "@opentelemetry/sdk-node": "^0.208.0",
    "mongoose": "^9.0.2",
    "next": "^14.2.0",
    "next-auth": "^4.24.0",
    "react": "^18.3.0",
    "react-dom": "^18.3.0",
    "recharts": "^3.6.0"
  }
}
```

## Instrumentation Entry Point

### File: /instrumentation.ts

The instrumentation file exists at the project root:

```typescript
import { NodeSDK } from '@opentelemetry/sdk-node';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';

export async function register() {
  try {
    // Configure OTLP Trace Exporter with endpoint from environment variable
    const traceExporter = new OTLPTraceExporter({
      url: process.env.OTEL_EXPORTER_OTLP_ENDPOINT || 'http://localhost:4318/v1/traces',
    });

    // Initialize NodeSDK with trace exporter, auto-instrumentations, and service name
    const sdk = new NodeSDK({
      traceExporter,
      instrumentations: [getNodeAutoInstrumentations()],
      serviceName: process.env.OTEL_SERVICE_NAME || 'five31-workout-tracker',
    });

    // Start the SDK
    sdk.start();

    console.log('OpenTelemetry instrumentation initialized');

    // Handle graceful shutdown
    process.on('SIGTERM', () => {
      sdk
        .shutdown()
        .then(() => console.log('OpenTelemetry SDK shut down successfully'))
        .catch((error) => console.error('Error shutting down OpenTelemetry SDK', error))
        .finally(() => process.exit(0));
    });
  } catch (error) {
    console.error('Failed to initialize OpenTelemetry SDK:', error);
    // Don't crash the application if OTel initialization fails
  }
}
```

## Console Output: Application Startup

Running `npm run dev` shows successful instrumentation initialization:

```
> nextjs-google-auth-app@0.1.0 dev
> next dev

  ▲ Next.js 14.2.35
  - Local:        http://localhost:3000
  - Environments: .env
  - Experiments (use with caution):
    · instrumentationHook

 ✓ Starting...
 ○ Compiling /instrumentation ...
 ✓ Compiled /instrumentation in 683ms (482 modules)
OpenTelemetry instrumentation initialized
 ✓ Ready in 1789ms
```

**Key Evidence:**
- ✅ "OpenTelemetry instrumentation initialized" message appears
- ✅ Application starts successfully without errors
- ✅ Instrumentation hook is enabled (shown in experiments section)

## Console Output: API Request Test

Testing with `curl http://localhost:3000/api/health`:

```json
{"status":"ok","mongodb":"connected"}
```

**Key Evidence:**
- ✅ Application responds to HTTP requests successfully
- ✅ API routes work without errors after instrumentation is loaded
- ✅ No crashes or instrumentation-related failures

## Environment Variables Configuration

### File: .env.example

OpenTelemetry environment variables documented:

```bash
# OpenTelemetry Configuration
# OTEL_EXPORTER_OTLP_ENDPOINT: The endpoint where traces are sent (OTLP HTTP)
# For local development, use http://localhost:4318/v1/traces
# For Kubernetes, use http://otel-collector.observability.svc.cluster.local:4318/v1/traces
OTEL_EXPORTER_OTLP_ENDPOINT=http://localhost:4318/v1/traces

# OTEL_SERVICE_NAME: The name of your service in distributed traces
OTEL_SERVICE_NAME=five31-workout-tracker

# OTEL_LOG_LEVEL: Logging level for OpenTelemetry SDK (error, warn, info, debug)
OTEL_LOG_LEVEL=info
```

**Key Evidence:**
- ✅ OTEL_EXPORTER_OTLP_ENDPOINT with default value and comments
- ✅ OTEL_SERVICE_NAME with default value
- ✅ OTEL_LOG_LEVEL with description
- ✅ Comments explain each variable's purpose

## Next.js Configuration

### File: next.config.js

Experimental instrumentation hook enabled with webpack configuration:

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  experimental: {
    instrumentationHook: true,
  },
  webpack: (config, { isServer }) => {
    if (isServer) {
      // Don't bundle OpenTelemetry packages for the browser
      config.externals = config.externals || [];
      config.externals.push('@opentelemetry/sdk-node');
      config.externals.push('@opentelemetry/auto-instrumentations-node');
      config.externals.push('@opentelemetry/instrumentation');
    } else {
      // Provide fallbacks for Node.js built-in modules on the client
      config.resolve.fallback = {
        ...config.resolve.fallback,
        stream: false,
        http: false,
        https: false,
        zlib: false,
        dns: false,
        net: false,
        tls: false,
        fs: false,
        child_process: false,
      };
    }
    return config;
  },
}

module.exports = nextConfig
```

**Key Evidence:**
- ✅ `experimental.instrumentationHook: true` enables instrumentation
- ✅ Webpack configuration handles server-side OTel packages correctly
- ✅ Client-side fallbacks prevent bundling issues with Node.js modules

## Summary

All proof artifacts demonstrate successful Task 1.0 completion:

1. ✅ OpenTelemetry packages installed in package.json
2. ✅ /instrumentation.ts file created with SDK initialization
3. ✅ Application logs "OpenTelemetry instrumentation initialized" on startup
4. ✅ Application starts and responds to requests without errors
5. ✅ Environment variables documented in .env.example
6. ✅ Next.js experimental instrumentation hook enabled
