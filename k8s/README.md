# Kubernetes Deployment

## OTel Collector Configuration

This application expects an OpenTelemetry Collector to be running in the cluster:

**Expected Collector Endpoint:**
`http://otel-collector.observability.svc.cluster.local:4318/v1/traces`

**Required Collector Configuration:**
- OTLP HTTP receiver on port 4318
- Namespace: `observability`
- Service name: `otel-collector`

## Deployment

Replace `{{ GIT_SHA }}` in deployment.yaml with actual git SHA before deploying:
```bash
export GIT_SHA=$(git rev-parse --short HEAD)
envsubst < deployment.yaml | kubectl apply -f -
```

## Environment Variables

All OTel environment variables are configured in the deployment manifest. Update deployment.yaml to change configuration.
