# Kubernetes Deployment

## OTel Collector Configuration

This application sends **100% of traces** to the collector. The collector should implement tail-based sampling to reduce data volume while retaining important traces.

**Expected Collector Endpoint:**
`http://otel-collector.observability.svc.cluster.local:4318/v1/traces`

**Required Collector Configuration:**
- OTLP HTTP receiver on port 4318
- Namespace: `observability`
- Service name: `otel-collector`

### Recommended Tail-Based Sampling Configuration

```yaml
processors:
  tail_sampling:
    decision_wait: 10s
    num_traces: 100000
    expected_new_traces_per_sec: 100
    policies:
      # Always sample errors
      - name: errors
        type: status_code
        status_code: {status_codes: [ERROR]}

      # Always sample slow requests (>2s)
      - name: slow-requests
        type: latency
        latency: {threshold_ms: 2000}

      # Sample 10% of successful fast requests
      - name: probabilistic
        type: probabilistic
        probabilistic: {sampling_percentage: 10}

service:
  pipelines:
    traces:
      receivers: [otlp]
      processors: [tail_sampling, batch]
      exporters: [jaeger, logging]
```

### Configuration Details

- **decision_wait:** Wait 10 seconds to collect all spans in a trace before deciding
- **Errors:** 100% retention for spans with status_code: ERROR
- **Slow requests:** 100% retention for requests taking >2000ms
- **Probabilistic:** 10% sampling for successful fast requests
- **True tail-based:** Decisions made AFTER seeing complete trace

### Deployment Notes

- Deploy OTel Collector in `observability` namespace
- Service name: `otel-collector`
- Expose OTLP HTTP receiver on port 4318
- Configure resource limits based on expected trace volume

## Deployment

Replace `{{ GIT_SHA }}` in deployment.yaml with actual git SHA before deploying:
```bash
export GIT_SHA=$(git rev-parse --short HEAD)
envsubst < deployment.yaml | kubectl apply -f -
```

## Environment Variables

All OTel environment variables are configured in the deployment manifest. Update deployment.yaml to change configuration.
