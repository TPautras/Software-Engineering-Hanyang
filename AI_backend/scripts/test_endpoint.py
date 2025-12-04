import requests

payload = {
    "sequence": [0.12, 0.18, 0.20, 0.25, 0.30, 0.28, 0.27, 0.32, 0.35, 0.40]
}

res = requests.post("http://localhost:8000/predict", json=payload)
print(res.json())
