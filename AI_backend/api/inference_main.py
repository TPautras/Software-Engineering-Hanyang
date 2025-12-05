from fastapi import FastAPI, Response
import numpy as np
import torch
import torch.nn as nn
from api.prometheus_metrics import metrics

x_scale = np.load("models/scaler_x_scale.npy")
x_min = np.load("models/scaler_x_min.npy")
y_scale = np.load("models/scaler_y_scale.npy")
y_min = np.load("models/scaler_y_min.npy")

def scale_x(x):
    return (x - x_min) / x_scale

def inverse_scale_y(y):
    return y * y_scale + y_min

class LSTMModel(nn.Module):
    def __init__(self, h1, h2, d):
        super().__init__()
        self.lstm1 = nn.LSTM(1, h1, batch_first=True)
        self.lstm2 = nn.LSTM(h1, h2, batch_first=True)
        self.fc1 = nn.Linear(h2, d)
        self.fc2 = nn.Linear(d, 2)
    def forward(self, x):
        x, _ = self.lstm1(x)
        x, _ = self.lstm2(x)
        x = x[:, -1, :]
        x = torch.relu(self.fc1(x))
        return self.fc2(x)

model = LSTMModel(64, 32, 16)
state = torch.load("models/model_lstm.pt", map_location="cpu")
model.load_state_dict(state)
model.eval()

app = FastAPI()

@app.get("/metrics")
async def prom():
    data = metrics()
    return Response(content=data, media_type="text/plain")

@app.post("/predict")
async def predict(payload: dict):
    seq = payload["sequence"]
    seq = np.array(seq, dtype=np.float32).reshape(-1, 1)
    seq_scaled = scale_x(seq)
    X = torch.tensor(seq_scaled, dtype=torch.float32).unsqueeze(0)
    with torch.no_grad():
        pred_scaled = model(X)[0].numpy()
    pred = inverse_scale_y(pred_scaled)
    effect = float(pred[0])
    side = float(pred[1])
    return {"effect": effect, "sideEffect": side}
