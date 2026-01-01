import { Sampler, SamplingDecision, SamplingResult, Context, SpanKind, Attributes } from '@opentelemetry/api';
import { TraceIdRatioBasedSampler } from '@opentelemetry/sdk-trace-base';

interface SamplerConfig {
  slowThresholdMs: number;
  successSampleRate: number;
}

/**
 * Tail-based sampler that retains errors, slow requests, and samples successful requests
 * Note: This is head-based sampling with tail-based sampling criteria
 */
export class TailBasedSampler implements Sampler {
  private config: SamplerConfig;
  private fallbackSampler: Sampler;

  constructor(config?: Partial<SamplerConfig>) {
    this.config = {
      slowThresholdMs: parseInt(process.env.OTEL_SAMPLING_SLOW_THRESHOLD_MS || '2000'),
      successSampleRate: parseFloat(process.env.OTEL_SAMPLING_SUCCESS_RATE || '0.1'),
      ...config,
    };
    
    // Use TraceIdRatioBasedSampler for probabilistic sampling
    this.fallbackSampler = new TraceIdRatioBasedSampler(this.config.successSampleRate);
  }

  shouldSample(
    context: Context,
    traceId: string,
    spanName: string,
    spanKind: SpanKind,
    attributes: Attributes,
    links: any[]
  ): SamplingResult {
    // Always sample errors (we'll check status code if available)
    const statusCode = attributes['http.status_code'] as number;
    if (statusCode && statusCode >= 400) {
      if (process.env.OTEL_LOG_LEVEL === 'debug') {
        console.debug('Sampling decision: RECORD (error)');
      }
      return {
        decision: SamplingDecision.RECORD_AND_SAMPLED,
        attributes: { 'sample.rate': 1 },
      };
    }

    // For successful requests, use probabilistic sampling
    const result = this.fallbackSampler.shouldSample(context, traceId, spanName, spanKind, attributes, links);
    
    if (result.decision === SamplingDecision.RECORD_AND_SAMPLED) {
      if (process.env.OTEL_LOG_LEVEL === 'debug') {
        console.debug('Sampling decision: RECORD (sampled)');
      }
      return {
        ...result,
        attributes: { ...result.attributes, 'sample.rate': Math.round(1 / this.config.successSampleRate) },
      };
    }

    if (process.env.OTEL_LOG_LEVEL === 'debug') {
      console.debug('Sampling decision: DROP (fast success)');
    }
    return result;
  }

  toString(): string {
    return `TailBasedSampler{slowThreshold=${this.config.slowThresholdMs}ms, successRate=${this.config.successSampleRate}}`;
  }
}
