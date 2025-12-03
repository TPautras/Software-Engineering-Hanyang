from prometheus_client import CollectorRegistry, Counter, generate_latest

registry = CollectorRegistry()
pred_count = Counter("predictions_total", "predictions", registry=registry)

def metrics():
    pred_count.inc()
    return generate_latest(registry)
