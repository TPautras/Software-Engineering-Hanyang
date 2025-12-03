!pip install --quiet wandb pandas numpy scikit-learn torch

import os
import torch
import torch.nn as nn
from torch.utils.data import Dataset, DataLoader
import pandas as pd
import numpy as np
from sklearn.preprocessing import MinMaxScaler
from kaggle_secrets import UserSecretsClient
import wandb

os.makedirs("models", exist_ok=True)

user_secrets = UserSecretsClient()
wandb.login(key=user_secrets.get_secret("WANDB_API_KEY"))

config = {
    "seq_len": 10,
    "batch_size": 32,
    "hidden_1": 64,
    "hidden_2": 32,
    "dense": 16,
    "epochs": 15,
    "lr": 1e-3,
    "optimizer": "adam",
}

wandb.init(project="drug-effect-lstm", config=config)

df = pd.read_csv("/kaggle/input/drug-side-effect-v1/dataset.csv")
df = df.dropna(subset=["concentration"])
df = df.sort_values(["user","timestamp"])

features = ["concentration"]
labels = ["effect","sideEffect"]

scaler_x = MinMaxScaler()
scaler_y = MinMaxScaler()

X_scaled = scaler_x.fit_transform(df[features].values)
y_scaled = scaler_y.fit_transform(df[labels].fillna(0).values)

seq_len = config["seq_len"]
X_seq = []
y_seq = []

for i in range(len(X_scaled) - seq_len):
    X_seq.append(X_scaled[i:i+seq_len])
    y_seq.append(y_scaled[i+seq_len])

X_seq = np.array(X_seq).reshape(-1, seq_len, 1)
y_seq = np.array(y_seq)

class SeqDataset(Dataset):
    def __init__(self, X, y):
        self.X = torch.tensor(X, dtype=torch.float32)
        self.y = torch.tensor(y, dtype=torch.float32)
    def __len__(self):
        return len(self.X)
    def __getitem__(self, idx):
        return self.X[idx], self.y[idx]

dataset = SeqDataset(X_seq, y_seq)
dataloader = DataLoader(dataset, batch_size=config["batch_size"], shuffle=True)

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

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
model = LSTMModel(config["hidden_1"], config["hidden_2"], config["dense"]).to(device)
criterion = nn.MSELoss()
optimizer = torch.optim.Adam(model.parameters(), lr=config["lr"])

for epoch in range(config["epochs"]):
    epoch_loss = 0
    for Xb, yb in dataloader:
        Xb = Xb.to(device)
        yb = yb.to(device)
        optimizer.zero_grad()
        preds = model(Xb)
        loss = criterion(preds, yb)
        loss.backward()
        optimizer.step()

        epoch_loss += loss.item() * len(Xb)

        wandb.log({"batch_loss": loss.item()})
        for name, param in model.named_parameters():
            wandb.log({f"gradients/{name}": wandb.Histogram(param.grad.cpu().detach().numpy())})
            wandb.log({f"weights/{name}": wandb.Histogram(param.data.cpu().detach().numpy())})

    epoch_loss /= len(dataset)

    wandb.log({"epoch_loss": epoch_loss})

sample_X = torch.tensor(X_seq[:32], dtype=torch.float32).to(device)
sample_pred = model(sample_X).detach().cpu().numpy()
sample_true = y_seq[:32]

table = wandb.Table(columns=["pred_effect","pred_side","true_effect","true_side"])
for p, t in zip(sample_pred, sample_true):
    table.add_data(p[0], p[1], t[0], t[1])

wandb.log({"predictions": table})

os.makedirs("models", exist_ok=True)
torch.save(model.state_dict(), "models/model_lstm.pt")

import h5py
with h5py.File("models/model_lstm.h5", "w") as f:
    f.create_dataset("weights", data=np.concatenate([p.detach().cpu().numpy().flatten() for p in model.parameters()]))

artifact = wandb.Artifact("lstm-model", type="model")
artifact.add_file("models/model_lstm.h5")
artifact.add_file("models/model_lstm.pt")
wandb.log_artifact(artifact)

np.save("models/scaler_x_scale.npy", scaler_x.scale_)
np.save("models/scaler_x_min.npy", scaler_x.min_)
np.save("models/scaler_y_scale.npy", scaler_y.scale_)
np.save("models/scaler_y_min.npy", scaler_y.min_)
