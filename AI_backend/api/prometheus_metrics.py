from prometheus_client import Counter, generate_latest

prediction_counter = Counter("predictions_total", "Total predictions made")

def metrics():
    return generate_latest()
