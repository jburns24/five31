import { trace, Span, SpanStatusCode } from '@opentelemetry/api';
import { getMainSpan, runWithMainSpan } from './context';

/**
 * Mark the currently active span as the main span and enrich it with initial attributes
 * This should be called at the beginning of API route handlers
 * @returns The main span if successfully marked, otherwise undefined
 */
export function markAndGetMainSpan(): Span | undefined {
  const activeSpan = trace.getActiveSpan();

  if (!activeSpan) {
    if (process.env.OTEL_LOG_LEVEL === 'debug') {
      console.debug('markAndGetMainSpan: No active span found');
    }
    return undefined;
  }

  // Mark this as the main span
  activeSpan.setAttribute('main', true);

  // Add basic service metadata
  activeSpan.setAttribute('service.name', process.env.OTEL_SERVICE_NAME || 'five31-workout-tracker');
  activeSpan.setAttribute('service.environment', process.env.NODE_ENV || 'development');

  return activeSpan;
}

/**
 * Set attributes on the main span stored in async context
 * @param attributes Object containing attributes to add to the main span
 * @returns true if attributes were set, false if no main span exists
 */
export function setMainSpanAttributes(
  attributes: Record<string, string | number | boolean | undefined>
): boolean {
  // Try to get from context first, fallback to active span
  let mainSpan = getMainSpan();

  if (!mainSpan) {
    mainSpan = trace.getActiveSpan();
  }

  if (!mainSpan) {
    // Log at debug level - this is not an error condition
    if (process.env.OTEL_LOG_LEVEL === 'debug') {
      console.debug('setMainSpanAttributes: No main span in context, skipping attribute setting');
    }
    return false;
  }

  // Set each attribute on the main span
  Object.entries(attributes).forEach(([key, value]) => {
    if (value !== undefined) {
      mainSpan!.setAttribute(key, value);
    }
  });

  return true;
}

/**
 * Get the currently active span from OpenTelemetry trace context
 * @returns The active span if it exists, otherwise undefined
 */
export function getActiveSpan(): Span | undefined {
  const activeSpan = trace.getActiveSpan();
  return activeSpan;
}

/**
 * Record an exception on the main span
 * @param error The error to record
 * @param fatal Whether the error is fatal (sets span status to ERROR)
 */
export function recordMainSpanError(error: Error, fatal: boolean = true): void {
  const mainSpan = getMainSpan();

  if (!mainSpan) {
    if (process.env.OTEL_LOG_LEVEL === 'debug') {
      console.debug('recordMainSpanError: No main span in context, skipping error recording');
    }
    return;
  }

  mainSpan.recordException(error);

  if (fatal) {
    mainSpan.setStatus({
      code: SpanStatusCode.ERROR,
      message: error.message,
    });
  }
}

/**
 * Add an event to the main span
 * @param name Event name
 * @param attributes Optional attributes for the event
 */
export function addMainSpanEvent(
  name: string,
  attributes?: Record<string, string | number | boolean>
): void {
  const mainSpan = getMainSpan();

  if (!mainSpan) {
    if (process.env.OTEL_LOG_LEVEL === 'debug') {
      console.debug('addMainSpanEvent: No main span in context, skipping event');
    }
    return;
  }

  mainSpan.addEvent(name, attributes);
}
