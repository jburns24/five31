# k8s/

Base Kubernetes manifests for five31. Owned by this repo; consumed as a kustomize base by overlays (e.g. the homelab cluster's `manifests/apps/53one/`).

## Layout

- `namespace.yaml` — `five31` namespace
- `deployment.yaml` — Deployment with image pin, OTel env, probes, resources
- `service.yaml` — ClusterIP `five31-service` (:80 → :3000)
- `kustomization.yaml` — base kustomization

The image pin is bumped by the release workflow on tag.

## Build

```bash
kustomize build k8s/
```

## Overlay contract

Overlays are expected to provide:

- A `Secret` named `five31-env` (consumed via `envFrom`) supplying app secrets (NextAuth, MongoDB URI, Google OAuth, etc.)
- Ingress / external routing — not provided here because it's cluster-specific (Traefik, certResolver, host).

The OTel endpoint defaults to the homelab collector at `otel-collector.observability.svc.cluster.local:4318`. Override via overlay if your cluster differs.
