# Drug Effect Prediction API

**Endpoint base URL:** `https://drug-api-691477198584.asia-northeast3.run.app/`

This API exposes a prediction service built on top of a PyTorch LSTM model. It takes a time series sequence as input and returns two regression outputs:

* `effect`
* `sideEffect`

The service also exposes Prometheus-compatible metrics and logs each prediction to Postgres (if configured).

---

## 1. Overview

The API loads:

* A trained LSTM model (`models/model_lstm.pt`)
* Scaling parameters for input and output (`.npy` files)

Input sequences are scaled before inference. Predictions are inverse-scaled back to the original domain.

There are two available endpoints:

* `GET /metrics` – Prometheus metrics
* `POST /predict` – Model inference

The application is built with FastAPI and served by Uvicorn.

---

## 2. Endpoints

### 2.1 `POST /predict`

**Description**
Runs the LSTM model on a provided 1-dimensional sequence. The sequence is scaled, fed into the model, and the outputs are inverse-scaled. The prediction is also logged to Postgres using `log_prediction`.

**Request body**

```json
{
  "sequence": [1.2, 1.5, 1.7, 1.3, 1.1]
}
```

**Response**

```json
{
  "effect": <float>,
  "sideEffect": <float>
}
```

**Notes**

* Input sequence must be numeric and convertible to `float32`.
* Model input shape: `(batch=1, seq_len, 1)`
* Outputs are two continuous values.

---

### 2.2 `GET /metrics`

**Description**
Returns the current Prometheus metrics collected by the service.
The route returns plain text in a Prometheus-compatible format.

**Example**

```
curl https://drug-api-691477198584.asia-northeast3.run.app/metrics
```

---

## 3. Model Description

### LSTM architecture

```
Input → LSTM(1 → h1=64) → LSTM(64 → h2=32) → Linear(32 → d=16) → Linear(16 → 2)
```

* Takes a 1-dimensional sequence of arbitrary length.
* Uses only the last hidden state of the second LSTM layer.
* Outputs a 2-dimensional vector.

### Scaling

Before inference:

```
scaled_x = (x - x_min) / x_scale
```

After inference:

```
y = pred_scaled * y_scale + y_min
```

The `.npy` scaling files must exist in the `models/` directory.

---

## 4. Logging

The function:

```
log_prediction(sequence, effect, side_effect)
```

is called after each inference.
It is responsible for writing logs to a Postgres instance. Configuration depends on the environment where the app is deployed.

If Postgres is unavailable, this function should be adapted to fail silently or switch to a fallback logging mechanism.

---

## 5. Deployment Notes

* The app must listen on the port defined by the environment variable `PORT` when running on Cloud Run.
* All model files (`.pt`, `.npy`) must be located in `models/` relative to the working directory.
* The service depends on:

  * `numpy`
  * `torch`
  * `fastapi`
  * `uvicorn`
  * Any dependencies used by the metrics and logging modules

Example Uvicorn command used in production:

```
uvicorn api.inference_main:app --host 0.0.0.0 --port $PORT
```

---

## 6. Example `curl` Usage

```
curl -X POST https://drug-api-691477198584.asia-northeast3.run.app/predict \
  -H "Content-Type: application/json" \
  -d '{"sequence": [0.1, 0.2, 0.15, 0.18]}'
```

---

## 7. File Structure (relevant parts)

```
AI_backend/
  api/
    inference_main.py
    prometheus_metrics.py
    postgres_logger.py
  models/
    model_lstm.pt
    scaler_x_scale.npy
    scaler_x_min.npy
    scaler_y_scale.npy
    scaler_y_min.npy
```
