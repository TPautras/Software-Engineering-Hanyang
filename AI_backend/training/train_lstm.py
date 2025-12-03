import pandas as pd
import numpy as np
import wandb
import tensorflow as tf
from sklearn.preprocessing import MinMaxScaler

wandb.init(project="drug-effect-lstm")

df = pd.read_csv("training/dataset.csv")

df = df.dropna(subset=["concentration"])
df = df.sort_values(["user", "timestamp"])

features = ["concentration"]
labels = ["effect", "sideEffect"]

scaler_x = MinMaxScaler()
scaler_y = MinMaxScaler()

X_scaled = scaler_x.fit_transform(df[features].values)
y_scaled = scaler_y.fit_transform(df[labels].fillna(0).values)

seq_len = 10
X_seq = []
y_seq = []

for i in range(len(X_scaled) - seq_len):
    X_seq.append(X_scaled[i:i+seq_len])
    y_seq.append(y_scaled[i+seq_len])

X_seq = np.array(X_seq)
y_seq = np.array(y_seq)

model = tf.keras.Sequential([
    tf.keras.layers.LSTM(64, return_sequences=True, input_shape=(seq_len, 1)),
    tf.keras.layers.LSTM(32),
    tf.keras.layers.Dense(16, activation="relu"),
    tf.keras.layers.Dense(2)
])

model.compile(optimizer="adam", loss="mse")

history = model.fit(
    X_seq, y_seq, epochs=20, batch_size=32,
    callbacks=[wandb.keras.WandbCallback()]
)

model.save("models/model_lstm.h5")
np.save("models/scaler_x.npy", scaler_x.scale_)
np.save("models/min_x.npy", scaler_x.min_)
np.save("models/scaler_y.npy", scaler_y.scale_)
np.save("models/min_y.npy", scaler_y.min_)
