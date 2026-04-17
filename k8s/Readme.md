# k8s

All the Kubernetes will go for the job processing system. Apply everything with `kubectl apply -f k8s/` .The files are described below

## Files

```
k8s/
├── redis.yaml            # Redis — queue backend
├── service-a.yaml        # API service
├── service-b.yaml        # Worker (this is what the HPA targets)
├── service-c.yaml        # Stats + metrics
├── ingress.yaml          # Routes /submit and /status to service-a
├── hpa.yaml              # Autoscaler for service-b
├── service-monitor.yaml  # Tells Prometheus where to scrape
└── dashboard.json        # Grafana dashboard — import this manually
```

## Manifests

### redis.yaml

Single Redis 7 pod. All three services point at it via `REDIS_HOST=redis`. Just what BullMQ needs to work.

### service-a.yaml

The API. Traffic reaches it through the Ingress (see `ingress.yaml`) — the service itself is ClusterIP, so it's not directly exposed. Uses `imagePullPolicy: Never` since we're loading local images.

### ingress.yaml

This is how you actually reach service-a from outside the cluster. It routes `/submit` and `/status` to service-a on port 3000.

You need `ingress-nginx` running first:

```bash
minikube addons enable ingress
```

Then once everything is deployed, get the minikube IP and hit it directly:

```bash
minikube ip
# e.g. 192.168.49.2

curl http://192.168.49.2/submit -d '{"number": 40}' -H 'Content-Type: application/json'
```

### service-b.yaml

The worker has CPU resource requests and limits set because the HPA needs them to calculate utilizsation. Starts at 2 replicas and can go up to 10.

The service uses a named port (`http`) — the ServiceMonitor references it by that name.

### service-c.yaml

Aggregates queue stats and exposes them as Prometheus metrics. ClusterIP only, not externally accessible.

### hpa.yaml

Scales service-b between 2 and 10 replicas based on CPU. Threshold is set to 10% — intentionally low so you can see it trigger locally without effecting CPU. In Production make it to 60–70% for production.

Needs the Metrics Server:

```bash
minikube addons enable metrics-server
```

### service-monitor.yaml

Two ServiceMonitors — one for service-b, one for service-c. Prometheus picks these up and scrapes `/metrics` every 10 seconds.

The `release: monitoring` label must match your Helm release name.

### dashboard.json

Import this into Grafana to visualise the custom metrics — job counts, error rate, processing time, queue depth.

Grafana → Dashboards → Import → Upload JSON file from your vs code

## Setup

### Prometheus & Grafana

Install via Helm:

```bash
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
helm repo update

helm install monitoring prometheus-community/kube-prometheus-stack -n monitoring --create-namespace
```

Wait for everything to come up:

```bash
kubectl get pods -n monitoring
```

### Deploy the app

```bash
kubectl apply -f k8s/
kubectl get pods
```

## Port forwarding

```bash
# service-b — metrics of the processed jobs ,errors,processing time
kubectl port-forward svc/service-b 3001:3001

# service-c — queue stats
kubectl port-forward svc/service-c 3002:3002

# Prometheus
kubectl port-forward svc/monitoring-kube-prometheus-prometheus -n monitoring 9090:9090

# Grafana
kubectl port-forward svc/monitoring-grafana -n monitoring 3005:80
```

Grafana will be at `http://localhost:3005`. Default login is `admin` / `prom-operator`.

Password created in terminal by:

```bash
    $encoded = kubectl get secret monitoring-grafana -o jsonpath="{.data.admin-password}"
    [System.Text.Encoding]::UTF8.GetString([System.Convert]::FromBase64String($encoded))
```

> The service names above use `monitoring` as the Helm release name. If yours is different, run `helm list -n monitoring` to check and update to your name accordingly.

## Quick reference

```bash
# deploy
kubectl apply -f k8s/

# watch HPA scale service-b under load
kubectl get hpa -w

# tear down
kubectl delete -f k8s/
```
