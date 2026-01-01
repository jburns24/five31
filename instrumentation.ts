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
