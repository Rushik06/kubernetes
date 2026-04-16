# k8s-monitoring

A distributed job processing system built to explore Kubernetes autoscaling and observability. You submit a Fibonacci job (my task which i have chosen) via HTTP, it gets queued in Redis, a worker picks it up, and you can watch the whole thing scale in Grafana in real time.
---

# Architecture diagram
<img width="1295" height="934" alt="kubernetes arch Diagram drawio (1)" src="https://github.com/user-attachments/assets/46c3dbaa-f6cf-451e-9036-5c0d39192a86" />

---

## Project structure

```
.
├── k8s/                   # all the kubernetes manifests
├── packages/
│   └── shared/            # shared logger + error handling used by all services
└── services/
    ├── service-a/         # the HTTP API — job submit + status check
    ├── service-b/         # the worker that actually runs fibonacci
    └── service-c/         # queue stats + metrics endpoint
```

## What each service does

**service-a** — accepts `POST /submit` with a number, throws it on the BullMQ queue, returns a job ID. Also has `GET /status/:id` so you can poll the result. Runs on port 3000.

**service-b** — listens to the queue and runs the Fibonacci calculation. Intentionally CPU-heavy so the HPA has something to react to. Exposes `/metrics` for Prometheus. Runs on port 3001.

**service-c** — connects to the same queue and aggregates counts (total, completed, failed, queue depth). Useful for the Grafana dashboard. Runs on port 3002.

## Prerequisites

- Node.js 20+ and pnpm 10+
- Docker
- A running cluster — minikube or kind works fine
- `kube-prometheus-stack` installed (for Prometheus + Grafana)
- Metrics Server installed (for HPA to work)

## Getting started

```bash
pnpm install
pnpm dev        # runs all services with tsx
pnpm build      # compiles everything
pnpm lint
pnpm format
```

## Building images

All Dockerfiles expect to be built from the **monorepo root** since they copy the shared package:

```bash
docker build -f services/service-a/Dockerfile -t service-a:latest .
docker build -f services/service-b/Dockerfile -t service-b:latest .
docker build -f services/service-c/Dockerfile -t service-c:latest .
```

If you're on minikube, load the images in before applying manifests or the pods will ImagePullBackOff:

```bash
minikube image load service-a:latest
minikube image load service-b:latest
minikube image load service-c:latest
```

## Deploying

```bash
kubectl apply -f k8s/
kubectl get pods   # wait for everything to be Running
kubectl get hpa    # watch service-b scale under load
```

Full breakdown of every manifest is in [`k8s/README.md`](./k8s/README.md).

## API

```
POST /submit         { "number": 40 }
→ 202  { "jobId": "...", "message": "Job submitted successfully" }

GET  /status/:id
→ 200  { "jobId": "...", "status": "completed", "result": 102334155 }
```

Status can be `waiting`, `active`, `completed`, or `failed`. Input is capped at 45 — anything higher and the recursive fib will take forever.

## Shared package

`packages/shared` is published internally as `@shared/utils`. All three services import from it:

- `AppError` — error class that carries a `statusCode`
- `errorHandler` — global Express error middleware
- `logger` — pino structured logger

## Git hooks

Husky runs two hooks:

- `pre-commit` — lint-staged runs ESLint + Prettier on anything staged
- `commit-msg` — commitlint enforces conventional commits (`feat:`, `fix:`, etc.)
