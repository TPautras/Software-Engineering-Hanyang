from fastapi import FastAPI
import numpy as np
import tensorflow as tf
from api.prometheus_metrics import metrics
from api.postgres_logger import log_prediction

model = tf.keras.models.load_model("models/model_lstm.h5")
app = FastAPI()

@app.get("/metrics")
async def prom():
    return metrics()

@app.post("/predict")
async def predict(payload: dict):
    seq = payload["sequence"]
    X = np.array([seq], dtype=np.float32)
    pred = model.predict(X)[0]
    log_prediction(seq, float(pred[0]), float(pred[1]))
    return {"effect": float(pred[0]), "sideEffect": float(pred[1])}
