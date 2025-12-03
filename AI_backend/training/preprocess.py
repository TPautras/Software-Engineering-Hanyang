import pandas as pd

df = pd.read_csv("data.csv")
df["gender"] = df["bodyInfo"].apply(lambda x: 1 if "male" in x else 0)
df["weight"] = df["bodyInfo"].apply(lambda x: x["weight"] if isinstance(x, dict) else 70)
df.to_csv("processed.csv", index=False)
