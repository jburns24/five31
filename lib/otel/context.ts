import { AsyncLocalStorage } from 'async_hooks';
import { Span } from '@opentelemetry/api';

// Context key for storing the main span reference
export const MAIN_SPAN_CONTEXT_KEY = Symbol('main-span');

// AsyncLocalStorage instance for request-scoped storage
const mainSpanStorage = new AsyncLocalStorage<Span>();

/**
 * Get the main span from the current async context
 * @returns The main span if it exists, otherwise undefined
 */
export function getMainSpan(): Span | undefined {
  return mainSpanStorage.getStore();
}

/**
 * Set the main span in the current async context
 * @param span The span to store as the main span
 */
export function setMainSpan(span: Span): void {
  // Note: This function is typically called from middleware
  // The actual storage is set using mainSpanStorage.run() in middleware
}

/**
 * Run a function with the main span set in async context
 * @param span The main span to set
 * @param fn The function to run with the span in context
 * @returns The result of the function
 */
export function runWithMainSpan<T>(span: Span, fn: () => T): T {
  return mainSpanStorage.run(span, fn);
}

/**
 * Get the AsyncLocalStorage instance for advanced use cases
 * @returns The main span storage instance
 */
export function getMainSpanStorage(): AsyncLocalStorage<Span> {
  return mainSpanStorage;
}
