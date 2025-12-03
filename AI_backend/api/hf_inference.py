import requests
import json

url = "HF_ENDPOINT_URL"
token = "HF_TOKEN"
headers = {"Authorization": f"Bearer {token}"}

def hf_predict(sequence):
    payload = {"inputs": sequence}
    r = requests.post(url, headers=headers, data=json.dumps(payload))
    return r.json()
