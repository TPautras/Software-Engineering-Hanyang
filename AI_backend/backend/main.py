from fastapi import FastAPI
import numpy as np
import tensorflow as tf

app = FastAPI()
model = tf.keras.models.load_model("models/model_lstm.h5")

@app.post("/predict")
async def predict(payload: dict):
    seq = payload["sequence"]
    X = np.array([seq], dtype=np.float32)
    pred = model.predict(X)[0]
    return {
        "effect": float(pred[0]),
        "sideEffect": float(pred[1])
    }
