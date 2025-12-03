import firebase_admin
from firebase_admin import credentials, firestore
import pandas as pd

cred = credentials.Certificate("serviceAccountKey.json")
firebase_admin.initialize_app(cred)
db = firestore.client()

def ref_to_uid(ref):
    return ref.id if ref is not None else None

def load_collection(name, rename_map):
    rows = []
    for doc in db.collection(name).stream():
        d = doc.to_dict()
        row = {}
        for k, v in d.items():
            if isinstance(v, firestore.DocumentReference):
                row["user"] = ref_to_uid(v)
            else:
                row[k] = v
        for k_old, k_new in rename_map.items():
            if k_old in row:
                row[k_new] = row.pop(k_old)
        row["collection"] = name
        rows.append(row)
    return rows

concentrations = load_collection("concentrations", {"timestamp": "timestamp"})
feedback = load_collection("feedback", {"timestamp": "timestamp"})
dose = load_collection("dose", {"doseTimestamp": "timestamp"})

df_c = pd.DataFrame(concentrations)
df_f = pd.DataFrame(feedback)
df_d = pd.DataFrame(dose)

df_c["timestamp"] = pd.to_datetime(df_c["timestamp"], errors="coerce")
df_f["timestamp"] = pd.to_datetime(df_f["timestamp"], errors="coerce")
df_d["timestamp"] = pd.to_datetime(df_d["timestamp"], errors="coerce")

df_c = df_c.dropna(subset=["user"])
df_f = df_f.dropna(subset=["user"])
df_d = df_d.dropna(subset=["user"])

df_d["doseTaken"] = 1

df = pd.merge_asof(
    df_c.sort_values("timestamp"),
    df_f.sort_values("timestamp"),
    on="timestamp",
    by="user",
    direction="nearest",
    tolerance=pd.Timedelta("2h")
)

df = pd.merge_asof(
    df.sort_values("timestamp"),
    df_d.sort_values("timestamp"),
    on="timestamp",
    by="user",
    direction="backward",
    tolerance=pd.Timedelta("6h")
)

df = df.sort_values(["user", "timestamp"])

df.to_csv("dataset.csv", index=False)

print("Dataset rows:", len(df))
print(df.head())
