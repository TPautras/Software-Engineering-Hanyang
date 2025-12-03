import firebase_admin
from firebase_admin import credentials, firestore
import json

cred = credentials.Certificate("serviceAccountKey.json")
firebase_admin.initialize_app(cred)
db = firestore.client()

print("ROOT COLLECTIONS:")
root = db.collections()
for col in root:
    print(" -", col.id)
    docs = col.stream()
    for d in docs:
        print("   DOC:", d.id)
        data = d.to_dict()
        print("     FIELDS:", json.dumps(data, indent=2, default=str))

        subcols = db.collection(col.id).document(d.id).collections()
        for s in subcols:
            print("     SUBCOLLECTION:", s.id)
            for sd in s.stream():
                print("        SUBDOC:", sd.id)
                print("        SUBDATA:", json.dumps(sd.to_dict(), indent=2, default=str))
