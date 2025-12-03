import pandas as pd
import numpy as np
import tensorflow as tf
import wandb
from wandb.keras import WandbCallback

wandb.init(project="medoc-effects")

df = pd.read_csv("data.csv")

df["gender"] = df["bodyInfo"].apply(lambda x: 1 if "male" in x else 0)
df["weight"] = df["bodyInfo"].apply(lambda x: x["weight"] if isinstance(x, dict) else 70)

X = df[["concentration","gender","weight"]].values
y = df[["effect","sideEffect"]].values

model = tf.keras.Sequential([
    tf.keras.layers.Dense(32, activation="relu", input_shape=(3,)),
    tf.keras.layers.Dense(16, activation="relu"),
    tf.keras.layers.Dense(2)
])

model.compile(optimizer="adam", loss="mse")

model.fit(
    X, y,
    epochs=60,
    batch_size=32,
    validation_split=0.2,
    callbacks=[WandbCallback()]
)

model.save("models/model_mlp.h5")
