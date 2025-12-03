import firebase_admin
from firebase_admin import credentials, firestore
import pandas as pd

cred = credentials.Certificate("serviceAccountKey.json")
firebase_admin.initialize_app(cred)
db = firestore.client()

all_rows = []

users = db.collection("users").stream()

for u in users:
    user_id = u.id
    docs = db.collection("users").document(user_id).collection("measurements").stream()
    for d in docs:
        row = d.to_dict()
        row["user"] = user_id
        all_rows.append(row)

df = pd.DataFrame(all_rows)
df = df.sort_values(["user","timestamp"])

df.to_csv("data.csv", index=False)
